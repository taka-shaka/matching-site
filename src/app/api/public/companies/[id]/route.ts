// src/app/api/public/companies/[id]/route.ts
// 公開工務店詳細取得API（認証不要）

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

    // 工務店詳細を取得
    const company = await prisma.company.findUnique({
      where: {
        id: parseInt(id),
      },
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
            description: true,
            mainImageUrl: true,
            budget: true,
            prefecture: true,
            city: true,
            publishedAt: true,
            viewCount: true,
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
            members: true,
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // 公開されていない場合は404
    if (!company.isPublished) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({ company });
  } catch (error) {
    console.error("Failed to get company detail:", error);
    return NextResponse.json(
      { error: "Failed to get company detail" },
      { status: 500 }
    );
  }
}
