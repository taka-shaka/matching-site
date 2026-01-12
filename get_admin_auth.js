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

async function getAdminAuth() {
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error("Error:", error);
    return;
  }

  const admin = data.users.find((u) => u.email === "admin@housematch.test");

  if (admin) {
    console.log("\n✅ Admin Auth User Found:");
    console.log("ID:", admin.id);
    console.log("Email:", admin.email);
    console.log("Created:", new Date(admin.created_at).toLocaleString("ja-JP"));
    console.log("\nUse this ID to create DB record\n");
  } else {
    console.log("\n❌ Admin Auth User NOT found");
    console.log("Need to create admin Auth user first\n");
  }
}

getAdminAuth();
