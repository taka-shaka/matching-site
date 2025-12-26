// src/app/api/member/cases/route.ts
// Member 施工事例一覧取得・新規作成API

import { NextRequest, NextResponse } from "next/server";
import { requireMember } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { member } = await requireMember();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status"); // DRAFT, PUBLISHED
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Where条件を構築
    const where: any = {
      companyId: member.companyId, // 自社の施工事例のみ
    };

    if (status) {
      where.status = status;
    }

    // 総件数取得
    const total = await prisma.constructionCase.count({ where });

    // 施工事例一覧を取得
    const cases = await prisma.constructionCase.findMany({
      where,
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
      orderBy: {
        updatedAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      cases,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to get member cases:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Failed to get cases" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { member } = await requireMember();
    const body = await request.json();

    // バリデーション
    if (!body.title || body.title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!body.description || body.description.trim() === "") {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    if (!body.prefecture || !body.city) {
      return NextResponse.json(
        { error: "Prefecture and city are required" },
        { status: 400 }
      );
    }

    // 施工事例を作成
    const newCase = await prisma.constructionCase.create({
      data: {
        companyId: member.companyId, // 自動的に自社IDをセット
        authorId: member.id, // 作成者をセット
        title: body.title.trim(),
        description: body.description.trim(),
        prefecture: body.prefecture,
        city: body.city,
        buildingArea: body.buildingArea ? parseFloat(body.buildingArea) : null,
        budget: body.budget ? parseInt(body.budget) : null,
        completionYear: body.completionYear
          ? parseInt(body.completionYear)
          : null,
        mainImageUrl: body.mainImageUrl || null,
        status: "DRAFT", // 初期状態は下書き
      },
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

    return NextResponse.json({ success: true, case: newCase }, { status: 201 });
  } catch (error) {
    console.error("Failed to create case:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to create case" },
      { status: 500 }
    );
  }
}
