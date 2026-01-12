// src/app/api/member/inquiries/route.ts
// Member 問い合わせ一覧取得API

import { NextRequest, NextResponse } from "next/server";
import { requireMember } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { member } = await requireMember();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status"); // NEW, IN_PROGRESS, RESOLVED, CLOSED

    // Where条件を構築
    const where: any = {
      companyId: member.companyId, // 自社の問い合わせのみ
    };

    if (status) {
      where.status = status;
    }

    // 問い合わせ一覧を取得
    const inquiries = await prisma.inquiry.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("Failed to get member inquiries:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to get inquiries" },
      { status: 500 }
    );
  }
}
