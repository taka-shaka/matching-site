import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

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

// Member 10人 + Customer 5人のみ（Adminは削除しない）
const userIdsToDelete = [
  "c9207578-e9b3-461b-831d-f5a2a4b6e76a", // customer5
  "238ef01c-c8ef-4e5a-9095-b33370f87aeb", // customer4
  "34cedf35-2b01-461e-9f01-d0070ace72b0", // customer3
  "36e7c2cb-6118-4b03-917b-c58e2717f2e5", // customer2
  "73ee2c8c-eeb9-46a2-b6c2-7b0755550964", // customer1
  "f60fb85f-ac0f-48ad-b4ad-7a50dcbd42fa", // kato
  "23f44ad4-3813-493a-b361-bfcdad9392c5", // kobayashi
  "5153c3cf-8a16-4597-b3ed-5933f9572378", // nakamura
  "3df4c6f6-f79f-4ddb-b56b-9c2b29d09ebc", // ito
  "53ab83eb-7ae7-4137-8254-1322217d099b", // watanabe
  "52bb8fad-af0a-43d1-8d0a-80b1ed0b8049", // takahashi
  "2b6d0692-053d-473c-85fb-06b941d5e9cb", // suzuki
  "cfaa7c62-be5b-497b-ad6f-dacbe61d0f26", // sato
  "0c46ef46-f23d-4183-b48a-df35f16a74b4", // tanaka
  "9aa0d524-a513-4470-a816-45ae2de43c38", // yamada
];

async function deleteUsers() {
  console.log(
    `🗑️  Deleting ${userIdsToDelete.length} Auth users (Members + Customers)...\n`
  );
  console.log(`⚠️  Admin Auth will NOT be deleted\n`);

  let successCount = 0;
  let failCount = 0;

  for (const userId of userIdsToDelete) {
    try {
      const { data, error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        console.error(`❌ Failed to delete ${userId}:`, error.message);
        failCount++;
      } else {
        console.log(`✅ Deleted user: ${userId}`);
        successCount++;
      }

      // Rate limiting対策: 少し待機
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (err) {
      console.error(`❌ Error deleting ${userId}:`, err);
      failCount++;
    }
  }

  console.log(`\n📊 Deletion Summary:`);
  console.log(`  ✅ Success: ${successCount}`);
  console.log(`  ❌ Failed: ${failCount}`);
  console.log(`  📝 Total: ${userIdsToDelete.length}`);

  if (successCount === userIdsToDelete.length) {
    console.log(`\n✅ All users deleted successfully!`);
    console.log(
      `\n🔄 Next step: Run "npx prisma db seed" to recreate all data`
    );
  }
}

deleteUsers();
