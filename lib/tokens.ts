import crypto from "crypto";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";

export async function generatePasswordResetToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600000); // 1 hour

  const existingToken = await db.passwordResetToken.findFirst({
    where: { email },
  });

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
}

export async function verifyPasswordResetToken(token: string) {
  const existingToken = await db.passwordResetToken.findUnique({
    where: { token },
  });

  if (!existingToken) {
    return null;
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
    return null;
  }

  return existingToken;
}

export async function generateVerificationToken(email: string) {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24 hours

  const existingToken = await db.verificationToken.findUnique({
    where: { email },
  });

  if (existingToken) {
    await db.verificationToken.delete({
      where: { email },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken.token;
}
