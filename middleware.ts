// middleware.ts
// ✅ React 19.0.1 + Next.js 15.5.7 + @supabase/ssr 完全対応版
// Next.js Middleware - 認証チェックとルート保護

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // セッションを取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  // ========================================
  // Admin Routes保護
  // ========================================
  if (pathname.startsWith("/admin")) {
    // ログインページは除外
    if (pathname === "/admin/login") {
      // 既にログイン済みの場合はダッシュボードへ
      if (session) {
        const userType = session.user.app_metadata?.user_type;
        if (userType === "admin") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      }
      return response;
    }

    // 認証チェック
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Admin権限チェック
    const userType = session.user.app_metadata?.user_type;
    if (userType !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // ========================================
  // Member Routes保護
  // ========================================
  if (pathname.startsWith("/member")) {
    // ログインページは除外
    if (pathname === "/member/login") {
      // 既にログイン済みの場合はダッシュボードへ
      if (session) {
        const userType = session.user.app_metadata?.user_type;
        if (userType === "member") {
          return NextResponse.redirect(new URL("/member", request.url));
        }
      }
      return response;
    }

    // 認証チェック
    if (!session) {
      return NextResponse.redirect(new URL("/member/login", request.url));
    }

    // Member権限チェック
    const userType = session.user.app_metadata?.user_type;
    if (userType !== "member") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // ========================================
  // Customer Routes保護
  // ========================================
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/my")) {
    // 認証チェック
    if (!session) {
      // リダイレクト先にreturn URLを追加
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Customer権限チェック
    const userType = session.user.app_metadata?.user_type;
    if (userType !== "customer") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // ========================================
  // ログインページのリダイレクト処理
  // ========================================
  if (pathname === "/login" || pathname === "/signup") {
    if (session) {
      const userType = session.user.app_metadata?.user_type;

      // ユーザータイプごとに適切なダッシュボードへリダイレクト
      switch (userType) {
        case "admin":
          return NextResponse.redirect(new URL("/admin", request.url));
        case "member":
          return NextResponse.redirect(new URL("/member", request.url));
        case "customer":
          return NextResponse.redirect(new URL("/dashboard", request.url));
        default:
          // デフォルトはcustomerダッシュボード
          return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return response;
}

// ========================================
// Middlewareを適用するパス
// ========================================
export const config = {
  matcher: [
    /*
     * 以下のパスにMiddlewareを適用:
     * - /admin/*（管理者専用）
     * - /member/*（工務店担当者専用）
     * - /dashboard/*（顧客ダッシュボード）
     * - /my/*（顧客マイページ）
     * - /login, /signup（ログイン済みユーザーのリダイレクト）
     *
     * 除外するパス:
     * - /api/* (API routes)
     * - /_next/* (Next.js internal)
     * - /_static/* (static files)
     * - /favicon.ico, /robots.txt (public files)
     */
    "/admin/:path*",
    "/member/:path*",
    "/dashboard/:path*",
    "/my/:path*",
    "/login",
    "/signup",
  ],
};

/*
========================================
使用例と動作説明
========================================

1. Admin保護
   ❌ 未ログイン → /admin/login へリダイレクト
   ❌ Customer/Memberユーザー → /unauthorized へリダイレクト
   ✅ Adminユーザー → アクセス許可

2. Member保護
   ❌ 未ログイン → /member/login へリダイレクト
   ❌ Admin/Customerユーザー → /unauthorized へリダイレクト
   ✅ Memberユーザー → アクセス許可

3. Customer保護
   ❌ 未ログイン → /login?redirect=/dashboard へリダイレクト
   ❌ Admin/Memberユーザー → /unauthorized へリダイレクト
   ✅ Customerユーザー → アクセス許可

4. ログイン済みユーザー
   /login にアクセス → 各ダッシュボードへ自動リダイレクト
   - Admin → /admin
   - Member → /member
   - Customer → /dashboard

========================================
カスタマイズ方法
========================================

# 保護するパスを追加したい場合
export const config = {
  matcher: [
    '/admin/:path*',
    '/member/:path*',
    '/dashboard/:path*',
    '/my/:path*',
    '/settings/:path*',  // ← 追加
    '/login',
    '/signup'
  ]
}

# 特定のパスを除外したい場合
if (pathname.startsWith('/member')) {
  // 特定のパスは認証不要
  if (pathname === '/member/public') {
    return res
  }
  
  // 以下、通常の認証チェック
  if (!session) {
    // ...
  }
}

========================================
セキュリティノート
========================================

1. このMiddlewareは「基本的な」認証チェックのみ
   - 詳細な権限チェックはServer Componentsで実施
   - APIルートでも再度認証チェック必須

2. RLS（Row Level Security）との組み合わせ
   - Middlewareでルートレベルの保護
   - RLSでデータレベルの保護
   - 二重の防御で安全性を確保

3. session情報の取り扱い
   - app_metadataはSupabaseで管理
   - 改ざん不可能
   - 信頼できる情報源

========================================
*/
