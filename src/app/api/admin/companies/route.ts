// src/app/api/admin/companies/route.ts
// Admin 工務店管理一覧取得・登録API

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
    const isPublished = searchParams.get("isPublished"); // "true" | "false" | null
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Where条件を構築
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isPublished === "true") {
      where.isPublished = true;
    } else if (isPublished === "false") {
      where.isPublished = false;
    }

    // 総件数取得
    const total = await prisma.company.count({ where });

    // 工務店一覧取得
    const companies = await prisma.company.findMany({
      where,
      include: {
        _count: {
          select: {
            members: true,
            cases: {
              where: {
                status: "PUBLISHED",
              },
            },
            inquiries: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // レスポンス用にデータを整形
    const formattedCompanies = companies.map((company) => ({
      id: company.id,
      name: company.name,
      description: company.description,
      address: company.address,
      prefecture: company.prefecture,
      city: company.city,
      phoneNumber: company.phoneNumber,
      email: company.email,
      websiteUrl: company.websiteUrl,
      logoUrl: company.logoUrl,
      isPublished: company.isPublished,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      memberCount: company._count.members,
      caseCount: company._count.cases,
      inquiryCount: company._count.inquiries,
    }));

    return NextResponse.json({
      companies: formattedCompanies,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to get companies:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to get companies" },
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
      !body.prefecture ||
      !body.city ||
      !body.address ||
      !body.phoneNumber ||
      !body.email
    ) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    if (!body.memberName || !body.memberEmail || !body.memberPassword) {
      return NextResponse.json(
        { error: "メンバー情報が入力されていません" },
        { status: 400 }
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
      // 1. 工務店を作成
      const company = await prisma.company.create({
        data: {
          name: body.name,
          description: body.description || null,
          prefecture: body.prefecture,
          city: body.city,
          address: body.address,
          phoneNumber: body.phoneNumber,
          email: body.email,
          websiteUrl: body.websiteUrl || null,
          isPublished: body.isPublished || false,
        },
      });

      // 2. Supabaseでメンバー認証アカウントを作成
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email: body.memberEmail,
          password: body.memberPassword,
          email_confirm: true,
          app_metadata: {
            user_type: "member",
            company_id: company.id,
          },
        });

      if (authError) {
        // 認証アカウント作成失敗時は工務店も削除
        await prisma.company.delete({ where: { id: company.id } });
        throw new Error(
          `メンバーアカウントの作成に失敗しました: ${authError.message}`
        );
      }

      if (!authData.user) {
        await prisma.company.delete({ where: { id: company.id } });
        throw new Error("メンバーアカウントの作成に失敗しました");
      }

      // 3. Prismaでメンバーレコードを作成
      const member = await prisma.member.create({
        data: {
          authId: authData.user.id,
          email: body.memberEmail,
          name: body.memberName,
          role: "ADMIN", // 最初のメンバーは管理者
          companyId: company.id,
          isActive: true,
        },
      });

      return NextResponse.json(
        {
          success: true,
          company: {
            id: company.id,
            name: company.name,
          },
          member: {
            id: member.id,
            email: member.email,
            name: member.name,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Transaction error:", error);
      throw error;
    }
  } catch (error) {
    console.error("Failed to create company:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "工務店の登録に失敗しました",
      },
      { status: 500 }
    );
  }
}
