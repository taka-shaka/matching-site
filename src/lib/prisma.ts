// src/lib/prisma.ts
// Prisma Clientのシングルトンインスタンス
// ✅ Prisma 7 + Supabase PostgreSQL 対応（Vercel Serverless最適化）

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

// Vercelサーバーレス環境用の接続プール設定
// 各サーバーレス関数インスタンスで1接続のみ使用
function createPrismaClient() {
  const pool = new Pool({
    connectionString,
    max: 1, // Vercelサーバーレス環境では1接続に制限
    idleTimeoutMillis: 60000, // 60秒後にアイドル接続を閉じる
    connectionTimeoutMillis: 10000, // 接続タイムアウト10秒
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
