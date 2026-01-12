// src/app/api/admin/general-inquiries/[id]/route.ts
// 管理者用一般問い合わせ詳細取得・更新API

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

    // 問い合わせ詳細を取得
    const inquiry = await prisma.generalInquiry.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        responses: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ inquiry });
  } catch (error) {
    console.error("Failed to get general inquiry detail:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to get general inquiry detail" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    // 更新データを準備
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.status) {
      updateData.status = body.status;
    }

    if (body.internalNotes !== undefined) {
      updateData.internalNotes = body.internalNotes;
    }

    // 問い合わせを更新
    const inquiry = await prisma.generalInquiry.update({
      where: {
        id: parseInt(id),
      },
      data: updateData,
      include: {
        responses: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error("Failed to update general inquiry:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to update general inquiry" },
      { status: 500 }
    );
  }
}
