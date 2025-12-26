// src/app/api/member/inquiries/[id]/route.ts
// Member 問い合わせ詳細取得・ステータス更新API

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

    // 問い合わせ詳細を取得
    const inquiry = await prisma.inquiry.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        customer: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
            email: true,
            phoneNumber: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            address: true,
            phoneNumber: true,
            email: true,
          },
        },
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

    // 自社の問い合わせかチェック
    if (inquiry.companyId !== member.companyId) {
      return NextResponse.json(
        { error: "Unauthorized access to this inquiry" },
        { status: 403 }
      );
    }

    return NextResponse.json({ inquiry });
  } catch (error) {
    console.error("Failed to get inquiry detail:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to get inquiry detail" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { member } = await requireMember();
    const { id } = await params;
    const body = await request.json();

    // 問い合わせが存在し、自社のものか確認
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: parseInt(id) },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    if (inquiry.companyId !== member.companyId) {
      return NextResponse.json(
        { error: "Unauthorized access to this inquiry" },
        { status: 403 }
      );
    }

    // 更新データを構築
    const updateData: any = {};

    if (body.status) {
      // ステータスのバリデーション
      const validStatuses = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 }
        );
      }
      updateData.status = body.status;

      // RESOLVEDまたはCLOSEDに変更する場合、respondedAtを設定
      if (
        (body.status === "RESOLVED" || body.status === "CLOSED") &&
        !inquiry.respondedAt
      ) {
        updateData.respondedAt = new Date();
      }
    }

    if (body.internalNotes !== undefined) {
      updateData.internalNotes = body.internalNotes;
    }

    // 問い合わせを更新
    const updatedInquiry = await prisma.inquiry.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
            email: true,
            phoneNumber: true,
          },
        },
        responses: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json({ success: true, inquiry: updatedInquiry });
  } catch (error) {
    console.error("Failed to update inquiry:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}
