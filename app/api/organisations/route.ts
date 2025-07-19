import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

// Validation schema for organization creation
const createOrganisationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  slug: z.string().min(2, { message: "Slug must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  commission: z.number().min(0, { message: "Commission must be at least 0" }).max(100, { message: "Commission cannot exceed 100%" }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  logoUrl: z.string().url({ message: "Please enter a valid URL" }).optional(),
  settings: z.record(z.any()).optional(),
});

// Validation schema for organization update
const updateOrganisationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
  slug: z.string().min(2, { message: "Slug must be at least 2 characters" }).optional(),
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
  commission: z.number().min(0, { message: "Commission must be at least 0" }).max(100, { message: "Commission cannot exceed 100%" }).optional(),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 characters" }).optional(),
  logoUrl: z.string().url({ message: "Please enter a valid URL" }).optional(),
  settings: z.record(z.any()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Validate request body
    const validatedData = createOrganisationSchema.parse(body);
    
    // Check if organization with this slug already exists
    const existingOrganisation = await db.organisation.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingOrganisation) {
      return NextResponse.json(
        { error: "Organization with this slug already exists" },
        { status: 400 }
      );
    }

    // Check if organization with this email already exists
    const existingEmail = await db.organisation.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Organization with this email already exists" },
        { status: 400 }
      );
    }

    // Create organization in database
    const organisation = await db.organisation.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        email: validatedData.email,
        commission: validatedData.commission,
        phoneNumber: validatedData.phoneNumber,
        logoUrl: validatedData.logoUrl,
        settings: validatedData.settings || {},
      },
    });

    return NextResponse.json(
      { 
        message: "Organization created successfully",
        organisation: {
          id: organisation.id,
          name: organisation.name,
          slug: organisation.slug,
          email: organisation.email,
          commission: organisation.commission,
          phoneNumber: organisation.phoneNumber,
          logoUrl: organisation.logoUrl,
          settings: organisation.settings,
          createdAt: organisation.createdAt,
          updatedAt: organisation.updatedAt,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get organizations
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const organisation = await db.organisation.findUnique({
        where: { id },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            }
          }
        }
      });

      if (!organisation) {
        return NextResponse.json(
          { error: "Organization not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(organisation);
    }

    // Get all organizations
    const organisations = await db.organisation.findMany({
      include: {
        _count: {
          select: {
            users: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(organisations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update organization
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validatedData = updateOrganisationSchema.parse(body);

    // Check if organization exists
    const existingOrganisation = await db.organisation.findUnique({
      where: { id },
    });

    if (!existingOrganisation) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // If slug is being updated, check if it's already in use
    if (validatedData.slug && validatedData.slug !== existingOrganisation.slug) {
      const slugExists = await db.organisation.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Slug already in use" },
          { status: 400 }
        );
      }
    }

    // If email is being updated, check if it's already in use
    if (validatedData.email && validatedData.email !== existingOrganisation.email) {
      const emailExists = await db.organisation.findUnique({
        where: { email: validatedData.email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // Update organization
    const updatedOrganisation = await db.organisation.update({
      where: { id },
      data: validatedData,
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    return NextResponse.json(updatedOrganisation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating organization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete organization
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Check if organization exists
    const existingOrganisation = await db.organisation.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    if (!existingOrganisation) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Check if organization has users
    if (existingOrganisation._count.users > 0) {
      return NextResponse.json(
        { error: "Cannot delete organization with associated users" },
        { status: 400 }
      );
    }

    // Delete organization
    await db.organisation.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Organization deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting organization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 