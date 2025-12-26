// src/app/api/admin/members/route.ts
// Admin メンバー管理一覧取得API

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;

    // フィルター条件
    const search = searchParams.get("search");
    const companyId = searchParams.get("companyId");
    const isActive = searchParams.get("isActive"); // "true" | "false" | null
    const role = searchParams.get("role"); // "ADMIN" | "GENERAL" | null
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Where条件を構築
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (companyId) {
      where.companyId = parseInt(companyId);
    }

    if (isActive === "true") {
      where.isActive = true;
    } else if (isActive === "false") {
      where.isActive = false;
    }

    if (role) {
      where.role = role;
    }

    // 総件数取得
    const total = await prisma.member.count({ where });

    // メンバー一覧取得
    const members = await prisma.member.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            prefecture: true,
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      members,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to get members:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to get members" },
      { status: 500 }
    );
  }
}
