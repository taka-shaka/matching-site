// src/app/api/admin/cases/route.ts
// Admin 施工事例管理一覧取得API

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;

    // フィルター条件
    const search = searchParams.get("search");
    const companyId = searchParams.get("companyId");
    const status = searchParams.get("status"); // "DRAFT" | "PUBLISHED" | null
    const prefecture = searchParams.get("prefecture");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Where条件を構築
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (companyId) {
      where.companyId = parseInt(companyId);
    }

    if (status) {
      where.status = status;
    }

    if (prefecture) {
      where.prefecture = prefecture;
    }

    // 総件数取得
    const total = await prisma.constructionCase.count({ where });

    // 施工事例一覧取得
    const cases = await prisma.constructionCase.findMany({
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
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
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
      cases,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to get construction cases:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to get construction cases" },
      { status: 500 }
    );
  }
}
