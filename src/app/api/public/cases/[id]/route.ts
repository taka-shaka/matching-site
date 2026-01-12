// src/app/api/public/cases/[id]/route.ts
// 公開施工事例詳細取得API + 閲覧数カウント（認証不要）

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
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
            description: true,
            address: true,
            prefecture: true,
            city: true,
            phoneNumber: true,
            email: true,
            websiteUrl: true,
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

    // 公開されていない場合は404
    if (constructionCase.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Construction case not found" },
        { status: 404 }
      );
    }

    // 閲覧数をインクリメント（非同期で実行、エラーは無視）
    prisma.constructionCase
      .update({
        where: { id: parseInt(id) },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      })
      .catch((error) => {
        console.error("Failed to increment view count:", error);
      });

    return NextResponse.json({ case: constructionCase });
  } catch (error) {
    console.error("Failed to get construction case detail:", error);
    return NextResponse.json(
      { error: "Failed to get construction case detail" },
      { status: 500 }
    );
  }
}
