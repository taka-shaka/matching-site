// src/app/api/admin/companies/[id]/route.ts
// Admin 工務店詳細取得・更新API

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
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        },
        cases: {
          select: {
            id: true,
            title: true,
            status: true,
            publishedAt: true,
            viewCount: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        inquiries: {
          select: {
            id: true,
            inquirerName: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
        _count: {
          select: {
            members: true,
            cases: true,
            inquiries: true,
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({ company });
  } catch (error) {
    console.error("Failed to get company detail:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to get company detail" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    // 工務店が存在するか確認
    const existingCompany = await prisma.company.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCompany) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // 更新データを構築
    const updateData: any = {};

    if (body.name !== undefined) {
      if (body.name.trim() === "") {
        return NextResponse.json(
          { error: "Company name cannot be empty" },
          { status: 400 }
        );
      }
      updateData.name = body.name.trim();
    }

    if (body.description !== undefined) {
      updateData.description = body.description || null;
    }

    if (body.address !== undefined) {
      if (body.address.trim() === "") {
        return NextResponse.json(
          { error: "Address cannot be empty" },
          { status: 400 }
        );
      }
      updateData.address = body.address.trim();
    }

    if (body.prefecture !== undefined) {
      updateData.prefecture = body.prefecture;
    }

    if (body.city !== undefined) {
      updateData.city = body.city;
    }

    if (body.phoneNumber !== undefined) {
      if (body.phoneNumber && !/^[0-9-]+$/.test(body.phoneNumber)) {
        return NextResponse.json(
          { error: "Invalid phone number format" },
          { status: 400 }
        );
      }
      updateData.phoneNumber = body.phoneNumber;
    }

    if (body.email !== undefined) {
      if (body.email.trim() === "") {
        return NextResponse.json(
          { error: "Email cannot be empty" },
          { status: 400 }
        );
      }
      // メールアドレスの基本的なバリデーション
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }

      // 他の会社で同じメールアドレスが使われていないかチェック
      const duplicateCompany = await prisma.company.findFirst({
        where: {
          email: body.email,
          id: {
            not: parseInt(id),
          },
        },
      });

      if (duplicateCompany) {
        return NextResponse.json(
          { error: "Email address is already in use" },
          { status: 400 }
        );
      }

      updateData.email = body.email.trim();
    }

    if (body.websiteUrl !== undefined) {
      updateData.websiteUrl = body.websiteUrl || null;
    }

    if (body.logoUrl !== undefined) {
      updateData.logoUrl = body.logoUrl || null;
    }

    if (body.isPublished !== undefined) {
      updateData.isPublished = Boolean(body.isPublished);
    }

    // 工務店情報を更新
    const updatedCompany = await prisma.company.update({
      where: { id: parseInt(id) },
      data: updateData,
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
        _count: {
          select: {
            members: true,
            cases: true,
            inquiries: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, company: updatedCompany });
  } catch (error) {
    console.error("Failed to update company:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to update company" },
      { status: 500 }
    );
  }
}
