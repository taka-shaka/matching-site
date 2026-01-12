// src/app/api/tags/route.ts
// タグ一覧取得・作成API

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const withCounts = searchParams.get("withCounts") === "true";

    // Where条件を構築
    const where: any = {};
    if (category) {
      where.category = category as any;
    }

    // タグを取得（カテゴリでフィルタリング可能）
    const tags = await prisma.tag.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include: withCounts
        ? {
            _count: {
              select: {
                companies: true,
                cases: true,
              },
            },
            cases: {
              select: {
                case: {
                  select: {
                    status: true,
                  },
                },
              },
            },
          }
        : undefined,
      orderBy: [{ category: "asc" }, { displayOrder: "asc" }, { name: "asc" }],
    });

    // カウント情報を含める場合、データを整形
    const formattedTags = withCounts
      ? tags.map((tag) => {
          // 公開済み施工事例のみをカウント
          const publishedCaseCount =
            (tag as any).cases?.filter(
              (ct: any) => ct.case?.status === "PUBLISHED"
            ).length || 0;

          return {
            id: tag.id,
            name: tag.name,
            category: tag.category,
            displayOrder: tag.displayOrder,
            companyCount: (tag as any)._count?.companies || 0,
            caseCount: publishedCaseCount,
            createdAt: tag.createdAt,
            updatedAt: tag.updatedAt,
          };
        })
      : tags;

    // カテゴリ別にグループ化
    const groupedByCategory = formattedTags.reduce(
      (acc, tag) => {
        if (!acc[tag.category]) {
          acc[tag.category] = [];
        }
        acc[tag.category].push(tag);
        return acc;
      },
      {} as Record<string, typeof formattedTags>
    );

    return NextResponse.json({
      tags: formattedTags,
      byCategory: groupedByCategory,
      total: formattedTags.length,
    });
  } catch (error) {
    console.error("Failed to get tags:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      {
        error: "Failed to get tags",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    // バリデーション
    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 }
      );
    }

    // タグ名の重複チェック
    const existingTag = await prisma.tag.findUnique({
      where: { name: body.name },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: "Tag name already exists" },
        { status: 400 }
      );
    }

    // カテゴリーの検証
    const validCategories = [
      "HOUSE_TYPE",
      "PRICE_RANGE",
      "STRUCTURE",
      "ATMOSPHERE",
      "PREFERENCE",
    ];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // タグを作成
    const tag = await prisma.tag.create({
      data: {
        name: body.name,
        category: body.category as any,
        displayOrder: body.displayOrder || 0,
      },
    });

    return NextResponse.json({ success: true, tag }, { status: 201 });
  } catch (error) {
    console.error("Failed to create tag:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
