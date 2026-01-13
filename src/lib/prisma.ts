// src/lib/prisma.ts
// Prisma Clientのシングルトンインスタンス
// ✅ Prisma 7 + Supabase PostgreSQL 対応

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// PostgreSQL接続プールの作成
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    max: 10, // 最大接続数
    idleTimeoutMillis: 30000, // アイドル接続のタイムアウト（30秒）
    connectionTimeoutMillis: 2000, // 接続タイムアウト（2秒）
  });

// Prisma PostgreSQLアダプターの作成
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;
