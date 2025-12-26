// src/app/api/admin/customers/route.ts
// Admin 顧客管理一覧取得API

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;

    // フィルター条件
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive"); // "true" | "false" | null
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Where条件を構築
    const where: any = {};

    if (search) {
      where.OR = [
        { lastName: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phoneNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isActive === "true") {
      where.isActive = true;
    } else if (isActive === "false") {
      where.isActive = false;
    }

    // 総件数取得
    const total = await prisma.customer.count({ where });

    // 顧客一覧取得
    const customers = await prisma.customer.findMany({
      where,
      include: {
        _count: {
          select: {
            inquiries: true,
          },
        },
        inquiries: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5, // 最新5件のみ
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      customers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to get customers:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to get customers" },
      { status: 500 }
    );
  }
}
