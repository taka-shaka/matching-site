// src/app/api/customer/inquiries/[id]/route.ts
// Customer 問い合わせ詳細取得API

import { NextRequest, NextResponse } from "next/server";
import { requireCustomer } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { customer } = await requireCustomer();
    const { id } = await params;

    // 問い合わせ詳細を取得
    const inquiry = await prisma.inquiry.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            address: true,
            prefecture: true,
            city: true,
            phoneNumber: true,
            email: true,
            websiteUrl: true,
            logoUrl: true,
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

    // 自分の問い合わせかチェック
    if (inquiry.customerId !== customer.id) {
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
