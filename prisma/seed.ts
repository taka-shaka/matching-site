// prisma/seed.ts
// データベースにテストデータを投入するシードスクリプト

import * as dotenv from "dotenv";
import * as path from "path";

// .env.localを優先的に読み込む
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { createClient } from "@supabase/supabase-js";

// PostgreSQL接続プールの作成（DIRECT_URLを使用）
const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

// Prisma PostgreSQLアダプターの作成
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

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
  console.log("🌱 Starting seed...");

  // 既存のデータをクリア（開発環境のみ）
  console.log("🗑️  Clearing existing data...");
  await prisma.inquiryResponse.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.constructionCaseTag.deleteMany();
  await prisma.companyTag.deleteMany();
  await prisma.constructionCase.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.member.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.company.deleteMany();
  await prisma.admin.deleteMany();

  // 1. タグを作成
  console.log("📌 Creating tags...");
  const tags = await Promise.all([
    // 住宅タイプ
    prisma.tag.create({
      data: { name: "二階建て", category: "HOUSE_TYPE", displayOrder: 1 },
    }),
    prisma.tag.create({
      data: { name: "平屋", category: "HOUSE_TYPE", displayOrder: 2 },
    }),
    prisma.tag.create({
      data: { name: "三階建て", category: "HOUSE_TYPE", displayOrder: 3 },
    }),
    // 価格帯
    prisma.tag.create({
      data: { name: "2000万円台", category: "PRICE_RANGE", displayOrder: 1 },
    }),
    prisma.tag.create({
      data: { name: "3000万円台", category: "PRICE_RANGE", displayOrder: 2 },
    }),
    prisma.tag.create({
      data: { name: "4000万円台", category: "PRICE_RANGE", displayOrder: 3 },
    }),
    // 構造
    prisma.tag.create({
      data: { name: "木造", category: "STRUCTURE", displayOrder: 1 },
    }),
    prisma.tag.create({
      data: { name: "鉄骨造", category: "STRUCTURE", displayOrder: 2 },
    }),
    // 雰囲気
    prisma.tag.create({
      data: { name: "ナチュラル", category: "ATMOSPHERE", displayOrder: 1 },
    }),
    prisma.tag.create({
      data: { name: "モダン", category: "ATMOSPHERE", displayOrder: 2 },
    }),
    prisma.tag.create({
      data: { name: "和風", category: "ATMOSPHERE", displayOrder: 3 },
    }),
    // こだわり
    prisma.tag.create({
      data: {
        name: "高断熱・高気密",
        category: "PREFERENCE",
        displayOrder: 1,
      },
    }),
    prisma.tag.create({
      data: { name: "自然素材", category: "PREFERENCE", displayOrder: 2 },
    }),
    prisma.tag.create({
      data: { name: "吹き抜け", category: "PREFERENCE", displayOrder: 3 },
    }),
  ]);
  console.log(`✅ Created ${tags.length} tags`);

  // 2. 管理者ユーザーを作成
  console.log("👨‍💼 Creating admin user...");
  const adminAuthResult = await supabaseAdmin.auth.admin.createUser({
    email: "admin@matching-site.jp",
    password: "admin123456",
    email_confirm: true,
    app_metadata: {
      user_type: "admin",
    },
  });

  if (adminAuthResult.data.user) {
    await prisma.admin.create({
      data: {
        authId: adminAuthResult.data.user.id,
        email: "admin@matching-site.jp",
        name: "管理者 太郎",
        role: "SUPER_ADMIN",
      },
    });
    console.log(
      "✅ Created admin user (email: admin@matching-site.jp, password: admin123456)"
    );
  }

  // 3. 工務店を作成
  console.log("🏢 Creating companies...");
  const company1 = await prisma.company.create({
    data: {
      name: "株式会社ナゴヤホーム",
      description:
        "愛知県名古屋市を中心に、自然素材にこだわった住宅を提供しています。",
      address: "愛知県名古屋市中区栄1-1-1",
      prefecture: "愛知県",
      city: "名古屋市中区",
      phoneNumber: "052-123-4567",
      email: "info@nagoya-home.co.jp",
      websiteUrl: "https://nagoya-home.co.jp",
      isPublished: true,
    },
  });

  const company2 = await prisma.company.create({
    data: {
      name: "株式会社豊田ハウジング",
      description: "豊田市で30年の実績。高断熱・高気密住宅が得意です。",
      address: "愛知県豊田市若宮町1-1",
      prefecture: "愛知県",
      city: "豊田市",
      phoneNumber: "0565-987-6543",
      email: "contact@toyota-housing.co.jp",
      websiteUrl: "https://toyota-housing.co.jp",
      isPublished: true,
    },
  });

  const company3 = await prisma.company.create({
    data: {
      name: "株式会社岡崎工務店",
      description: "新規登録の工務店です。",
      address: "愛知県岡崎市康生町1-1",
      prefecture: "愛知県",
      city: "岡崎市",
      phoneNumber: "0564-777-8888",
      email: "support@okazaki-komuten.jp",
      isPublished: false,
    },
  });

  console.log("✅ Created 3 companies");

  // 工務店にタグを関連付け
  await Promise.all([
    prisma.companyTag.create({
      data: { companyId: company1.id, tagId: tags[1].id },
    }), // 平屋
    prisma.companyTag.create({
      data: { companyId: company1.id, tagId: tags[8].id },
    }), // ナチュラル
    prisma.companyTag.create({
      data: { companyId: company1.id, tagId: tags[12].id },
    }), // 自然素材
    prisma.companyTag.create({
      data: { companyId: company2.id, tagId: tags[0].id },
    }), // 二階建て
    prisma.companyTag.create({
      data: { companyId: company2.id, tagId: tags[11].id },
    }), // 高断熱・高気密
  ]);

  // 4. メンバーユーザーを作成
  console.log("👤 Creating member users...");
  const member1AuthResult = await supabaseAdmin.auth.admin.createUser({
    email: "tanaka@nagoya-home.co.jp",
    password: "member123456",
    email_confirm: true,
    app_metadata: {
      user_type: "member",
      company_id: company1.id,
    },
  });

  let member1Id: number | undefined;
  if (member1AuthResult.data.user) {
    const member1 = await prisma.member.create({
      data: {
        authId: member1AuthResult.data.user.id,
        email: "tanaka@nagoya-home.co.jp",
        name: "田中一郎",
        role: "ADMIN",
        companyId: company1.id,
      },
    });
    member1Id = member1.id;
    console.log(
      "✅ Created member1 (email: tanaka@nagoya-home.co.jp, password: member123456)"
    );
  }

  const member2AuthResult = await supabaseAdmin.auth.admin.createUser({
    email: "yamada@toyota-housing.co.jp",
    password: "member123456",
    email_confirm: true,
    app_metadata: {
      user_type: "member",
      company_id: company2.id,
    },
  });

  let member2Id: number | undefined;
  if (member2AuthResult.data.user) {
    const member2 = await prisma.member.create({
      data: {
        authId: member2AuthResult.data.user.id,
        email: "yamada@toyota-housing.co.jp",
        name: "山田太郎",
        role: "ADMIN",
        companyId: company2.id,
      },
    });
    member2Id = member2.id;
    console.log(
      "✅ Created member2 (email: yamada@toyota-housing.co.jp, password: member123456)"
    );
  }

  // 5. 顧客ユーザーを作成
  console.log("👥 Creating customer users...");
  const customer1AuthResult = await supabaseAdmin.auth.admin.createUser({
    email: "customer1@example.com",
    password: "customer123456",
    email_confirm: true,
    app_metadata: {
      user_type: "customer",
    },
  });

  let customer1Id: number | undefined;
  if (customer1AuthResult.data.user) {
    const customer1 = await prisma.customer.create({
      data: {
        authId: customer1AuthResult.data.user.id,
        email: "customer1@example.com",
        lastName: "佐藤",
        firstName: "花子",
        phoneNumber: "090-1234-5678",
      },
    });
    customer1Id = customer1.id;
    console.log(
      "✅ Created customer1 (email: customer1@example.com, password: customer123456)"
    );
  }

  const customer2AuthResult = await supabaseAdmin.auth.admin.createUser({
    email: "customer2@example.com",
    password: "customer123456",
    email_confirm: true,
    app_metadata: {
      user_type: "customer",
    },
  });

  if (customer2AuthResult.data.user) {
    await prisma.customer.create({
      data: {
        authId: customer2AuthResult.data.user.id,
        email: "customer2@example.com",
        lastName: "鈴木",
        firstName: "太郎",
        phoneNumber: "080-9876-5432",
      },
    });
    console.log(
      "✅ Created customer2 (email: customer2@example.com, password: customer123456)"
    );
  }

  // 6. 施工事例を作成
  console.log("🏠 Creating construction cases...");
  if (member1Id && member2Id) {
    const case1 = await prisma.constructionCase.create({
      data: {
        companyId: company1.id,
        authorId: member1Id,
        title: "自然素材にこだわった平屋の家",
        description:
          "無垢材のフローリングと漆喰の壁で仕上げた、温かみのある平屋住宅です。",
        prefecture: "愛知県",
        city: "名古屋市緑区",
        buildingArea: 120.5,
        budget: 3500,
        completionYear: 2024,
        status: "PUBLISHED",
        publishedAt: new Date("2024-01-15"),
        viewCount: 152,
      },
    });

    await Promise.all([
      prisma.constructionCaseTag.create({
        data: { caseId: case1.id, tagId: tags[1].id },
      }), // 平屋
      prisma.constructionCaseTag.create({
        data: { caseId: case1.id, tagId: tags[4].id },
      }), // 3000万円台
      prisma.constructionCaseTag.create({
        data: { caseId: case1.id, tagId: tags[8].id },
      }), // ナチュラル
      prisma.constructionCaseTag.create({
        data: { caseId: case1.id, tagId: tags[12].id },
      }), // 自然素材
    ]);

    const case2 = await prisma.constructionCase.create({
      data: {
        companyId: company2.id,
        authorId: member2Id,
        title: "高断熱・高気密のモダン住宅",
        description:
          "ZEH基準をクリアした、省エネ性能に優れた二階建て住宅です。",
        prefecture: "愛知県",
        city: "豊田市",
        buildingArea: 135.0,
        budget: 4200,
        completionYear: 2024,
        status: "PUBLISHED",
        publishedAt: new Date("2024-02-20"),
        viewCount: 98,
      },
    });

    await Promise.all([
      prisma.constructionCaseTag.create({
        data: { caseId: case2.id, tagId: tags[0].id },
      }), // 二階建て
      prisma.constructionCaseTag.create({
        data: { caseId: case2.id, tagId: tags[5].id },
      }), // 4000万円台
      prisma.constructionCaseTag.create({
        data: { caseId: case2.id, tagId: tags[9].id },
      }), // モダン
      prisma.constructionCaseTag.create({
        data: { caseId: case2.id, tagId: tags[11].id },
      }), // 高断熱・高気密
    ]);

    const case3 = await prisma.constructionCase.create({
      data: {
        companyId: company1.id,
        authorId: member1Id,
        title: "吹き抜けのある開放的な家",
        description: "リビングの大きな吹き抜けが特徴的な住宅です。",
        prefecture: "愛知県",
        city: "名古屋市千種区",
        buildingArea: 145.0,
        budget: 3800,
        completionYear: 2023,
        status: "DRAFT",
      },
    });

    await Promise.all([
      prisma.constructionCaseTag.create({
        data: { caseId: case3.id, tagId: tags[0].id },
      }), // 二階建て
      prisma.constructionCaseTag.create({
        data: { caseId: case3.id, tagId: tags[13].id },
      }), // 吹き抜け
    ]);

    console.log("✅ Created 3 construction cases");
  }

  // 7. 問い合わせを作成
  console.log("💬 Creating inquiries...");
  if (customer1Id) {
    const inquiry1 = await prisma.inquiry.create({
      data: {
        customerId: customer1Id,
        inquirerName: "佐藤花子",
        inquirerEmail: "customer1@example.com",
        inquirerPhone: "090-1234-5678",
        companyId: company1.id,
        message:
          "平屋の住宅を検討しています。見学会の予定はありますでしょうか？",
        status: "IN_PROGRESS",
        respondedAt: new Date("2024-03-10"),
        createdAt: new Date("2024-03-10"),
      },
    });

    await prisma.inquiryResponse.create({
      data: {
        inquiryId: inquiry1.id,
        sender: "COMPANY",
        senderName: "田中一郎",
        message:
          "お問い合わせありがとうございます。来月の第2土曜日に見学会を予定しております。",
        createdAt: new Date("2024-03-10T14:00:00"),
      },
    });

    await prisma.inquiry.create({
      data: {
        customerId: customer1Id,
        inquirerName: "佐藤花子",
        inquirerEmail: "customer1@example.com",
        inquirerPhone: "090-1234-5678",
        companyId: company2.id,
        message: "高断熱住宅について詳しく知りたいです。",
        status: "NEW",
        createdAt: new Date("2024-03-15"),
      },
    });

    console.log("✅ Created 2 inquiries with responses");
  }

  console.log("✨ Seed completed successfully!");
  console.log("\n📝 Test Credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin:");
  console.log("  Email: admin@matching-site.jp");
  console.log("  Password: admin123456");
  console.log("\nMember (ナゴヤホーム):");
  console.log("  Email: tanaka@nagoya-home.co.jp");
  console.log("  Password: member123456");
  console.log("\nMember (豊田ハウジング):");
  console.log("  Email: yamada@toyota-housing.co.jp");
  console.log("  Password: member123456");
  console.log("\nCustomer:");
  console.log("  Email: customer1@example.com");
  console.log("  Password: customer123456");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
