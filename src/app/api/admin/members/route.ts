// src/app/api/admin/members/route.ts
// Admin メンバー管理一覧取得・登録API

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;

    // フィルター条件
    const search = searchParams.get("search");
    const companyId = searchParams.get("companyId");
    const isActive = searchParams.get("isActive"); // "true" | "false" | null
    const role = searchParams.get("role"); // "ADMIN" | "GENERAL" | null
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Where条件を構築
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (companyId) {
      where.companyId = parseInt(companyId);
    }

    if (isActive === "true") {
      where.isActive = true;
    } else if (isActive === "false") {
      where.isActive = false;
    }

    if (role) {
      where.role = role;
    }

    // 総件数取得
    const total = await prisma.member.count({ where });

    // メンバー一覧取得
    const members = await prisma.member.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            prefecture: true,
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      members,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to get members:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to get members" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();

    // バリデーション
    if (
      !body.name ||
      !body.email ||
      !body.password ||
      !body.companyId ||
      !body.role
    ) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    // 役割のバリデーション
    if (body.role !== "ADMIN" && body.role !== "GENERAL") {
      return NextResponse.json(
        { error: "無効な役割が指定されました" },
        { status: 400 }
      );
    }

    // 工務店の存在確認
    const company = await prisma.company.findUnique({
      where: { id: body.companyId },
    });

    if (!company) {
      return NextResponse.json(
        { error: "指定された工務店が見つかりません" },
        { status: 404 }
      );
    }

    // Supabase Admin クライアントの作成
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

    // トランザクション的な処理
    try {
      // 1. Supabaseでメンバー認証アカウントを作成
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email: body.email,
          password: body.password,
          email_confirm: true,
          app_metadata: {
            user_type: "member",
            company_id: body.companyId,
          },
        });

      if (authError) {
        throw new Error(
          `メンバーアカウントの作成に失敗しました: ${authError.message}`
        );
      }

      if (!authData.user) {
        throw new Error("メンバーアカウントの作成に失敗しました");
      }

      // 2. Prismaでメンバーレコードを作成
      const member = await prisma.member.create({
        data: {
          authId: authData.user.id,
          email: body.email,
          name: body.name,
          role: body.role,
          companyId: body.companyId,
          isActive: true,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              prefecture: true,
              city: true,
            },
          },
        },
      });

      return NextResponse.json(
        {
          success: true,
          member: {
            id: member.id,
            email: member.email,
            name: member.name,
            role: member.role,
            company: member.company,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      // エラー時はSupabaseアカウントの削除を試みる（ベストエフォート）
      console.error("Transaction error:", error);
      throw error;
    }
  } catch (error) {
    console.error("Failed to create member:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "メンバーの登録に失敗しました",
      },
      { status: 500 }
    );
  }
}
