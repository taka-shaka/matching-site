// src/app/api/admin/tags/[id]/route.ts
// Admin タグ更新・削除API

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

      // 同じ名前の別のタグが既に存在しないかチェック
      const duplicateTag = await prisma.tag.findFirst({
        where: {
          name: body.name.trim(),
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

    if (body.displayOrder !== undefined) {
      const newDisplayOrder = parseInt(body.displayOrder);
      if (isNaN(newDisplayOrder) || newDisplayOrder < 1) {
        return NextResponse.json(
          { error: "Invalid display order" },
          { status: 400 }
        );
      }

      // 同じカテゴリー内での表示順変更の場合
      // 他のタグの表示順を調整する必要がある
      const currentDisplayOrder = existingTag.displayOrder;

      if (newDisplayOrder !== currentDisplayOrder) {
        // トランザクションで表示順を更新
        await prisma.$transaction(async (tx) => {
          if (newDisplayOrder > currentDisplayOrder) {
            // 下に移動する場合: 間のタグを上に詰める
            await tx.tag.updateMany({
              where: {
                category: existingTag.category,
                displayOrder: {
                  gt: currentDisplayOrder,
                  lte: newDisplayOrder,
                },
              },
              data: {
                displayOrder: {
                  decrement: 1,
                },
              },
            });
          } else {
            // 上に移動する場合: 間のタグを下にずらす
            await tx.tag.updateMany({
              where: {
                category: existingTag.category,
                displayOrder: {
                  gte: newDisplayOrder,
                  lt: currentDisplayOrder,
                },
              },
              data: {
                displayOrder: {
                  increment: 1,
                },
              },
            });
          }

          // 対象のタグの表示順を更新
          await tx.tag.update({
            where: { id: parseInt(id) },
            data: { displayOrder: newDisplayOrder },
          });
        });
      }
    }

    // nameのみの更新の場合（displayOrder変更がない場合）
    if (body.name !== undefined && body.displayOrder === undefined) {
      await prisma.tag.update({
        where: { id: parseInt(id) },
        data: updateData,
      });
    }

    // 更新後のタグを取得
    const updatedTag = await prisma.tag.findUnique({
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

    if (!updatedTag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // レスポンス用にデータを整形
    const formattedTag = {
      id: updatedTag.id,
      name: updatedTag.name,
      category: updatedTag.category,
      displayOrder: updatedTag.displayOrder,
      usageCount: updatedTag._count.companies + updatedTag._count.cases,
      createdAt: updatedTag.createdAt,
      updatedAt: updatedTag.updatedAt,
    };

    return NextResponse.json({ success: true, tag: formattedTag });
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

    // 使用中のタグは削除できない
    const usageCount = existingTag._count.companies + existingTag._count.cases;
    if (usageCount > 0) {
      return NextResponse.json(
        {
          error: `Tag is currently in use (${usageCount} times). Please remove all usages before deleting.`,
        },
        { status: 400 }
      );
    }

    // トランザクションで削除と表示順の調整を実行
    await prisma.$transaction(async (tx) => {
      // タグを削除
      await tx.tag.delete({
        where: { id: parseInt(id) },
      });

      // 削除したタグより後ろの表示順を詰める
      await tx.tag.updateMany({
        where: {
          category: existingTag.category,
          displayOrder: {
            gt: existingTag.displayOrder,
          },
        },
        data: {
          displayOrder: {
            decrement: 1,
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Tag deleted successfully",
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
