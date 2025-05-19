import { NextResponse } from "next/server";
import { formSchema } from "@/schema/signupSchema";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = formSchema.parse(body);

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

    // Check if organisation with same name exists
    const existingOrg = await db.organisation.findFirst({
      where: { name: validatedData.organisationName },
    });

    if (existingOrg) {
      return NextResponse.json(
        { error: "Organisation with this name already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 12);

    // Create organisation and user in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create organisation
      const organisation = await tx.organisation.create({
        data: {
          name: validatedData.organisationName,
          slug: slugify(validatedData.organisationName),
          email: validatedData.email,
          phoneNumber: validatedData.phoneNumber,
        },
      });

      // Create user
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          organisationId: organisation.id,
          role: "ORGANISATION_ADMIN", // First user of the organisation is admin
        },
      });

      return { user, organisation };
    });

    // Generate verification token
    const verificationToken = await generateVerificationToken(
      result.user.email
    );

    // Try to send verification email, but don't fail if it doesn't work
    try {
      await sendVerificationEmail(result.user.email, verificationToken);
    } catch (emailError) {
      console.error("[EMAIL_ERROR]", emailError);
      // Continue with the signup process even if email fails
    }

    return NextResponse.json(
      {
        message:
          "Account created successfully. Please check your email to verify your account.",
        organisationId: result.organisation.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SIGNUP_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
