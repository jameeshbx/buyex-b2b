import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { generateRandomPassword } from "@/lib/utils";
import { hash } from "bcryptjs";

// Validation schema for user creation
const createUserSchema = z.object({
  userType: z.enum(["Admin", "Staff", "Agent"]),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  organisationId: z.string().optional(),
  agentRate: z.number().min(0).max(100).optional(),
  forexPartner: z.string().optional(),
  buyexRate: z.number().min(0).max(100).optional(),
}).superRefine((data, ctx) => {
  if (data.userType === "Agent") {
    if (!data.organisationId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Organisation is required for Agent users",
        path: ["organisationId"],
      });
    }
    if (data.agentRate === undefined || data.agentRate < 0 || data.agentRate > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Agent rate is required and must be between 0 and 100 for Agent users",
        path: ["agentRate"],
      });
    }
  }
});

// Validation schema for user update
const updateUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
  role: z.enum(["ADMIN", "MANAGER", "AGENT"]).optional(),
  organisationId: z.string().optional(),
  agentRate: z.number().min(0).max(100).optional(),
  forexPartner: z.string().optional(),
  buyexRate: z.number().min(0).max(100).optional(),
});

// Create invitation email template
const createInvitationEmail = (name: string, email: string, password: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Buyex Forex</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; }
        .logo { max-width: 150px; }
        .button { 
            display: inline-block;
            padding: 12px 24px;
            background-color: #004976;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            margin: 20px 0;
        }
        .footer { 
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/buyex-main-logo.png" alt="Buyex Forex Logo" class="logo">
        </div>
        <h2>Welcome to Buyex Forex!</h2>
        <p>Hello ${name},</p>
        <p>You have been invited to join Buyex Forex. Here are your login credentials:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${password}</p>
        <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password" class="button">Reset password</a>
        </div>
        <p>For security reasons, please change your password after your first login.</p>
        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Buyex Forex. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Validate request body
    const validatedData = createUserSchema.parse(body);
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Generate a random password
    const temporaryPassword = generateRandomPassword();
    const hashedPassword = await hash(temporaryPassword, 12);

    // Create user in database
    const user = await db.user.create({
      data: {
        role: validatedData.userType === "Staff" ? "MANAGER" : 
              validatedData.userType === "Agent" ? "AGENT" : "ADMIN",
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        organisationId: validatedData.organisationId || null,
        agentRate: validatedData.agentRate || null,
        forexPartner: validatedData.forexPartner || null,
        buyexRate: validatedData.buyexRate || null,
      },
    });

    // Send invitation email
    try {
      await sendEmail({
        to: validatedData.email,
        subject: "Welcome to Buyex Forex",
        html: createInvitationEmail(
          validatedData.name,
          validatedData.email,
          temporaryPassword
        ),
      });
    } catch (emailError) {
      console.error("Failed to send email, but user was created:", emailError);
      // Continue with user creation even if email fails
    }

    return NextResponse.json(
      { 
        message: "User created successfully",
        user: {
          id: user.id,
          userId: user.id,
          userRole: user.role,
          name: user.name,
          email: user.email,
          organisationId: user.organisationId,
          agentRate: user.agentRate,
          forexPartner: user.forexPartner,
          buyexRate: user.buyexRate,
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

    console.error("Error creating user:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get user by ID
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const role = searchParams.get('role');

    if (id) {
      const user = await db.user.findUnique({
        where: { id },
        select: {
          id: true,
          role: true,
          name: true,
          email: true,
          createdAt: true,
          organisationId: true,
          agentRate: true,
          forexPartner: true,
          buyexRate: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(user);
    }

    // Handle role-based filtering
    if (role === "SUPER_ADMIN") {
      const users = await db.user.findMany({
        select: {
          id: true,
          role: true,
          name: true,
          email: true,
          createdAt: true,
          organisationId: true,
          agentRate: true,
          forexPartner: true,
          buyexRate: true,
        },
      });
      return NextResponse.json(users);
    } else if (role === "AGENT") {
      // Fetch only agents for consultancy dropdown
      const agents = await db.user.findMany({
        where: {
          role: "AGENT",
          status: true, // Only active agents
        },
        select: {
          id: true,
          role: true,
          name: true,
          email: true,
          createdAt: true,
          organisationId: true,
          agentRate: true,
          forexPartner: true,
          buyexRate: true,
        },
        orderBy: {
          name: 'asc', // Sort by name alphabetically
        },
      });
      return NextResponse.json(agents);
    } else {
      const users = await db.user.findMany({
        where: {
          role: "MANAGER",
        },
        select: {
          id: true,
          role: true,
          name: true,
          email: true,
          createdAt: true,
          organisationId: true,
          agentRate: true,
          forexPartner: true,
          buyexRate: true,
        },
      });
      return NextResponse.json(users);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update user
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validatedData = updateUserSchema.parse(body);

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // If email is being updated, check if it's already in use
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await db.user.findUnique({
        where: { email: validatedData.email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        createdAt: true,
        organisationId: true,
        agentRate: true,
        forexPartner: true,
        buyexRate: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Delete user
    await db.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 