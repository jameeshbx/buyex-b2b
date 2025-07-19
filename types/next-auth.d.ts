import { DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      organisation?: {
        id: string;
        name: string;
        commission: number;
      } | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    organisation?: {
      id: string;
      name: string;
      commission: number;
    } | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
  }
}
