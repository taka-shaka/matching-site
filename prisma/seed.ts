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

  // 1. タグを作成（拡充版）
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
    prisma.tag.create({
      data: { name: "2世帯住宅", category: "HOUSE_TYPE", displayOrder: 4 },
    }),
    prisma.tag.create({
      data: { name: "狭小住宅", category: "HOUSE_TYPE", displayOrder: 5 },
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
    prisma.tag.create({
      data: { name: "5000万円以上", category: "PRICE_RANGE", displayOrder: 4 },
    }),

    // 構造
    prisma.tag.create({
      data: { name: "木造", category: "STRUCTURE", displayOrder: 1 },
    }),
    prisma.tag.create({
      data: { name: "鉄骨造", category: "STRUCTURE", displayOrder: 2 },
    }),
    prisma.tag.create({
      data: { name: "RC造", category: "STRUCTURE", displayOrder: 3 },
    }),
    prisma.tag.create({
      data: { name: "混構造", category: "STRUCTURE", displayOrder: 4 },
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
    prisma.tag.create({
      data: { name: "北欧風", category: "ATMOSPHERE", displayOrder: 4 },
    }),
    prisma.tag.create({
      data: { name: "シンプル", category: "ATMOSPHERE", displayOrder: 5 },
    }),
    prisma.tag.create({
      data: { name: "和モダン", category: "ATMOSPHERE", displayOrder: 6 },
    }),
    prisma.tag.create({
      data: { name: "カフェ風", category: "ATMOSPHERE", displayOrder: 7 },
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
    prisma.tag.create({
      data: { name: "太陽光発電", category: "PREFERENCE", displayOrder: 4 },
    }),
    prisma.tag.create({
      data: { name: "ZEH", category: "PREFERENCE", displayOrder: 5 },
    }),
    prisma.tag.create({
      data: { name: "ガレージ付き", category: "PREFERENCE", displayOrder: 6 },
    }),
    prisma.tag.create({
      data: { name: "バリアフリー", category: "PREFERENCE", displayOrder: 7 },
    }),
    prisma.tag.create({
      data: { name: "ペット共生", category: "PREFERENCE", displayOrder: 8 },
    }),
    prisma.tag.create({
      data: { name: "中庭", category: "PREFERENCE", displayOrder: 9 },
    }),
    prisma.tag.create({
      data: { name: "ロフト", category: "PREFERENCE", displayOrder: 10 },
    }),
  ]);
  console.log(`✅ Created ${tags.length} tags`);

  // 2. 管理者ユーザーを作成
  console.log("👨‍💼 Creating admin user...");
  try {
    const adminAuthResult = await supabaseAdmin.auth.admin.createUser({
      email: "admin@housematch.test",
      password: "Admin123!",
      email_confirm: true,
      app_metadata: {
        user_type: "admin",
      },
    });

    if (adminAuthResult.data.user) {
      await prisma.admin.create({
        data: {
          authId: adminAuthResult.data.user.id,
          email: "admin@housematch.test",
          name: "管理者テスト",
          role: "SUPER_ADMIN",
        },
      });
      console.log(
        "✅ Created admin user (email: admin@housematch.test, password: Admin123!)"
      );
    }
  } catch (error) {
    console.log(
      "⚠️  Admin user already exists or error occurred:",
      error instanceof Error ? error.message : error
    );
  }

  // 3. 工務店を10件作成
  console.log("🏢 Creating 10 companies...");

  const company1 = await prisma.company.create({
    data: {
      name: "株式会社ナゴヤホーム",
      description:
        "愛知県名古屋市を中心に、自然素材にこだわった住宅を提供しています。無垢材のフローリングと漆喰の壁で仕上げた、温かみのある家づくりが得意です。",
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
      description:
        "豊田市で30年の実績。高断熱・高気密住宅が得意です。ZEH基準をクリアした省エネ住宅を数多く手がけています。",
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
      description:
        "岡崎市地域密着の工務店です。地元の木材を使った家づくりにこだわっています。",
      address: "愛知県岡崎市康生町1-1",
      prefecture: "愛知県",
      city: "岡崎市",
      phoneNumber: "0564-777-8888",
      email: "support@okazaki-komuten.jp",
      websiteUrl: "https://okazaki-komuten.jp",
      isPublished: true,
    },
  });

  const company4 = await prisma.company.create({
    data: {
      name: "一宮建設株式会社",
      description:
        "一宮市で創業50年。伝統と革新を融合させた家づくりを行っています。和モダンスタイルが得意です。",
      address: "愛知県一宮市本町1-1-1",
      prefecture: "愛知県",
      city: "一宮市",
      phoneNumber: "0586-111-2222",
      email: "info@ichinomiya-kensetsu.co.jp",
      websiteUrl: "https://ichinomiya-kensetsu.co.jp",
      isPublished: true,
    },
  });

  const company5 = await prisma.company.create({
    data: {
      name: "春日井ホーム株式会社",
      description:
        "春日井市を中心に施工。デザイン性と機能性を両立した住宅づくりが特徴です。",
      address: "愛知県春日井市鳥居松町1-1",
      prefecture: "愛知県",
      city: "春日井市",
      phoneNumber: "0568-333-4444",
      email: "contact@kasugai-home.jp",
      websiteUrl: "https://kasugai-home.jp",
      isPublished: true,
    },
  });

  const company6 = await prisma.company.create({
    data: {
      name: "岐阜ハウジング株式会社",
      description:
        "岐阜県全域で施工実績多数。自然豊かな環境に調和する住宅づくりを行っています。",
      address: "岐阜県岐阜市金町1-1",
      prefecture: "岐阜県",
      city: "岐阜市",
      phoneNumber: "058-555-6666",
      email: "info@gifu-housing.co.jp",
      websiteUrl: "https://gifu-housing.co.jp",
      isPublished: true,
    },
  });

  const company7 = await prisma.company.create({
    data: {
      name: "三重ビルダーズ株式会社",
      description:
        "三重県津市の工務店。モダンデザインと高性能を追求した住宅が得意です。",
      address: "三重県津市栄町1-1",
      prefecture: "三重県",
      city: "津市",
      phoneNumber: "059-777-8888",
      email: "contact@mie-builders.co.jp",
      websiteUrl: "https://mie-builders.co.jp",
      isPublished: true,
    },
  });

  const company8 = await prisma.company.create({
    data: {
      name: "四日市建築工房",
      description:
        "四日市市の地域密着型工務店。狭小住宅やガレージハウスなど、個性的な家づくりに定評があります。",
      address: "三重県四日市市諏訪町1-1",
      prefecture: "三重県",
      city: "四日市市",
      phoneNumber: "059-999-0000",
      email: "info@yokkaichi-kobo.jp",
      isPublished: true,
    },
  });

  const company9 = await prisma.company.create({
    data: {
      name: "多治見ホームデザイン",
      description:
        "多治見市で注文住宅を手がける工務店。北欧風デザインが得意です。",
      address: "岐阜県多治見市本町1-1",
      prefecture: "岐阜県",
      city: "多治見市",
      phoneNumber: "0572-222-3333",
      email: "info@tajimi-home.jp",
      isPublished: true,
    },
  });

  await prisma.company.create({
    data: {
      name: "伊勢工務店株式会社",
      description:
        "新規登録の工務店です。まだ施工事例はありませんが、準備中です。",
      address: "三重県伊勢市岩渕1-1",
      prefecture: "三重県",
      city: "伊勢市",
      phoneNumber: "0596-444-5555",
      email: "info@ise-komuten.co.jp",
      isPublished: false,
    },
  });

  console.log("✅ Created 10 companies");

  // 工務店にタグを関連付け
  await Promise.all([
    // company1 - ナゴヤホーム
    prisma.companyTag.create({
      data: { companyId: company1.id, tagId: tags[1].id },
    }), // 平屋
    prisma.companyTag.create({
      data: { companyId: company1.id, tagId: tags[13].id },
    }), // ナチュラル
    prisma.companyTag.create({
      data: { companyId: company1.id, tagId: tags[21].id },
    }), // 自然素材

    // company2 - 豊田ハウジング
    prisma.companyTag.create({
      data: { companyId: company2.id, tagId: tags[0].id },
    }), // 二階建て
    prisma.companyTag.create({
      data: { companyId: company2.id, tagId: tags[20].id },
    }), // 高断熱・高気密
    prisma.companyTag.create({
      data: { companyId: company2.id, tagId: tags[24].id },
    }), // ZEH

    // company3 - 岡崎工務店
    prisma.companyTag.create({
      data: { companyId: company3.id, tagId: tags[9].id },
    }), // 木造
    prisma.companyTag.create({
      data: { companyId: company3.id, tagId: tags[21].id },
    }), // 自然素材

    // company4 - 一宮建設
    prisma.companyTag.create({
      data: { companyId: company4.id, tagId: tags[15].id },
    }), // 和風
    prisma.companyTag.create({
      data: { companyId: company4.id, tagId: tags[18].id },
    }), // 和モダン

    // company5 - 春日井ホーム
    prisma.companyTag.create({
      data: { companyId: company5.id, tagId: tags[14].id },
    }), // モダン
    prisma.companyTag.create({
      data: { companyId: company5.id, tagId: tags[17].id },
    }), // シンプル

    // company6 - 岐阜ハウジング
    prisma.companyTag.create({
      data: { companyId: company6.id, tagId: tags[1].id },
    }), // 平屋
    prisma.companyTag.create({
      data: { companyId: company6.id, tagId: tags[13].id },
    }), // ナチュラル

    // company7 - 三重ビルダーズ
    prisma.companyTag.create({
      data: { companyId: company7.id, tagId: tags[14].id },
    }), // モダン
    prisma.companyTag.create({
      data: { companyId: company7.id, tagId: tags[20].id },
    }), // 高断熱・高気密

    // company8 - 四日市建築工房
    prisma.companyTag.create({
      data: { companyId: company8.id, tagId: tags[4].id },
    }), // 狭小住宅
    prisma.companyTag.create({
      data: { companyId: company8.id, tagId: tags[25].id },
    }), // ガレージ付き

    // company9 - 多治見ホームデザイン
    prisma.companyTag.create({
      data: { companyId: company9.id, tagId: tags[16].id },
    }), // 北欧風
    prisma.companyTag.create({
      data: { companyId: company9.id, tagId: tags[19].id },
    }), // カフェ風
  ]);

  // 4. メンバーユーザーを作成（各工務店に1〜2名）
  console.log("👤 Creating member users...");

  const memberIds: Record<string, number> = {};

  // Company1のメンバー
  const member1Auth = await supabaseAdmin.auth.admin.createUser({
    email: "yamada@nagoya-home.test",
    password: "Member123!",
    email_confirm: true,
    app_metadata: { user_type: "member", company_id: company1.id },
    user_metadata: { name: "山田太郎" },
  });
  if (member1Auth.data.user) {
    const member = await prisma.member.create({
      data: {
        authId: member1Auth.data.user.id,
        email: "yamada@nagoya-home.test",
        name: "山田太郎",
        role: "ADMIN",
        companyId: company1.id,
      },
    });
    memberIds.member1 = member.id;
  }

  const member2Auth = await supabaseAdmin.auth.admin.createUser({
    email: "tanaka@nagoya-home.test",
    password: "Member123!",
    email_confirm: true,
    app_metadata: { user_type: "member", company_id: company1.id },
    user_metadata: { name: "田中花子" },
  });
  if (member2Auth.data.user) {
    const member = await prisma.member.create({
      data: {
        authId: member2Auth.data.user.id,
        email: "tanaka@nagoya-home.test",
        name: "田中花子",
        role: "GENERAL",
        companyId: company1.id,
      },
    });
    memberIds.member2 = member.id;
  }

  // Company2のメンバー
  const member3Auth = await supabaseAdmin.auth.admin.createUser({
    email: "sato@toyota-housing.test",
    password: "Member123!",
    email_confirm: true,
    app_metadata: { user_type: "member", company_id: company2.id },
    user_metadata: { name: "佐藤次郎" },
  });
  if (member3Auth.data.user) {
    const member = await prisma.member.create({
      data: {
        authId: member3Auth.data.user.id,
        email: "sato@toyota-housing.test",
        name: "佐藤次郎",
        role: "ADMIN",
        companyId: company2.id,
      },
    });
    memberIds.member3 = member.id;
  }

  // Company3のメンバー
  const member4Auth = await supabaseAdmin.auth.admin.createUser({
    email: "suzuki@okazaki-komuten.test",
    password: "Member123!",
    email_confirm: true,
    app_metadata: { user_type: "member", company_id: company3.id },
    user_metadata: { name: "鈴木一郎" },
  });
  if (member4Auth.data.user) {
    const member = await prisma.member.create({
      data: {
        authId: member4Auth.data.user.id,
        email: "suzuki@okazaki-komuten.test",
        name: "鈴木一郎",
        role: "ADMIN",
        companyId: company3.id,
      },
    });
    memberIds.member4 = member.id;
  }

  // Company4のメンバー
  const member5Auth = await supabaseAdmin.auth.admin.createUser({
    email: "takahashi@ichinomiya.test",
    password: "Member123!",
    email_confirm: true,
    app_metadata: { user_type: "member", company_id: company4.id },
    user_metadata: { name: "高橋健太" },
  });
  if (member5Auth.data.user) {
    const member = await prisma.member.create({
      data: {
        authId: member5Auth.data.user.id,
        email: "takahashi@ichinomiya.test",
        name: "高橋健太",
        role: "ADMIN",
        companyId: company4.id,
      },
    });
    memberIds.member5 = member.id;
  }

  // Company5のメンバー
  const member6Auth = await supabaseAdmin.auth.admin.createUser({
    email: "watanabe@kasugai.test",
    password: "Member123!",
    email_confirm: true,
    app_metadata: { user_type: "member", company_id: company5.id },
    user_metadata: { name: "渡辺美咲" },
  });
  if (member6Auth.data.user) {
    const member = await prisma.member.create({
      data: {
        authId: member6Auth.data.user.id,
        email: "watanabe@kasugai.test",
        name: "渡辺美咲",
        role: "ADMIN",
        companyId: company5.id,
      },
    });
    memberIds.member6 = member.id;
  }

  // Company6のメンバー
  const member7Auth = await supabaseAdmin.auth.admin.createUser({
    email: "ito@gifu-housing.test",
    password: "Member123!",
    email_confirm: true,
    app_metadata: { user_type: "member", company_id: company6.id },
    user_metadata: { name: "伊藤雄大" },
  });
  if (member7Auth.data.user) {
    const member = await prisma.member.create({
      data: {
        authId: member7Auth.data.user.id,
        email: "ito@gifu-housing.test",
        name: "伊藤雄大",
        role: "ADMIN",
        companyId: company6.id,
      },
    });
    memberIds.member7 = member.id;
  }

  // Company7のメンバー
  const member8Auth = await supabaseAdmin.auth.admin.createUser({
    email: "nakamura@mie-builders.test",
    password: "Member123!",
    email_confirm: true,
    app_metadata: { user_type: "member", company_id: company7.id },
    user_metadata: { name: "中村真理" },
  });
  if (member8Auth.data.user) {
    const member = await prisma.member.create({
      data: {
        authId: member8Auth.data.user.id,
        email: "nakamura@mie-builders.test",
        name: "中村真理",
        role: "ADMIN",
        companyId: company7.id,
      },
    });
    memberIds.member8 = member.id;
  }

  // Company8のメンバー
  const member9Auth = await supabaseAdmin.auth.admin.createUser({
    email: "kobayashi@yokkaichi.test",
    password: "Member123!",
    email_confirm: true,
    app_metadata: { user_type: "member", company_id: company8.id },
    user_metadata: { name: "小林大輔" },
  });
  if (member9Auth.data.user) {
    const member = await prisma.member.create({
      data: {
        authId: member9Auth.data.user.id,
        email: "kobayashi@yokkaichi.test",
        name: "小林大輔",
        role: "ADMIN",
        companyId: company8.id,
      },
    });
    memberIds.member9 = member.id;
  }

  // Company9のメンバー
  const member10Auth = await supabaseAdmin.auth.admin.createUser({
    email: "kato@tajimi.test",
    password: "Member123!",
    email_confirm: true,
    app_metadata: { user_type: "member", company_id: company9.id },
    user_metadata: { name: "加藤結衣" },
  });
  if (member10Auth.data.user) {
    const member = await prisma.member.create({
      data: {
        authId: member10Auth.data.user.id,
        email: "kato@tajimi.test",
        name: "加藤結衣",
        role: "ADMIN",
        companyId: company9.id,
      },
    });
    memberIds.member10 = member.id;
  }

  console.log("✅ Created 10 member users");

  // 5. 顧客ユーザーを作成
  console.log("👥 Creating customer users...");

  const customerIds: Record<string, number> = {};

  const customer1Auth = await supabaseAdmin.auth.admin.createUser({
    email: "customer1@example.test",
    password: "Customer123!",
    email_confirm: true,
    app_metadata: { user_type: "customer" },
    user_metadata: { last_name: "佐藤", first_name: "花子" },
  });
  if (customer1Auth.data.user) {
    const customer = await prisma.customer.create({
      data: {
        authId: customer1Auth.data.user.id,
        email: "customer1@example.test",
        lastName: "佐藤",
        firstName: "花子",
        phoneNumber: "090-1234-5678",
      },
    });
    customerIds.customer1 = customer.id;
  }

  const customer2Auth = await supabaseAdmin.auth.admin.createUser({
    email: "customer2@example.test",
    password: "Customer123!",
    email_confirm: true,
    app_metadata: { user_type: "customer" },
    user_metadata: { last_name: "鈴木", first_name: "太郎" },
  });
  if (customer2Auth.data.user) {
    const customer = await prisma.customer.create({
      data: {
        authId: customer2Auth.data.user.id,
        email: "customer2@example.test",
        lastName: "鈴木",
        firstName: "太郎",
        phoneNumber: "080-9876-5432",
      },
    });
    customerIds.customer2 = customer.id;
  }

  const customer3Auth = await supabaseAdmin.auth.admin.createUser({
    email: "customer3@example.test",
    password: "Customer123!",
    email_confirm: true,
    app_metadata: { user_type: "customer" },
    user_metadata: { last_name: "高橋", first_name: "美咲" },
  });
  if (customer3Auth.data.user) {
    const customer = await prisma.customer.create({
      data: {
        authId: customer3Auth.data.user.id,
        email: "customer3@example.test",
        lastName: "高橋",
        firstName: "美咲",
        phoneNumber: "090-5555-6666",
      },
    });
    customerIds.customer3 = customer.id;
  }

  const customer4Auth = await supabaseAdmin.auth.admin.createUser({
    email: "customer4@example.test",
    password: "Customer123!",
    email_confirm: true,
    app_metadata: { user_type: "customer" },
    user_metadata: { last_name: "田中", first_name: "健太" },
  });
  if (customer4Auth.data.user) {
    const customer = await prisma.customer.create({
      data: {
        authId: customer4Auth.data.user.id,
        email: "customer4@example.test",
        lastName: "田中",
        firstName: "健太",
        phoneNumber: "080-7777-8888",
      },
    });
    customerIds.customer4 = customer.id;
  }

  const customer5Auth = await supabaseAdmin.auth.admin.createUser({
    email: "customer5@example.test",
    password: "Customer123!",
    email_confirm: true,
    app_metadata: { user_type: "customer" },
    user_metadata: { last_name: "渡辺", first_name: "結衣" },
  });
  if (customer5Auth.data.user) {
    const customer = await prisma.customer.create({
      data: {
        authId: customer5Auth.data.user.id,
        email: "customer5@example.test",
        lastName: "渡辺",
        firstName: "結衣",
        phoneNumber: "090-9999-0000",
      },
    });
    customerIds.customer5 = customer.id;
  }

  console.log("✅ Created 5 customer users");

  // 6. 施工事例を15件作成
  console.log("🏠 Creating 15 construction cases...");

  if (
    !memberIds.member1 ||
    !memberIds.member2 ||
    !memberIds.member3 ||
    !memberIds.member4
  ) {
    console.log(
      "⚠️  Skipping construction cases creation because some members were not created"
    );
    console.log(
      "   Please delete all Supabase auth users and run seed again for full data"
    );
  } else {
    // Case 1
    const case1 = await prisma.constructionCase.create({
      data: {
        companyId: company1.id,
        authorId: memberIds.member1,
        title: "自然素材にこだわった平屋の家",
        description:
          "無垢材のフローリングと漆喰の壁で仕上げた、温かみのある平屋住宅です。大きな窓から差し込む自然光が心地よい空間を演出しています。",
        prefecture: "愛知県",
        city: "名古屋市緑区",
        buildingArea: 120.5,
        budget: 35000000,
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
        data: { caseId: case1.id, tagId: tags[6].id },
      }), // 3000万円台
      prisma.constructionCaseTag.create({
        data: { caseId: case1.id, tagId: tags[13].id },
      }), // ナチュラル
      prisma.constructionCaseTag.create({
        data: { caseId: case1.id, tagId: tags[21].id },
      }), // 自然素材
    ]);

    // Case 2
    const case2 = await prisma.constructionCase.create({
      data: {
        companyId: company2.id,
        authorId: memberIds.member3,
        title: "高断熱・高気密のZEH住宅",
        description:
          "ZEH基準をクリアした、省エネ性能に優れた二階建て住宅です。太陽光発電システムを搭載し、光熱費を大幅に削減できます。",
        prefecture: "愛知県",
        city: "豊田市",
        buildingArea: 135.0,
        budget: 42000000,
        completionYear: 2024,
        status: "PUBLISHED",
        publishedAt: new Date("2024-02-20"),
        viewCount: 198,
      },
    });
    await Promise.all([
      prisma.constructionCaseTag.create({
        data: { caseId: case2.id, tagId: tags[0].id },
      }), // 二階建て
      prisma.constructionCaseTag.create({
        data: { caseId: case2.id, tagId: tags[7].id },
      }), // 4000万円台
      prisma.constructionCaseTag.create({
        data: { caseId: case2.id, tagId: tags[14].id },
      }), // モダン
      prisma.constructionCaseTag.create({
        data: { caseId: case2.id, tagId: tags[20].id },
      }), // 高断熱・高気密
      prisma.constructionCaseTag.create({
        data: { caseId: case2.id, tagId: tags[24].id },
      }), // ZEH
      prisma.constructionCaseTag.create({
        data: { caseId: case2.id, tagId: tags[23].id },
      }), // 太陽光発電
    ]);

    // Case 3
    const case3 = await prisma.constructionCase.create({
      data: {
        companyId: company1.id,
        authorId: memberIds.member2,
        title: "吹き抜けのある開放的な二階建て",
        description:
          "リビングの大きな吹き抜けが特徴的な住宅です。家族が自然と集まる明るい空間になっています。",
        prefecture: "愛知県",
        city: "名古屋市千種区",
        buildingArea: 145.0,
        budget: 38000000,
        completionYear: 2023,
        status: "PUBLISHED",
        publishedAt: new Date("2023-11-10"),
        viewCount: 87,
      },
    });
    await Promise.all([
      prisma.constructionCaseTag.create({
        data: { caseId: case3.id, tagId: tags[0].id },
      }), // 二階建て
      prisma.constructionCaseTag.create({
        data: { caseId: case3.id, tagId: tags[6].id },
      }), // 3000万円台
      prisma.constructionCaseTag.create({
        data: { caseId: case3.id, tagId: tags[22].id },
      }), // 吹き抜け
    ]);

    // Case 4
    const case4 = await prisma.constructionCase.create({
      data: {
        companyId: company3.id,
        authorId: memberIds.member4,
        title: "地元の木材を使った温もりの家",
        description:
          "岡崎産のヒノキをふんだんに使用した木造住宅。木の香りに包まれる癒しの空間です。",
        prefecture: "愛知県",
        city: "岡崎市",
        buildingArea: 128.0,
        budget: 32000000,
        completionYear: 2024,
        status: "PUBLISHED",
        publishedAt: new Date("2024-03-01"),
        viewCount: 65,
      },
    });
    await Promise.all([
      prisma.constructionCaseTag.create({
        data: { caseId: case4.id, tagId: tags[0].id },
      }), // 二階建て
      prisma.constructionCaseTag.create({
        data: { caseId: case4.id, tagId: tags[6].id },
      }), // 3000万円台
      prisma.constructionCaseTag.create({
        data: { caseId: case4.id, tagId: tags[9].id },
      }), // 木造
      prisma.constructionCaseTag.create({
        data: { caseId: case4.id, tagId: tags[21].id },
      }), // 自然素材
    ]);

    // Case 5
    const case5 = await prisma.constructionCase.create({
      data: {
        companyId: company4.id,
        authorId: memberIds.member5,
        title: "伝統と現代が融合した和モダン住宅",
        description:
          "日本の伝統美と現代の機能性を融合させた和モダンスタイル。畳リビングと掘りごたつが特徴です。",
        prefecture: "愛知県",
        city: "一宮市",
        buildingArea: 150.0,
        budget: 45000000,
        completionYear: 2024,
        status: "PUBLISHED",
        publishedAt: new Date("2024-02-10"),
        viewCount: 123,
      },
    });
    await Promise.all([
      prisma.constructionCaseTag.create({
        data: { caseId: case5.id, tagId: tags[0].id },
      }), // 二階建て
      prisma.constructionCaseTag.create({
        data: { caseId: case5.id, tagId: tags[7].id },
      }), // 4000万円台
      prisma.constructionCaseTag.create({
        data: { caseId: case5.id, tagId: tags[15].id },
      }), // 和風
      prisma.constructionCaseTag.create({
        data: { caseId: case5.id, tagId: tags[18].id },
      }), // 和モダン
    ]);

    // Case 6
    const case6 = await prisma.constructionCase.create({
      data: {
        companyId: company5.id,
        authorId: memberIds.member6,
        title: "シンプルモダンな都市型住宅",
        description:
          "無駄を削ぎ落としたシンプルなデザイン。機能美を追求した都市型住宅です。",
        prefecture: "愛知県",
        city: "春日井市",
        buildingArea: 115.0,
        budget: 36000000,
        completionYear: 2023,
        status: "PUBLISHED",
        publishedAt: new Date("2023-12-05"),
        viewCount: 92,
      },
    });
    await Promise.all([
      prisma.constructionCaseTag.create({
        data: { caseId: case6.id, tagId: tags[0].id },
      }), // 二階建て
      prisma.constructionCaseTag.create({
        data: { caseId: case6.id, tagId: tags[6].id },
      }), // 3000万円台
      prisma.constructionCaseTag.create({
        data: { caseId: case6.id, tagId: tags[14].id },
      }), // モダン
      prisma.constructionCaseTag.create({
        data: { caseId: case6.id, tagId: tags[17].id },
      }), // シンプル
    ]);

    // Case 7
    const case7 = await prisma.constructionCase.create({
      data: {
        companyId: company6.id,
        authorId: memberIds.member7,
        title: "自然に囲まれた平屋の別荘",
        description:
          "岐阜の自然豊かな環境に建つ平屋住宅。ウッドデッキから四季を感じられます。",
        prefecture: "岐阜県",
        city: "岐阜市",
        buildingArea: 110.0,
        budget: 30000000,
        completionYear: 2024,
        status: "PUBLISHED",
        publishedAt: new Date("2024-01-20"),
        viewCount: 78,
      },
    });
    await Promise.all([
      prisma.constructionCaseTag.create({
        data: { caseId: case7.id, tagId: tags[1].id },
      }), // 平屋
      prisma.constructionCaseTag.create({
        data: { caseId: case7.id, tagId: tags[6].id },
      }), // 3000万円台
      prisma.constructionCaseTag.create({
        data: { caseId: case7.id, tagId: tags[13].id },
      }), // ナチュラル
    ]);

    // Case 8
    const case8 = await prisma.constructionCase.create({
      data: {
        companyId: company7.id,
        authorId: memberIds.member8,
        title: "高性能RC造の三階建て住宅",
        description:
          "鉄筋コンクリート造の耐震性に優れた三階建て。都市部の限られた敷地を有効活用しています。",
        prefecture: "三重県",
        city: "津市",
        buildingArea: 160.0,
        budget: 55000000,
        completionYear: 2023,
        status: "PUBLISHED",
        publishedAt: new Date("2023-10-15"),
        viewCount: 134,
      },
    });
    await Promise.all([
      prisma.constructionCaseTag.create({
        data: { caseId: case8.id, tagId: tags[2].id },
      }), // 三階建て
      prisma.constructionCaseTag.create({
        data: { caseId: case8.id, tagId: tags[8].id },
      }), // 5000万円以上
      prisma.constructionCaseTag.create({
        data: { caseId: case8.id, tagId: tags[11].id },
      }), // RC造
      prisma.constructionCaseTag.create({
        data: { caseId: case8.id, tagId: tags[14].id },
      }), // モダン
    ]);

    // Case 9
    const case9 = await prisma.constructionCase.create({
      data: {
        companyId: company8.id,
        authorId: memberIds.member9,
        title: "ビルトインガレージの狭小住宅",
        description:
          "限られた敷地に建つ狭小住宅。1階はガレージ、2・3階が居住スペースの効率的な設計です。",
        prefecture: "三重県",
        city: "四日市市",
        buildingArea: 95.0,
        budget: 34000000,
        completionYear: 2024,
        status: "PUBLISHED",
        publishedAt: new Date("2024-03-05"),
        viewCount: 156,
      },
    });
    await Promise.all([
      prisma.constructionCaseTag.create({
        data: { caseId: case9.id, tagId: tags[2].id },
      }), // 三階建て
      prisma.constructionCaseTag.create({
        data: { caseId: case9.id, tagId: tags[4].id },
      }), // 狭小住宅
      prisma.constructionCaseTag.create({
        data: { caseId: case9.id, tagId: tags[6].id },
      }), // 3000万円台
      prisma.constructionCaseTag.create({
        data: { caseId: case9.id, tagId: tags[25].id },
      }), // ガレージ付き
    ]);

    // Case 10
    const case10 = await prisma.constructionCase.create({
      data: {
        companyId: company9.id,
        authorId: memberIds.member10,
        title: "北欧スタイルのカフェ風住宅",
        description:
          "白を基調とした北欧スタイル。ナチュラルな木目とアイアン素材がアクセントです。",
        prefecture: "岐阜県",
        city: "多治見市",
        buildingArea: 125.0,
        budget: 37000000,
        completionYear: 2024,
        status: "PUBLISHED",
        publishedAt: new Date("2024-02-25"),
        viewCount: 145,
      },
    });
    await Promise.all([
      prisma.constructionCaseTag.create({
        data: { caseId: case10.id, tagId: tags[0].id },
      }), // 二階建て
      prisma.constructionCaseTag.create({
        data: { caseId: case10.id, tagId: tags[6].id },
      }), // 3000万円台
      prisma.constructionCaseTag.create({
        data: { caseId: case10.id, tagId: tags[16].id },
      }), // 北欧風
      prisma.constructionCaseTag.create({
        data: { caseId: case10.id, tagId: tags[19].id },
      }), // カフェ風
    ]);

    // Case 11
    const case11 = await prisma.constructionCase.create({
      data: {
        companyId: company2.id,
        authorId: memberIds.member3,
        title: "二世帯で暮らす完全分離型住宅",
        description:
          "1階と2階で完全に独立した二世帯住宅。プライバシーを確保しながら、家族の絆を大切にする設計です。",
        prefecture: "愛知県",
        city: "豊田市",
        buildingArea: 180.0,
        budget: 48000000,
        completionYear: 2023,
        status: "PUBLISHED",
        publishedAt: new Date("2023-09-20"),
        viewCount: 167,
      },
    });
    await Promise.all([
      prisma.constructionCaseTag.create({
        data: { caseId: case11.id, tagId: tags[0].id },
      }), // 二階建て
      prisma.constructionCaseTag.create({
        data: { caseId: case11.id, tagId: tags[3].id },
      }), // 2世帯住宅
      prisma.constructionCaseTag.create({
        data: { caseId: case11.id, tagId: tags[7].id },
      }), // 4000万円台
    ]);

    // Case 12
    const case12 = await prisma.constructionCase.create({
      data: {
        companyId: company3.id,
        authorId: memberIds.member4,
        title: "中庭のある平屋住宅",
        description:
          "コの字型の平屋で中庭を囲む設計。プライバシーを守りながら開放感を実現しています。",
        prefecture: "愛知県",
        city: "岡崎市",
        buildingArea: 138.0,
        budget: 40000000,
        completionYear: 2024,
        status: "PUBLISHED",
        publishedAt: new Date("2024-01-10"),
        viewCount: 112,
      },
    });
    await Promise.all([
      prisma.constructionCaseTag.create({
        data: { caseId: case12.id, tagId: tags[1].id },
      }), // 平屋
      prisma.constructionCaseTag.create({
        data: { caseId: case12.id, tagId: tags[7].id },
      }), // 4000万円台
      prisma.constructionCaseTag.create({
        data: { caseId: case12.id, tagId: tags[28].id },
      }), // 中庭
    ]);

    // Case 13
    const case13 = await prisma.constructionCase.create({
      data: {
        companyId: company1.id,
        authorId: memberIds.member1,
        title: "バリアフリー設計の終の棲家",
        description:
          "老後を見据えたバリアフリー設計の平屋。段差のない設計と手すりで安心して暮らせます。",
        prefecture: "愛知県",
        city: "名古屋市名東区",
        buildingArea: 105.0,
        budget: 28000000,
        completionYear: 2023,
        status: "PUBLISHED",
        publishedAt: new Date("2023-11-25"),
        viewCount: 89,
      },
    });
    await Promise.all([
      prisma.constructionCaseTag.create({
        data: { caseId: case13.id, tagId: tags[1].id },
      }), // 平屋
      prisma.constructionCaseTag.create({
        data: { caseId: case13.id, tagId: tags[5].id },
      }), // 2000万円台
      prisma.constructionCaseTag.create({
        data: { caseId: case13.id, tagId: tags[26].id },
      }), // バリアフリー
    ]);

    // Case 14
    const case14 = await prisma.constructionCase.create({
      data: {
        companyId: company5.id,
        authorId: memberIds.member6,
        title: "ペットと暮らす工夫が詰まった家",
        description:
          "愛犬のためのドッグランスペースや足洗い場を完備。ペットも家族も快適に過ごせます。",
        prefecture: "愛知県",
        city: "春日井市",
        buildingArea: 130.0,
        budget: 35000000,
        completionYear: 2024,
        status: "PUBLISHED",
        publishedAt: new Date("2024-02-15"),
        viewCount: 178,
      },
    });
    await Promise.all([
      prisma.constructionCaseTag.create({
        data: { caseId: case14.id, tagId: tags[0].id },
      }), // 二階建て
      prisma.constructionCaseTag.create({
        data: { caseId: case14.id, tagId: tags[6].id },
      }), // 3000万円台
      prisma.constructionCaseTag.create({
        data: { caseId: case14.id, tagId: tags[27].id },
      }), // ペット共生
    ]);

    // Case 15 (下書き)
    const case15 = await prisma.constructionCase.create({
      data: {
        companyId: company1.id,
        authorId: memberIds.member2,
        title: "ロフト付きのコンパクト住宅",
        description:
          "限られた空間を有効活用したロフト付き住宅。収納スペースも豊富です。",
        prefecture: "愛知県",
        city: "名古屋市昭和区",
        buildingArea: 98.0,
        budget: 26000000,
        completionYear: 2024,
        status: "DRAFT",
        viewCount: 0,
      },
    });
    await Promise.all([
      prisma.constructionCaseTag.create({
        data: { caseId: case15.id, tagId: tags[0].id },
      }), // 二階建て
      prisma.constructionCaseTag.create({
        data: { caseId: case15.id, tagId: tags[5].id },
      }), // 2000万円台
      prisma.constructionCaseTag.create({
        data: { caseId: case15.id, tagId: tags[29].id },
      }), // ロフト
    ]);

    console.log("✅ Created 15 construction cases");
  }

  // 7. 問い合わせを作成
  console.log("💬 Creating inquiries...");

  if (!customerIds.customer1 || !customerIds.customer2) {
    console.log(
      "⚠️  Skipping inquiries creation because some customers were not created"
    );
  } else {
    // Inquiry 1
    const inquiry1 = await prisma.inquiry.create({
      data: {
        customerId: customerIds.customer1,
        inquirerName: "佐藤花子",
        inquirerEmail: "customer1@example.test",
        inquirerPhone: "090-1234-5678",
        companyId: company1.id,
        message:
          "平屋の住宅を検討しています。自然素材を使った家づくりに興味があります。見学会の予定はありますでしょうか？",
        status: "IN_PROGRESS",
        respondedAt: new Date("2024-03-10"),
        createdAt: new Date("2024-03-10"),
      },
    });
    await prisma.inquiryResponse.create({
      data: {
        inquiryId: inquiry1.id,
        sender: "COMPANY",
        senderName: "山田太郎",
        message:
          "お問い合わせありがとうございます。来月の第2土曜日に完成見学会を予定しております。ぜひご参加ください。",
        createdAt: new Date("2024-03-10T14:00:00"),
      },
    });

    // Inquiry 2
    await prisma.inquiry.create({
      data: {
        customerId: customerIds.customer1,
        inquirerName: "佐藤花子",
        inquirerEmail: "customer1@example.test",
        inquirerPhone: "090-1234-5678",
        companyId: company2.id,
        message:
          "高断熱住宅について詳しく知りたいです。資料を送っていただけますか？",
        status: "NEW",
        createdAt: new Date("2024-03-15"),
      },
    });

    // Inquiry 3
    await prisma.inquiry.create({
      data: {
        customerId: customerIds.customer2,
        inquirerName: "鈴木太郎",
        inquirerEmail: "customer2@example.test",
        inquirerPhone: "080-9876-5432",
        companyId: company3.id,
        message: "岡崎市内での施工実績を教えてください。",
        status: "RESOLVED",
        respondedAt: new Date("2024-03-05"),
        createdAt: new Date("2024-03-05"),
      },
    });

    // Inquiry 4
    await prisma.inquiry.create({
      data: {
        customerId: customerIds.customer3,
        inquirerName: "高橋美咲",
        inquirerEmail: "customer3@example.test",
        inquirerPhone: "090-5555-6666",
        companyId: company4.id,
        message:
          "和モダンスタイルの家を建てたいと考えています。予算は4000万円程度です。",
        status: "IN_PROGRESS",
        respondedAt: new Date("2024-03-12"),
        createdAt: new Date("2024-03-12"),
      },
    });

    // Inquiry 5
    await prisma.inquiry.create({
      data: {
        customerId: customerIds.customer4,
        inquirerName: "田中健太",
        inquirerEmail: "customer4@example.test",
        inquirerPhone: "080-7777-8888",
        companyId: company5.id,
        message: "春日井市で土地を探しています。土地探しから相談できますか？",
        status: "NEW",
        createdAt: new Date("2024-03-18"),
      },
    });

    // Inquiry 6 (非ログインユーザーからの問い合わせ)
    await prisma.inquiry.create({
      data: {
        inquirerName: "山本次郎",
        inquirerEmail: "yamamoto@example.com",
        inquirerPhone: "090-1111-2222",
        companyId: company6.id,
        message:
          "岐阜市内で平屋を建てたいです。まずはカタログを見たいのですが。",
        status: "NEW",
        createdAt: new Date("2024-03-19"),
      },
    });

    // Inquiry 7
    await prisma.inquiry.create({
      data: {
        customerId: customerIds.customer5,
        inquirerName: "渡辺結衣",
        inquirerEmail: "customer5@example.test",
        inquirerPhone: "090-9999-0000",
        companyId: company7.id,
        message:
          "RC造の三階建てに興味があります。耐震性について詳しく教えてください。",
        status: "IN_PROGRESS",
        respondedAt: new Date("2024-03-14"),
        createdAt: new Date("2024-03-14"),
      },
    });

    // Inquiry 8
    await prisma.inquiry.create({
      data: {
        inquirerName: "伊藤さくら",
        inquirerEmail: "ito@example.com",
        inquirerPhone: "080-3333-4444",
        companyId: company8.id,
        message:
          "狭小住宅の施工事例を見て問い合わせました。ガレージ付きで検討しています。",
        status: "NEW",
        createdAt: new Date("2024-03-20"),
      },
    });

    console.log("✅ Created 8 inquiries");
  }

  console.log("✨ Seed completed successfully!");
  console.log("\n📝 Test Credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin:");
  console.log("  Email: admin@housematch.test");
  console.log("  Password: Admin123!");
  console.log("\nMembers:");
  console.log("  Email: yamada@nagoya-home.test");
  console.log("  Email: sato@toyota-housing.test");
  console.log("  (and 8 more member accounts)");
  console.log("  Password: Member123! (all)");
  console.log("\nCustomers:");
  console.log("  Email: customer1@example.test");
  console.log("  Email: customer2@example.test");
  console.log("  (and 3 more customer accounts)");
  console.log("  Password: Customer123! (all)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n📊 Data Summary:");
  console.log(`  - Companies: 10 (9 published, 1 draft)`);
  console.log(`  - Members: 10`);
  console.log(`  - Customers: 5`);
  console.log(`  - Tags: ${tags.length}`);
  console.log(`  - Construction Cases: 15 (14 published, 1 draft)`);
  console.log(`  - Inquiries: 8`);
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
