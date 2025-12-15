// prisma/seed.ts
// プロトタイプ用シードデータ - 最小限の初期データ

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { createClient } from "@supabase/supabase-js";

// PostgreSQL connection pool
// seed時はDIRECT_URLを使用（Session poolerではエラーになるため）
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

async function main() {
  console.log("🌱 プロトタイプ用シードデータを投入します...\n");

  // ===== 1. 管理者アカウント =====
  console.log("📝 管理者アカウントを作成中...");

  try {
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: "admin@example.com",
        password: "admin123456",
        email_confirm: true,
        app_metadata: {
          user_type: "admin",
        },
      });

    if (authError) throw authError;

    await prisma.admin.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        authId: authData.user!.id,
        email: "admin@example.com",
        name: "システム管理者",
        role: "SUPER_ADMIN",
      },
    });

    console.log("✅ 管理者アカウント作成完了");
    console.log("   Email: admin@example.com");
    console.log("   Password: admin123456\n");
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (
      err.code === "email_exists" ||
      err.message?.includes("already exists")
    ) {
      console.log("⚠️  管理者アカウントは既に存在します\n");
    } else {
      throw error;
    }
  }

  // ===== 2. 基本タグ（20個） =====
  console.log("📝 タグマスタを投入中...");

  const tags = [
    // 家タイプ（5個）
    { name: "注文住宅", category: "HOUSE_TYPE" as const, displayOrder: 1 },
    { name: "リフォーム", category: "HOUSE_TYPE" as const, displayOrder: 2 },
    {
      name: "リノベーション",
      category: "HOUSE_TYPE" as const,
      displayOrder: 3,
    },
    { name: "建て替え", category: "HOUSE_TYPE" as const, displayOrder: 4 },
    { name: "新築分譲住宅", category: "HOUSE_TYPE" as const, displayOrder: 5 },

    // 価格帯（5個）
    { name: "1000万円〜", category: "PRICE_RANGE" as const, displayOrder: 1 },
    { name: "2000万円〜", category: "PRICE_RANGE" as const, displayOrder: 2 },
    { name: "3000万円〜", category: "PRICE_RANGE" as const, displayOrder: 3 },
    { name: "4000万円〜", category: "PRICE_RANGE" as const, displayOrder: 4 },
    { name: "5000万円〜", category: "PRICE_RANGE" as const, displayOrder: 5 },

    // 構造（5個）
    { name: "平屋", category: "STRUCTURE" as const, displayOrder: 1 },
    { name: "3階建て以上", category: "STRUCTURE" as const, displayOrder: 2 },
    { name: "二世帯住宅", category: "STRUCTURE" as const, displayOrder: 3 },
    { name: "ガレージハウス", category: "STRUCTURE" as const, displayOrder: 4 },
    { name: "バリアフリー", category: "STRUCTURE" as const, displayOrder: 5 },

    // デザイン（5個）
    { name: "ナチュラル", category: "ATMOSPHERE" as const, displayOrder: 1 },
    {
      name: "シンプルモダン",
      category: "ATMOSPHERE" as const,
      displayOrder: 2,
    },
    { name: "北欧風", category: "ATMOSPHERE" as const, displayOrder: 3 },
    {
      name: "アメリカンスタイル",
      category: "ATMOSPHERE" as const,
      displayOrder: 4,
    },
    { name: "カフェ風", category: "ATMOSPHERE" as const, displayOrder: 5 },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: {
        name: tag.name,
        category: tag.category,
        displayOrder: tag.displayOrder,
      },
    });
  }

  console.log("✅ タグマスタ投入完了: 20件\n");

  // ===== 3. サンプル工務店（2社） =====
  console.log("📝 サンプル工務店を作成中...");

  const company1 = await prisma.company.upsert({
    where: { email: "company1@example.com" },
    update: {},
    create: {
      name: "ナゴヤホーム株式会社",
      description:
        "名古屋市を中心に注文住宅を手がける工務店です。お客様の理想の住まいを一緒に作り上げます。",
      address: "名古屋市中区栄1-1-1",
      prefecture: "愛知県",
      city: "名古屋市中区",
      phoneNumber: "052-123-4567",
      email: "company1@example.com",
      websiteUrl: "https://nagoya-home.example.com",
      isPublished: true,
    },
  });

  const company2 = await prisma.company.upsert({
    where: { email: "company2@example.com" },
    update: {},
    create: {
      name: "東海ハウジング",
      description:
        "自然素材にこだわった家づくりを得意としています。健康的で快適な住まいをご提案します。",
      address: "名古屋市東区泉1-2-3",
      prefecture: "愛知県",
      city: "名古屋市東区",
      phoneNumber: "052-234-5678",
      email: "company2@example.com",
      websiteUrl: "https://tokai-housing.example.com",
      isPublished: true,
    },
  });

  console.log("✅ サンプル工務店作成完了: 2社");
  console.log(`   - ${company1.name}`);
  console.log(`   - ${company2.name}\n`);

  // ===== 4. 工務店担当者（各社1名） =====
  console.log("📝 工務店担当者を作成中...");

  try {
    // 会社1の担当者
    const { data: member1Auth } = await supabaseAdmin.auth.admin.createUser({
      email: "member1@example.com",
      password: "member123456",
      email_confirm: true,
      app_metadata: {
        user_type: "member",
        company_id: company1.id,
      },
    });

    if (member1Auth.user) {
      await prisma.member.upsert({
        where: { email: "member1@example.com" },
        update: {},
        create: {
          authId: member1Auth.user.id,
          email: "member1@example.com",
          name: "山田太郎",
          role: "ADMIN",
          companyId: company1.id,
        },
      });
    }

    // 会社2の担当者
    const { data: member2Auth } = await supabaseAdmin.auth.admin.createUser({
      email: "member2@example.com",
      password: "member123456",
      email_confirm: true,
      app_metadata: {
        user_type: "member",
        company_id: company2.id,
      },
    });

    if (member2Auth.user) {
      await prisma.member.upsert({
        where: { email: "member2@example.com" },
        update: {},
        create: {
          authId: member2Auth.user.id,
          email: "member2@example.com",
          name: "佐藤花子",
          role: "ADMIN",
          companyId: company2.id,
        },
      });
    }

    console.log("✅ 工務店担当者作成完了: 2名");
    console.log("   - member1@example.com / member123456");
    console.log("   - member2@example.com / member123456\n");
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (
      err.code === "email_exists" ||
      err.message?.includes("already exists")
    ) {
      console.log("⚠️  工務店担当者は既に存在します\n");
    } else {
      throw error;
    }
  }

  // ===== 5. サンプル顧客（1名） =====
  console.log("📝 サンプル顧客を作成中...");

  try {
    const { data: customerAuth } = await supabaseAdmin.auth.admin.createUser({
      email: "customer@example.com",
      password: "customer123456",
      email_confirm: true,
      app_metadata: {
        user_type: "customer",
      },
    });

    if (customerAuth.user) {
      await prisma.customer.upsert({
        where: { email: "customer@example.com" },
        update: {},
        create: {
          authId: customerAuth.user.id,
          email: "customer@example.com",
          lastName: "田中",
          firstName: "次郎",
          phoneNumber: "090-1234-5678",
        },
      });
    }

    console.log("✅ サンプル顧客作成完了: 1名");
    console.log("   - customer@example.com / customer123456\n");
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (
      err.code === "email_exists" ||
      err.message?.includes("already exists")
    ) {
      console.log("⚠️  サンプル顧客は既に存在します\n");
    } else {
      throw error;
    }
  }

  console.log("🎉 プロトタイプ用シードデータの投入が完了しました！\n");
  console.log("📊 投入データサマリー:");
  console.log("   - 管理者: 1名");
  console.log("   - 工務店: 2社");
  console.log("   - 担当者: 2名");
  console.log("   - 顧客: 1名");
  console.log("   - タグ: 20件\n");
  console.log("🔐 ログイン情報:");
  console.log("   Admin:    admin@example.com / admin123456");
  console.log("   Member:   member1@example.com / member123456");
  console.log("   Customer: customer@example.com / customer123456");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ エラー発生:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
