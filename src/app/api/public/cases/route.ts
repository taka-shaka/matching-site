// src/app/api/public/cases/route.ts
// 公開施工事例一覧取得API（認証不要）

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // フィルター条件
    const prefecture = searchParams.get("prefecture");
    const minBudget = searchParams.get("minBudget");
    const maxBudget = searchParams.get("maxBudget");
    const tagIds = searchParams.get("tagIds"); // カンマ区切り
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Where条件を構築
    const where: any = {
      status: "PUBLISHED", // 公開済みのみ
    };

    if (prefecture) {
      where.prefecture = prefecture;
    }

    if (minBudget || maxBudget) {
      where.budget = {};
      if (minBudget) {
        where.budget.gte = parseInt(minBudget);
      }
      if (maxBudget) {
        where.budget.lte = parseInt(maxBudget);
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (tagIds) {
      const tagIdArray = tagIds.split(",").map((id) => parseInt(id));
      where.tags = {
        some: {
          tagId: {
            in: tagIdArray,
          },
        },
      };
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
            logoUrl: true,
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
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
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
    return NextResponse.json(
      { error: "Failed to get construction cases" },
      { status: 500 }
    );
  }
}
