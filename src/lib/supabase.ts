// src/lib/supabase.ts
// Supabase Clientの初期化
// ✅ Next.js 15.5.7 + @supabase/ssr 完全対応版

import { createBrowserClient } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";
import { createClient, User } from "@supabase/supabase-js";

// 環境変数チェック
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

// ========================================
// クライアントサイド用（ブラウザ）
// ========================================

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ========================================
// サーバーサイド用（APIルート、Server Components）
// ✅ Next.js 15対応: cookies()はasync
// ✅ Dynamic importでクライアント側でのエラーを回避
// ========================================

export async function createSupabaseServerClient() {
  // Dynamic import to avoid importing next/headers at top level
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Componentからのset呼び出しは無視
          }
        },
      },
    }
  );
}

// ========================================
// 管理者用（Service Role Key使用）
// ========================================

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// ========================================
// 型定義
// ========================================

export type UserType = "admin" | "member" | "customer";

export interface AppMetadata {
  user_type: UserType;
  company_id?: number; // memberの場合のみ
}

export interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
}

// ========================================
// ユーティリティ関数
// ========================================

/**
 * Supabase AuthユーザーからユーザータイプMemberを取得
 */
export function getUserType(user: User): UserType | null {
  return user?.app_metadata?.user_type || null;
}

/**
 * Supabase AuthユーザーからCompany IDを取得（Memberの場合）
 */
export function getCompanyId(user: User): number | null {
  return user?.app_metadata?.company_id || null;
}

/**
 * 現在ログイン中のユーザーを取得
 * ✅ Next.js 15対応: async function
 */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * ユーザーがAdminかチェック
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return getUserType(user) === "admin";
}

/**
 * ユーザーがMemberかチェック
 */
export async function isMember(): Promise<boolean> {
  const user = await getCurrentUser();
  return getUserType(user) === "member";
}

/**
 * ユーザーがCustomerかチェック
 */
export async function isCustomer(): Promise<boolean> {
  const user = await getCurrentUser();
  return getUserType(user) === "customer";
}
