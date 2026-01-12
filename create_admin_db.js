import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env.local") });
dotenv.config({ path: path.resolve(__dirname, ".env") });

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function createAdminDB() {
  try {
    // Check if admin already exists
    const existing = await prisma.admin.findFirst({
      where: { email: "admin@housematch.test" },
    });

    if (existing) {
      console.log("⚠️  Admin DB record already exists");
      console.log("ID:", existing.id);
      console.log("Email:", existing.email);
      console.log("isActive:", existing.isActive);
      return;
    }

    // Create admin DB record
    const admin = await prisma.admin.create({
      data: {
        authId: "3c7ae855-a428-4afc-9594-828a83533a21",
        email: "admin@housematch.test",
        name: "管理者テスト",
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });

    console.log("\n✅ Admin DB Record Created:");
    console.log("ID:", admin.id);
    console.log("Email:", admin.email);
    console.log("Name:", admin.name);
    console.log("Role:", admin.role);
    console.log("isActive:", admin.isActive);
    console.log("\n🎉 You can now login with:");
    console.log("   Email: admin@housematch.test");
    console.log("   Password: Admin123!\n");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

createAdminDB();
