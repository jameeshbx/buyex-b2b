import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { verifyPasswordResetToken } from "@/lib/tokens";

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = resetPasswordSchema.parse(json);

    const existingToken = await verifyPasswordResetToken(body.token);

    if (!existingToken) {
      return new NextResponse("Invalid token", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    await db.user.update({
      where: { email: existingToken.email },
      data: { password: hashedPassword },
    });

    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    return new NextResponse("Password updated successfully", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }

    return new NextResponse(null, { status: 500 });
  }
}
