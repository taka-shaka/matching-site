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

async function checkAdmin() {
  try {
    const admins = await prisma.admin.findMany();

    console.log("\n📊 Admin Records:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Total Admins: ${admins.length}`);

    admins.forEach((admin) => {
      console.log(`\nID: ${admin.id}`);
      console.log(`Email: ${admin.email}`);
      console.log(`Name: ${admin.name}`);
      console.log(`AuthID: ${admin.authId}`);
      console.log(`Role: ${admin.role}`);
      console.log(`isActive: ${admin.isActive}`);
      console.log(`Created: ${admin.createdAt}`);
    });
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

checkAdmin();
