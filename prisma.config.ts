// prisma.config.ts
// Prisma 7 設定ファイル

import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

// 1. .envを読み込む（デフォルト値・テンプレート）
config({ path: '.env' });

// 2. .env.localがあれば上書き（実際の値を優先）
config({ path: '.env.local', override: true });

export default defineConfig({
  datasource: {
    // マイグレーション時はDIRECT_URLを使用（Connection Poolingをバイパス）
    url: process.env.DIRECT_URL || process.env.DATABASE_URL!,
  },
  migrations: {
    seed: 'npx tsx prisma/seed.ts',
  },
});
