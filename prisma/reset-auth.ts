// prisma/reset-auth.ts
// Supabase認証ユーザーを全削除するスクリプト

import * as dotenv from "dotenv";
import * as path from "path";

// .env.localを優先的に読み込む
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { createClient } from "@supabase/supabase-js";

// Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

async function resetAuth() {
  console.log("🗑️  Deleting all Supabase auth users...");

  try {
    // 全ユーザーを取得
    const { data: users, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      console.error("❌ Failed to list users:", listError);
      process.exit(1);
    }

    if (!users || users.users.length === 0) {
      console.log("✅ No users to delete");
      return;
    }

    console.log(`📋 Found ${users.users.length} users to delete`);

    // 全ユーザーを削除
    let successCount = 0;
    let errorCount = 0;

    for (const user of users.users) {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
      if (error) {
        console.error(`❌ Failed to delete user ${user.email}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Deleted user: ${user.email}`);
        successCount++;
      }
    }

    console.log("\n📊 Summary:");
    console.log(`  Successfully deleted: ${successCount} users`);
    console.log(`  Failed: ${errorCount} users`);

    if (errorCount > 0) {
      console.log(
        "\n⚠️  Some users could not be deleted. Please check the errors above."
      );
      process.exit(1);
    }

    console.log("\n✨ All Supabase auth users have been deleted!");
    console.log("🌱 Now you can run 'npm run seed' to create fresh test data");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  }
}

resetAuth().catch((e) => {
  console.error("❌ Reset auth failed:", e);
  process.exit(1);
});
