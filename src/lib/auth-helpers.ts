// src/lib/auth-helpers.ts
// Supabase Auth統合用のヘルパー関数（サーバーサイド専用）
// ✅ Next.js 15.5.7 + @supabase/ssr 完全対応版
// ⚠️ クライアントコンポーネントでは auth-provider.ts を使用してください

import { redirect } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { createSupabaseServerClient, createSupabaseAdminClient } from "./supabase";
import { prisma } from "./prisma";

// ========================================
// 現在のユーザー取得（サーバーサイド）
// ✅ Next.js 15対応: cookies()はasync
// ========================================

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

// ========================================
// ユーザータイプ取得
// ========================================

export function getUserType(
  user: User
): "admin" | "member" | "customer" | null {
  return user?.app_metadata?.user_type || null;
}

export function getCompanyId(user: User): number | null {
  return user?.app_metadata?.company_id || null;
}

// ========================================
// 認証チェック関数（Server Components / API Routes用）
// ========================================

/**
 * Admin専用ページの認証チェック
 * 認証されていない場合はログインページにリダイレクト
 */
export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const userType = getUserType(user);

  if (userType !== "admin") {
    redirect("/unauthorized");
  }

  // Prismaデータベースからadmin情報を取得
  const admin = await prisma.admin.findUnique({
    where: { authId: user.id },
  });

  if (!admin || !admin.isActive) {
    redirect("/admin/login?error=inactive");
  }

  return { user, admin };
}

/**
 * Member専用ページの認証チェック
 */
export async function requireMember() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/member/login");
  }

  const userType = getUserType(user);

  if (userType !== "member") {
    redirect("/unauthorized");
  }

  // Prismaデータベースからmember情報を取得
  const member = await prisma.member.findUnique({
    where: { authId: user.id },
    include: { company: true },
  });

  if (!member || !member.isActive) {
    redirect("/member/login?error=inactive");
  }

  return { user, member };
}

/**
 * Customer専用ページの認証チェック
 */
export async function requireCustomer() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userType = getUserType(user);

  if (userType !== "customer") {
    redirect("/unauthorized");
  }

  // Prismaデータベースからcustomer情報を取得
  const customer = await prisma.customer.findUnique({
    where: { authId: user.id },
  });

  if (!customer || !customer.isActive) {
    redirect("/login?error=inactive");
  }

  return { user, customer };
}

/**
 * Memberが自社のデータにアクセスしているかチェック
 */
export async function checkCompanyAccess(companyId: number) {
  const { member } = await requireMember();

  if (member.companyId !== companyId) {
    throw new Error("Unauthorized: Cannot access other company data");
  }

  return true;
}

// ========================================
// ユーザー作成関数（サーバーサイド専用）
// ========================================

/**
 * Adminユーザーを作成
 */
export async function createAdmin(params: {
  email: string;
  password: string;
  name: string;
  role?: "SUPER_ADMIN" | "ADMIN";
}) {
  const supabaseAdmin = createSupabaseAdminClient();

  // 1. Supabase Authでユーザーを作成
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: params.email,
      password: params.password,
      email_confirm: true, // 自動でメール認証済みに
      app_metadata: {
        user_type: "admin",
      },
    });

  if (authError) {
    throw new Error(`Failed to create auth user: ${authError.message}`);
  }

  if (!authData.user) {
    throw new Error("Failed to create auth user");
  }

  // 2. Prismaデータベースにadminレコードを作成
  try {
    const admin = await prisma.admin.create({
      data: {
        authId: authData.user.id,
        email: params.email,
        name: params.name,
        role: params.role || "ADMIN",
      },
    });

    return { authUser: authData.user, admin };
  } catch (error) {
    // エラーが発生したらSupabase Authのユーザーも削除
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    throw error;
  }
}

/**
 * Memberユーザーを作成
 */
export async function createMember(params: {
  email: string;
  password: string;
  name: string;
  companyId: number;
  role?: "ADMIN" | "GENERAL";
}) {
  const supabaseAdmin = createSupabaseAdminClient();

  // 1. Companyが存在するか確認
  const company = await prisma.company.findUnique({
    where: { id: params.companyId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // 2. Supabase Authでユーザーを作成
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: params.email,
      password: params.password,
      email_confirm: true,
      app_metadata: {
        user_type: "member",
        company_id: params.companyId,
      },
    });

  if (authError) {
    throw new Error(`Failed to create auth user: ${authError.message}`);
  }

  if (!authData.user) {
    throw new Error("Failed to create auth user");
  }

  // 3. Prismaデータベースにmemberレコードを作成
  try {
    const member = await prisma.member.create({
      data: {
        authId: authData.user.id,
        email: params.email,
        name: params.name,
        companyId: params.companyId,
        role: params.role || "GENERAL",
      },
    });

    return { authUser: authData.user, member };
  } catch (error) {
    // エラーが発生したらSupabase Authのユーザーも削除
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    throw error;
  }
}

/**
 * Customerユーザーを作成（サインアップ）
 * ⚠️ 通常はクライアント側から auth-provider.ts の signUp を使用
 */
export async function createCustomer(params: {
  email: string;
  password: string;
  lastName?: string;
  firstName?: string;
}) {
  const supabaseAdmin = createSupabaseAdminClient();

  // 1. Supabase Authでユーザーを作成
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: params.email,
      password: params.password,
      email_confirm: false, // メール認証必要
      app_metadata: {
        user_type: "customer",
      },
      user_metadata: {
        full_name:
          params.lastName && params.firstName
            ? `${params.lastName} ${params.firstName}`
            : undefined,
      },
    });

  if (authError) {
    throw new Error(`Failed to create auth user: ${authError.message}`);
  }

  if (!authData.user) {
    throw new Error("Failed to create auth user");
  }

  // 2. Prismaデータベースにcustomerレコードを作成
  try {
    const customer = await prisma.customer.create({
      data: {
        authId: authData.user.id,
        email: params.email,
        lastName: params.lastName,
        firstName: params.firstName,
      },
    });

    return { authUser: authData.user, customer };
  } catch (error) {
    // エラーが発生したらSupabase Authのユーザーも削除
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    throw error;
  }
}

// ========================================
// ユーザー更新関数
// ========================================

/**
 * ユーザーのメールアドレスを更新
 */
export async function updateUserEmail(authId: string, newEmail: string) {
  const supabaseAdmin = createSupabaseAdminClient();
  const { error } = await supabaseAdmin.auth.admin.updateUserById(authId, {
    email: newEmail,
  });

  if (error) {
    throw new Error(`Failed to update email: ${error.message}`);
  }
}

/**
 * ユーザーのパスワードを更新
 */
export async function updateUserPassword(authId: string, newPassword: string) {
  const supabaseAdmin = createSupabaseAdminClient();
  const { error } = await supabaseAdmin.auth.admin.updateUserById(authId, {
    password: newPassword,
  });

  if (error) {
    throw new Error(`Failed to update password: ${error.message}`);
  }
}

/**
 * ユーザーを削除
 */
export async function deleteUser(
  authId: string,
  userType: "admin" | "member" | "customer"
) {
  const supabaseAdmin = createSupabaseAdminClient();

  // 1. Prismaデータベースから削除
  switch (userType) {
    case "admin":
      await prisma.admin.delete({ where: { authId } });
      break;
    case "member":
      await prisma.member.delete({ where: { authId } });
      break;
    case "customer":
      await prisma.customer.delete({ where: { authId } });
      break;
  }

  // 2. Supabase Authから削除
  const { error } = await supabaseAdmin.auth.admin.deleteUser(authId);

  if (error) {
    throw new Error(`Failed to delete auth user: ${error.message}`);
  }
}

// ========================================
// セッション管理
// ========================================

/**
 * 最終ログイン日時を更新
 */
export async function updateLastLogin(
  authId: string,
  userType: "admin" | "member" | "customer"
) {
  const now = new Date();

  switch (userType) {
    case "admin":
      await prisma.admin.update({
        where: { authId },
        data: { lastLoginAt: now },
      });
      break;
    case "member":
      await prisma.member.update({
        where: { authId },
        data: { lastLoginAt: now },
      });
      break;
    case "customer":
      await prisma.customer.update({
        where: { authId },
        data: { lastLoginAt: now },
      });
      break;
  }
}

// ========================================
// 使用例（Server Components）- Next.js 15対応
// ========================================

/*
// ✅ Next.js 15: Server Component
// app/admin/page.tsx

import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'

// ✅ async function
export default async function AdminDashboard() {
  // ✅ await で認証チェック
  const { admin } = await requireAdmin()
  
  // ✅ Prisma クエリ
  const stats = await prisma.admin.count()
  
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {admin.name}</p>
      <p>Total admins: {stats}</p>
    </div>
  )
}
*/

/*
// ✅ Next.js 15: Dynamic Route with params
// app/admin/users/[id]/page.tsx

import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{ id: string }>  // ✅ Promise型
}

export default async function AdminUserPage({ params }: PageProps) {
  // ✅ await でparamsを取得
  const { id } = await params
  
  // 認証チェック
  const { admin } = await requireAdmin()
  
  // ユーザー情報取得
  const user = await prisma.customer.findUnique({
    where: { id: parseInt(id) }
  })
  
  if (!user) {
    return <div>User not found</div>
  }
  
  return (
    <div>
      <h1>User: {user.email}</h1>
    </div>
  )
}
*/

/*
// ✅ Next.js 15: API Route
// app/api/member/cases/route.ts

import { requireMember } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // ✅ await で認証チェック
    const { member } = await requireMember()
    
    // ✅ アプリ層でデータスコープを制御
    const cases = await prisma.constructionCase.findMany({
      where: {
        companyId: member.companyId  // 自社のデータのみ
      },
      include: {
        property: true,
        tags: true
      }
    })
    
    return NextResponse.json({ cases })
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { member } = await requireMember()
    const body = await request.json()
    
    // 新しい施工事例を作成
    const newCase = await prisma.constructionCase.create({
      data: {
        ...body,
        companyId: member.companyId  // 自動的に自社IDをセット
      }
    })
    
    return NextResponse.json({ case: newCase }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create case' },
      { status: 500 }
    )
  }
}
*/
