const { PrismaClient, UserRole } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Create Super Admin
  const superAdminPassword = await bcrypt.hash("SuperAdmin@123", 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@buyex.com" },
    update: {},
    create: {
      email: "superadmin@buyex.com",
      name: "Super Admin",
      password: superAdminPassword,
      role: UserRole.SUPER_ADMIN,
      emailVerified: new Date(),
    },
  });

  // Create Admin
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@buyex.com" },
    update: {},
    create: {
      email: "admin@buyex.com",
      name: "Admin User",
      password: adminPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  });

  console.log({ superAdmin, admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
