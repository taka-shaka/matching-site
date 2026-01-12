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

async function checkUsers() {
  const { data, error } = await supabase.auth.admin.listUsers({
    perPage: 50,
  });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log(`\n📊 Total Auth Users: ${data.users.length}\n`);

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

  data.users.forEach((user) => {
    const userType = user.app_metadata?.user_type || "unknown";
    const isMember = memberEmails.includes(user.email);
    const isCustomer = customerEmails.includes(user.email);
    const shouldDelete = isMember || isCustomer;

    console.log(
      `${shouldDelete ? "❌ DELETE" : "✅ KEEP"} ${user.email} (${userType}) - Created: ${new Date(user.created_at).toLocaleString("ja-JP")}`
    );
  });

  const toDelete = data.users.filter(
    (u) => memberEmails.includes(u.email) || customerEmails.includes(u.email)
  );

  console.log(`\n🗑️  Users that should be deleted: ${toDelete.length}`);
  toDelete.forEach((u) => console.log(`  - ${u.email} (ID: ${u.id})`));
}

checkUsers();
