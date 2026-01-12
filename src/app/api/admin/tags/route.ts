// src/app/api/admin/tags/route.ts
// Admin タグ管理一覧取得・新規作成API

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;

    // フィルター条件
    const category = searchParams.get("category"); // HOUSE_TYPE, PRICE_RANGE, etc.
    const search = searchParams.get("search");

    // Where条件を構築
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    // タグ一覧を取得（使用数も計算）
    const tags = await prisma.tag.findMany({
      where,
      include: {
        _count: {
          select: {
            companies: true,
            cases: true,
          },
        },
      },
      orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
    });

    // レスポンス用にデータを整形（使用数 = 工務店数 + 施工事例数）
    const formattedTags = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      category: tag.category,
      displayOrder: tag.displayOrder,
      usageCount: tag._count.companies + tag._count.cases,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    }));

    return NextResponse.json({ tags: formattedTags });
  } catch (error) {
    console.error("Failed to get tags:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Failed to get tags" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    // バリデーション
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      );
    }

    if (!body.category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    // カテゴリーの妥当性チェック
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

    // 同じ名前のタグが既に存在しないかチェック
    const existingTag = await prisma.tag.findUnique({
      where: { name: body.name.trim() },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: "Tag name already exists" },
        { status: 400 }
      );
    }

    // そのカテゴリーの最大displayOrderを取得
    const maxDisplayOrder = await prisma.tag.findFirst({
      where: { category: body.category },
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });

    const newDisplayOrder = maxDisplayOrder
      ? maxDisplayOrder.displayOrder + 1
      : 1;

    // タグを作成
    const newTag = await prisma.tag.create({
      data: {
        name: body.name.trim(),
        category: body.category,
        displayOrder: newDisplayOrder,
      },
      include: {
        _count: {
          select: {
            companies: true,
            cases: true,
          },
        },
      },
    });

    // レスポンス用にデータを整形
    const formattedTag = {
      id: newTag.id,
      name: newTag.name,
      category: newTag.category,
      displayOrder: newTag.displayOrder,
      usageCount: newTag._count.companies + newTag._count.cases,
      createdAt: newTag.createdAt,
      updatedAt: newTag.updatedAt,
    };

    return NextResponse.json(
      { success: true, tag: formattedTag },
      { status: 201 }
    );
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
