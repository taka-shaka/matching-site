// src/app/api/admin/general-inquiries/route.ts
// 管理者用一般問い合わせ一覧取得API

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // フィルター条件
    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }

    // 一般問い合わせ一覧を取得
    const [inquiries, total] = await Promise.all([
      prisma.generalInquiry.findMany({
        where,
        include: {
          responses: {
            orderBy: {
              createdAt: "asc",
            },
          },
          _count: {
            select: {
              responses: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.generalInquiry.count({ where }),
    ]);

    return NextResponse.json({
      inquiries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to get general inquiries:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to get general inquiries" },
      { status: 500 }
    );
  }
}
