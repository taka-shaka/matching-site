// src/app/api/member/cases/[id]/route.ts
// Member 施工事例詳細取得・更新・削除API

import { NextRequest, NextResponse } from "next/server";
import { requireMember } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { member } = await requireMember();
    const { id } = await params;

    // 施工事例詳細を取得
    const constructionCase = await prisma.constructionCase.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        company: {
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

    if (!constructionCase) {
      return NextResponse.json(
        { error: "Construction case not found" },
        { status: 404 }
      );
    }

    // 自社の施工事例かチェック
    if (constructionCase.companyId !== member.companyId) {
      return NextResponse.json(
        { error: "Unauthorized access to this case" },
        { status: 403 }
      );
    }

    return NextResponse.json({ case: constructionCase });
  } catch (error) {
    console.error("Failed to get case detail:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to get case detail" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { member } = await requireMember();
    const { id } = await params;
    const body = await request.json();

    // 施工事例が存在し、自社のものか確認
    const existingCase = await prisma.constructionCase.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCase) {
      return NextResponse.json(
        { error: "Construction case not found" },
        { status: 404 }
      );
    }

    if (existingCase.companyId !== member.companyId) {
      return NextResponse.json(
        { error: "Unauthorized access to this case" },
        { status: 403 }
      );
    }

    // 更新データを構築
    const updateData: any = {};

    if (body.title !== undefined) {
      if (body.title.trim() === "") {
        return NextResponse.json(
          { error: "Title cannot be empty" },
          { status: 400 }
        );
      }
      updateData.title = body.title.trim();
    }

    if (body.description !== undefined) {
      if (body.description.trim() === "") {
        return NextResponse.json(
          { error: "Description cannot be empty" },
          { status: 400 }
        );
      }
      updateData.description = body.description.trim();
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
      const validStatuses = ["DRAFT", "PUBLISHED"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 }
        );
      }
      updateData.status = body.status;

      // 公開に変更する場合、publishedAtを設定
      if (body.status === "PUBLISHED" && !existingCase.publishedAt) {
        updateData.publishedAt = new Date();
      }

      // 下書きに戻す場合、publishedAtをnullに
      if (body.status === "DRAFT") {
        updateData.publishedAt = null;
      }
    }

    // 施工事例を更新
    const updatedCase = await prisma.constructionCase.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
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
    console.error("Failed to update case:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to update case" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { member } = await requireMember();
    const { id } = await params;

    // 施工事例が存在し、自社のものか確認
    const existingCase = await prisma.constructionCase.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCase) {
      return NextResponse.json(
        { error: "Construction case not found" },
        { status: 404 }
      );
    }

    if (existingCase.companyId !== member.companyId) {
      return NextResponse.json(
        { error: "Unauthorized access to this case" },
        { status: 403 }
      );
    }

    // 施工事例を削除（関連するタグも自動削除される）
    await prisma.constructionCase.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true, message: "Case deleted" });
  } catch (error) {
    console.error("Failed to delete case:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to delete case" },
      { status: 500 }
    );
  }
}
