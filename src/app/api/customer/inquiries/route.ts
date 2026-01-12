// src/app/api/customer/inquiries/route.ts
// Customer 問い合わせ一覧取得API

import { NextRequest, NextResponse } from "next/server";
import { requireCustomer } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { customer } = await requireCustomer();

    // 顧客の問い合わせ一覧を取得
    const inquiries = await prisma.inquiry.findMany({
      where: {
        customerId: customer.id,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            prefecture: true,
            city: true,
            logoUrl: true,
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
    console.error("Failed to get customer inquiries:", error);

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
