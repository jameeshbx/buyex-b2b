const { PrismaClient, UserRole } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  try {
    // Create main organisation for system users
    const mainOrg = await prisma.organisation.create({
      data: {
        name: "Buy Exchange",
        slug: "buy-exchange",
        email: "admin@buyex.com",
        phoneNumber: "+1234567890",
      },
    });

    // Create Super Admin
    const superAdminPassword = await bcrypt.hash("@Password123", 10);
    const superAdmin = await prisma.user.create({
      data: {
        email: "superadmin@buyex.com",
        name: "Super Admin",
        password: superAdminPassword,
        role: UserRole.SUPER_ADMIN,
        emailVerified: new Date(),
        organisationId: mainOrg.id,
      },
    });

    // Create Admin
    const adminPassword = await bcrypt.hash("Admin@123", 10);
    const admin = await prisma.user.create({
      data: {
        email: "admin@buyex.com",
        name: "Admin User",
        password: adminPassword,
        role: UserRole.ADMIN,
        emailVerified: new Date(),
        organisationId: mainOrg.id,
      },
    });

    console.log("Successfully created users:", { superAdmin, admin });
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("Failed to seed database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
