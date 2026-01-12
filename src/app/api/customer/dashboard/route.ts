// src/app/api/customer/dashboard/route.ts
// Customer ダッシュボードデータ取得API

import { NextResponse } from "next/server";
import { requireCustomer } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { customer } = await requireCustomer();

    // 問い合わせ一覧を取得（最新5件）
    const recentInquiries = await prisma.inquiry.findMany({
      where: {
        customerId: customer.id,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    // 問い合わせ統計を計算
    const allInquiries = await prisma.inquiry.findMany({
      where: {
        customerId: customer.id,
      },
      select: {
        status: true,
      },
    });

    const stats = {
      total: allInquiries.length,
      new: allInquiries.filter((i) => i.status === "NEW").length,
      inProgress: allInquiries.filter((i) => i.status === "IN_PROGRESS").length,
      resolved: allInquiries.filter((i) => i.status === "RESOLVED").length,
      closed: allInquiries.filter((i) => i.status === "CLOSED").length,
    };

    // おすすめ施工事例を取得（最新8件の公開済み事例）
    const recommendedCases = await prisma.constructionCase.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          not: null,
        },
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 8,
    });

    return NextResponse.json({
      customer: {
        id: customer.id,
        email: customer.email,
        lastName: customer.lastName,
        firstName: customer.firstName,
        phoneNumber: customer.phoneNumber,
      },
      stats,
      recentInquiries,
      recommendedCases,
    });
  } catch (error) {
    console.error("Failed to get customer dashboard data:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to get dashboard data" },
      { status: 500 }
    );
  }
}
