// src/app/api/admin/general-inquiries/[id]/reply/route.ts
// 管理者用一般問い合わせ返信API

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { createInquiryReplyEmail } from "@/lib/email-templates";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { admin } = await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    // バリデーション
    if (!body.message || body.message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // 問い合わせが存在するか確認
    const inquiry = await prisma.generalInquiry.findUnique({
      where: { id: parseInt(id) },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // トランザクションで返信作成とステータス更新を実行
    const result = await prisma.$transaction(async (tx) => {
      // 返信を作成
      const response = await tx.generalInquiryResponse.create({
        data: {
          inquiryId: parseInt(id),
          sender: "ADMIN",
          senderName: admin.name,
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

      const updatedInquiry = await tx.generalInquiry.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
          responses: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      return { response, inquiry: updatedInquiry };
    });

    // メール送信（非同期で実行、エラーでもAPIは成功）
    try {
      const emailTemplate = createInquiryReplyEmail({
        inquirerName: inquiry.inquirerName,
        inquiryMessage: inquiry.message,
        replyMessage: body.message.trim(),
        adminName: admin.name,
      });

      await sendEmail({
        to: inquiry.inquirerEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });

      console.log(`✅ Reply email sent to ${inquiry.inquirerEmail}`);
    } catch (emailError) {
      // メール送信エラーはログのみで、API自体は成功を返す
      console.error("Failed to send reply email:", emailError);
      console.warn("⚠️  Reply was saved but email notification failed");
    }

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
