// src/app/api/admin/cases/[id]/route.ts
// Admin 施工事例詳細取得・更新・削除API

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;

    // 施工事例詳細を取得
    const constructionCase = await prisma.constructionCase.findUnique({
      where: {
        id: parseInt(id),
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
        author: {
          select: {
            id: true,
            name: true,
            email: true,
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
        images: {
          orderBy: {
            displayOrder: "asc",
          },
        },
      },
    });

    if (!constructionCase) {
      return NextResponse.json(
        { error: "Construction case not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ case: constructionCase });
  } catch (error) {
    console.error("Failed to get construction case detail:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to get construction case detail" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    // 施工事例が存在するか確認
    const existingCase = await prisma.constructionCase.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCase) {
      return NextResponse.json(
        { error: "Construction case not found" },
        { status: 404 }
      );
    }

    // 更新データを構築
    const updateData: any = {};

    if (body.title !== undefined) {
      if (body.title.trim() === "") {
        return NextResponse.json(
          { error: "タイトルを入力してください" },
          { status: 400 }
        );
      }
      updateData.title = body.title.trim();
    }

    if (body.description !== undefined) {
      updateData.description = body.description || null;
    }

    if (body.prefecture !== undefined) {
      updateData.prefecture = body.prefecture;
    }

    if (body.city !== undefined) {
      updateData.city = body.city;
    }

    if (body.buildingArea !== undefined) {
      updateData.buildingArea = body.buildingArea
        ? parseFloat(body.buildingArea)
        : null;
    }

    if (body.budget !== undefined) {
      updateData.budget = body.budget ? parseInt(body.budget) : null;
    }

    if (body.completionYear !== undefined) {
      updateData.completionYear = body.completionYear
        ? parseInt(body.completionYear)
        : null;
    }

    if (body.mainImageUrl !== undefined) {
      updateData.mainImageUrl = body.mainImageUrl || null;
    }

    if (body.status !== undefined) {
      // ステータスのバリデーション
      if (body.status !== "DRAFT" && body.status !== "PUBLISHED") {
        return NextResponse.json(
          { error: "無効なステータスが指定されました" },
          { status: 400 }
        );
      }
      updateData.status = body.status;

      // 公開ステータスに変更する場合、publishedAtを設定
      if (body.status === "PUBLISHED" && !existingCase.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    // タグの更新処理
    if (body.tagIds !== undefined && Array.isArray(body.tagIds)) {
      // 既存のタグを全て削除
      await prisma.constructionCaseTag.deleteMany({
        where: { caseId: parseInt(id) },
      });

      // 新しいタグを追加
      if (body.tagIds.length > 0) {
        await prisma.constructionCaseTag.createMany({
          data: body.tagIds.map((tagId: number) => ({
            caseId: parseInt(id),
            tagId: tagId,
          })),
        });
      }
    }

    // 施工事例情報を更新
    const updatedCase = await prisma.constructionCase.update({
      where: { id: parseInt(id) },
      data: updateData,
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
    });

    return NextResponse.json({ success: true, case: updatedCase });
  } catch (error) {
    console.error("Failed to update construction case:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "施工事例の更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;

    // 施工事例が存在するか確認
    const existingCase = await prisma.constructionCase.findUnique({
      where: { id: parseInt(id) },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            images: true,
            tags: true,
          },
        },
      },
    });

    if (!existingCase) {
      return NextResponse.json(
        { error: "Construction case not found" },
        { status: 404 }
      );
    }

    // 削除前の確認情報を取得
    const deletionInfo = {
      caseId: existingCase.id,
      caseTitle: existingCase.title,
      companyName: existingCase.company.name,
      authorName: existingCase.author.name,
      imageCount: existingCase._count.images,
      tagCount: existingCase._count.tags,
    };

    // 施工事例を削除（CASCADE設定により関連データも自動削除）
    // CaseImages, CaseTagsなどが連鎖削除される
    await prisma.constructionCase.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Construction case deleted successfully",
      deletionInfo,
    });
  } catch (error) {
    console.error("Failed to delete construction case:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "施工事例の削除に失敗しました" },
      { status: 500 }
    );
  }
}
