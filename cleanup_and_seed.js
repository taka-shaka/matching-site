import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env.local") });
dotenv.config({ path: path.resolve(__dirname, ".env") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// メンバーとカスタマーのメールリスト（seed.tsと一致）
const memberEmails = [
  "yamada@nagoya-home.test",
  "tanaka@nagoya-home.test",
  "sato@toyota-housing.test",
  "suzuki@okazaki-komuten.test",
  "takahashi@ichinomiya.test",
  "watanabe@kasugai.test",
  "ito@gifu-housing.test",
  "nakamura@mie-builders.test",
  "kobayashi@yokkaichi.test",
  "kato@tajimi.test",
];

const customerEmails = [
  "customer1@example.test",
  "customer2@example.test",
  "customer3@example.test",
  "customer4@example.test",
  "customer5@example.test",
];

async function cleanupAndSeed() {
  try {
    console.log("🔍 Step 1: Checking current database state...\n");

    const [companies, members, customers, cases, inquiries, tags] =
      await Promise.all([
        prisma.company.count(),
        prisma.member.count(),
        prisma.customer.count(),
        prisma.constructionCase.count(),
        prisma.inquiry.count(),
        prisma.tag.count(),
      ]);

    console.log("📊 Current Database State:");
    console.log(`  Companies:         ${companies}`);
    console.log(`  Members:           ${members}`);
    console.log(`  Customers:         ${customers}`);
    console.log(`  Construction Cases: ${cases}`);
    console.log(`  Inquiries:         ${inquiries}`);
    console.log(`  Tags:              ${tags}\n`);

    console.log("🔍 Step 2: Checking Auth users...\n");

    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("❌ Error listing users:", error);
      return;
    }

    const admin = data.users.find((u) => u.email === "admin@housematch.test");
    const membersToDelete = data.users.filter((u) =>
      memberEmails.includes(u.email)
    );
    const customersToDelete = data.users.filter((u) =>
      customerEmails.includes(u.email)
    );

    console.log(`✅ Found Admin: ${admin ? "YES" : "NO"}`);
    if (admin) {
      console.log(`   ID: ${admin.id}`);
      console.log(`   Email: ${admin.email}`);
    }

    console.log(
      `\n📋 Found ${membersToDelete.length} member Auth users to delete:`
    );
    membersToDelete.forEach((u) => {
      console.log(`   - ${u.email} (ID: ${u.id})`);
    });

    console.log(
      `\n📋 Found ${customersToDelete.length} customer Auth users to delete:`
    );
    customersToDelete.forEach((u) => {
      console.log(`   - ${u.email} (ID: ${u.id})`);
    });

    const totalToDelete = membersToDelete.length + customersToDelete.length;

    if (totalToDelete === 0) {
      console.log("\n✅ No member/customer Auth users to delete");
    } else {
      console.log(`\n🗑️  Step 3: Deleting ${totalToDelete} Auth users...\n`);

      let successCount = 0;
      let failCount = 0;

      const allUsersToDelete = [...membersToDelete, ...customersToDelete];

      for (const user of allUsersToDelete) {
        try {
          const { error: deleteError } = await supabase.auth.admin.deleteUser(
            user.id
          );

          if (deleteError) {
            console.error(
              `❌ Failed to delete ${user.email}:`,
              deleteError.message
            );
            failCount++;
          } else {
            console.log(`✅ Deleted: ${user.email}`);
            successCount++;
          }

          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (err) {
          console.error(`❌ Error deleting ${user.email}:`, err);
          failCount++;
        }
      }

      console.log(`\n📊 Deletion Summary:`);
      console.log(`  ✅ Success: ${successCount}`);
      console.log(`  ❌ Failed:  ${failCount}`);

      if (failCount > 0) {
        console.log("\n⚠️  Some deletions failed. Please check and retry.");
        return;
      }
    }

    console.log("\n🌱 Step 4: Running seed script...\n");

    try {
      execSync("npx prisma db seed", {
        stdio: "inherit",
        cwd: __dirname,
      });
    } catch (error) {
      console.error("\n❌ Seed script failed:", error);
      return;
    }

    console.log("\n🔍 Step 5: Verifying final database state...\n");

    const [
      finalCompanies,
      finalMembers,
      finalCustomers,
      finalCases,
      finalInquiries,
      finalTags,
      finalAdmin,
    ] = await Promise.all([
      prisma.company.count(),
      prisma.member.count(),
      prisma.customer.count(),
      prisma.constructionCase.count(),
      prisma.inquiry.count(),
      prisma.tag.count(),
      prisma.admin.count(),
    ]);

    console.log("📊 Final Database State:");
    console.log(`  Admin:             ${finalAdmin} (expected: 1)`);
    console.log(`  Companies:         ${finalCompanies} (expected: 10)`);
    console.log(`  Members:           ${finalMembers} (expected: 10)`);
    console.log(`  Customers:         ${finalCustomers} (expected: 5)`);
    console.log(`  Construction Cases: ${finalCases} (expected: 15)`);
    console.log(`  Inquiries:         ${finalInquiries} (expected: 8)`);
    console.log(`  Tags:              ${finalTags} (expected: 30)\n`);

    // 検証
    const allCorrect =
      finalAdmin === 1 &&
      finalCompanies === 10 &&
      finalMembers === 10 &&
      finalCustomers === 5 &&
      finalCases === 15 &&
      finalInquiries === 8 &&
      finalTags === 30;

    if (allCorrect) {
      console.log("✅✅✅ SUCCESS! All data created correctly! ✅✅✅\n");
      console.log("🎉 You can now:");
      console.log("   1. Login as Admin: admin@housematch.test / Admin123!");
      console.log(
        "   2. Login as Member: yamada@nagoya-home.test / Member123!"
      );
      console.log(
        "   3. Login as Customer: customer1@example.test / Customer123!\n"
      );
    } else {
      console.log("⚠️  WARNING: Data counts do not match expected values");
      console.log("   Please review the seed script output above for errors\n");
    }
  } catch (error) {
    console.error("❌ Error during cleanup and seed:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

cleanupAndSeed();
