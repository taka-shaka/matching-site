// src/app/api/tags/[id]/route.ts
// タグ個別更新・削除API

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    // タグが存在するか確認
    const existingTag = await prisma.tag.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingTag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // 更新データを構築
    const updateData: any = {};

    if (body.name !== undefined) {
      if (body.name.trim() === "") {
        return NextResponse.json(
          { error: "Tag name cannot be empty" },
          { status: 400 }
        );
      }

      // 名前の重複チェック（自分以外）
      const duplicateTag = await prisma.tag.findFirst({
        where: {
          name: body.name,
          id: {
            not: parseInt(id),
          },
        },
      });

      if (duplicateTag) {
        return NextResponse.json(
          { error: "Tag name already exists" },
          { status: 400 }
        );
      }

      updateData.name = body.name.trim();
    }

    if (body.category !== undefined) {
      const validCategories = [
        "HOUSE_TYPE",
        "PRICE_RANGE",
        "STRUCTURE",
        "ATMOSPHERE",
        "PREFERENCE",
      ];
      if (!validCategories.includes(body.category)) {
        return NextResponse.json(
          { error: "Invalid category" },
          { status: 400 }
        );
      }
      updateData.category = body.category as any;
    }

    if (body.displayOrder !== undefined) {
      updateData.displayOrder = parseInt(body.displayOrder);
    }

    // タグを更新
    const updatedTag = await prisma.tag.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json({ success: true, tag: updatedTag });
  } catch (error) {
    console.error("Failed to update tag:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;

    // タグが存在するか確認
    const existingTag = await prisma.tag.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            companies: true,
            cases: true,
          },
        },
      },
    });

    if (!existingTag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // 削除前の情報を取得
    const deletionInfo = {
      tagId: existingTag.id,
      tagName: existingTag.name,
      companyCount: existingTag._count.companies,
      caseCount: existingTag._count.cases,
    };

    // タグを削除（CASCADE設定により関連データも自動削除）
    // CompanyTags, ConstructionCaseTagsが連鎖削除される
    await prisma.tag.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Tag deleted successfully",
      deletionInfo,
    });
  } catch (error) {
    console.error("Failed to delete tag:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
