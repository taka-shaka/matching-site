// src/app/api/member/inquiries/[id]/reply/route.ts
// Member 問い合わせ返信API

import { NextRequest, NextResponse } from "next/server";
import { requireMember } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { member } = await requireMember();
    const { id } = await params;
    const body = await request.json();

    // バリデーション
    if (!body.message || body.message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

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

    // トランザクションで返信作成とステータス更新を実行
    const result = await prisma.$transaction(async (tx) => {
      // 返信を作成
      const response = await tx.inquiryResponse.create({
        data: {
          inquiryId: parseInt(id),
          sender: "COMPANY",
          senderName: member.name,
          message: body.message.trim(),
        },
      });

      // 問い合わせのステータスを更新
      const updateData: any = {
        updatedAt: new Date(),
      };

      // 初回返信の場合
      if (!inquiry.respondedAt) {
        updateData.respondedAt = new Date();
      }

      // ステータスがNEWの場合はIN_PROGRESSに変更
      if (inquiry.status === "NEW") {
        updateData.status = "IN_PROGRESS";
      }

      const updatedInquiry = await tx.inquiry.update({
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

      return { response, inquiry: updatedInquiry };
    });

    return NextResponse.json(
      { success: true, response: result.response, inquiry: result.inquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to send reply:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to send reply" },
      { status: 500 }
    );
  }
}
