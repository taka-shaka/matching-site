// src/app/api/admin/companies/route.ts
// Admin 工務店管理一覧取得API

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;

    // フィルター条件
    const search = searchParams.get("search");
    const isPublished = searchParams.get("isPublished"); // "true" | "false" | null
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Where条件を構築
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isPublished === "true") {
      where.isPublished = true;
    } else if (isPublished === "false") {
      where.isPublished = false;
    }

    // 総件数取得
    const total = await prisma.company.count({ where });

    // 工務店一覧取得
    const companies = await prisma.company.findMany({
      where,
      include: {
        _count: {
          select: {
            members: true,
            cases: {
              where: {
                status: "PUBLISHED",
              },
            },
            inquiries: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // レスポンス用にデータを整形
    const formattedCompanies = companies.map((company) => ({
      id: company.id,
      name: company.name,
      description: company.description,
      address: company.address,
      prefecture: company.prefecture,
      city: company.city,
      phoneNumber: company.phoneNumber,
      email: company.email,
      websiteUrl: company.websiteUrl,
      logoUrl: company.logoUrl,
      isPublished: company.isPublished,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      memberCount: company._count.members,
      caseCount: company._count.cases,
      inquiryCount: company._count.inquiries,
    }));

    return NextResponse.json({
      companies: formattedCompanies,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to get companies:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to get companies" },
      { status: 500 }
    );
  }
}
