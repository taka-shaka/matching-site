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

async function checkData() {
  try {
    const [companies, members, customers, cases, inquiries, tags] =
      await Promise.all([
        prisma.company.count(),
        prisma.member.count(),
        prisma.customer.count(),
        prisma.constructionCase.count(),
        prisma.inquiry.count(),
        prisma.tag.count(),
      ]);

    console.log("\n📊 Database Content Check:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Companies:        ${companies}`);
    console.log(`Members:          ${members}`);
    console.log(`Customers:        ${customers}`);
    console.log(`Construction Cases: ${cases}`);
    console.log(`Inquiries:        ${inquiries}`);
    console.log(`Tags:             ${tags}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    if (companies === 0) {
      console.log("❌ No data found in database!");
      console.log("   Run: npx prisma db seed");
    } else {
      console.log("✅ Data exists in database");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

checkData();
