// src/app/api/public/companies/route.ts
// 公開工務店一覧取得API（認証不要）

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // フィルター条件
    const prefecture = searchParams.get("prefecture");
    const tagIds = searchParams.get("tagIds"); // カンマ区切り
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Where条件を構築
    const where: any = {
      isPublished: true, // 公開済みのみ
    };

    if (prefecture) {
      where.prefecture = prefecture;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
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
    const total = await prisma.company.count({ where });

    // 工務店一覧取得
    const companies = await prisma.company.findMany({
      where,
      include: {
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
        cases: {
          where: {
            status: "PUBLISHED",
          },
          select: {
            id: true,
            title: true,
            mainImageUrl: true,
          },
          take: 3, // 最新3件
          orderBy: {
            publishedAt: "desc",
          },
        },
        _count: {
          select: {
            cases: {
              where: {
                status: "PUBLISHED",
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
      companies,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to get companies:", error);
    return NextResponse.json(
      { error: "Failed to get companies" },
      { status: 500 }
    );
  }
}
