// next.config.ts
// ✅ React 19.0.1 + Next.js 15.5.7 完全対応版

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ========================================
  // React 19 対応
  // ========================================
  reactStrictMode: true,

  // ========================================
  // 画像最適化（Supabase Storage）
  // ========================================
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ========================================
  // 環境変数の検証
  // ========================================
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_AUTH_PROVIDER:
      process.env.NEXT_PUBLIC_AUTH_PROVIDER || "supabase",
  },

  // ========================================
  // Turbopack 設定（Next.js 15のデフォルト）
  // ========================================
  // Turbopackは自動的に有効
  // 無効化したい場合: npm run dev -- --no-turbo

  // 実験的機能
  // experimental: {
  //   typedRoutes: true,  // 型安全なルーティング
  // },

  // ========================================
  // TypeScript 設定
  // ========================================
  typescript: {
    // 型エラーでもビルドを続行（本番環境では false 推奨）
    ignoreBuildErrors: false,
  },

  // ========================================
  // ESLint 設定
  // ========================================
  eslint: {
    // Lint エラーでもビルドを続行（本番環境では false 推奨）
    ignoreDuringBuilds: false,
    dirs: ["src", "pages", "app"],
  },

  // ========================================
  // 本番環境最適化
  // ========================================
  compress: true,
  poweredByHeader: false,

  // ========================================
  // ログ設定
  // ========================================
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },

  // ========================================
  // セキュリティヘッダー
  // ========================================
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // ========================================
  // リダイレクト設定
  // ========================================
  async redirects() {
    return [
      // 例: 旧URLから新URLへのリダイレクト
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true
      // }
    ];
  },

  // ========================================
  // リライト設定（プロキシ等）
  // ========================================
  async rewrites() {
    return [
      // 例: APIプロキシ
      // {
      //   source: '/api/:path*',
      //   destination: 'https://external-api.com/:path*'
      // }
    ];
  },
};

// ========================================
// 環境変数の存在確認（開発時）
// ========================================
if (process.env.NODE_ENV === "development") {
  const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "DATABASE_URL",
    "DIRECT_URL",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingEnvVars.length > 0) {
    console.warn("\n⚠️  警告: 以下の環境変数が設定されていません:");
    missingEnvVars.forEach((varName) => {
      console.warn(`   - ${varName}`);
    });
    console.warn("\n.env ファイルを確認してください。\n");
  } else {
    console.log("✅ 環境変数の確認完了");
  }
}

export default nextConfig;
