// src/app/api/member/dashboard/route.ts
// Member ダッシュボードデータ取得API

import { NextResponse } from "next/server";
import { requireMember } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { member } = await requireMember();

    // 工務店情報を取得
    const company = await prisma.company.findUnique({
      where: { id: member.companyId },
      select: {
        id: true,
        name: true,
        prefecture: true,
        city: true,
        logoUrl: true,
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // 施工事例の統計を取得
    const allCases = await prisma.constructionCase.findMany({
      where: {
        companyId: member.companyId,
      },
      select: {
        id: true,
        status: true,
        viewCount: true,
      },
    });

    const caseStats = {
      total: allCases.length,
      published: allCases.filter((c) => c.status === "PUBLISHED").length,
      draft: allCases.filter((c) => c.status === "DRAFT").length,
      totalViews: allCases.reduce((sum, c) => sum + c.viewCount, 0),
    };

    // 問い合わせの統計を取得
    const allInquiries = await prisma.inquiry.findMany({
      where: {
        companyId: member.companyId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    const inquiryStats = {
      total: allInquiries.length,
      new: allInquiries.filter((i) => i.status === "NEW").length,
      inProgress: allInquiries.filter((i) => i.status === "IN_PROGRESS").length,
      resolved: allInquiries.filter((i) => i.status === "RESOLVED").length,
    };

    // 最近の施工事例を取得（5件）
    const recentCases = await prisma.constructionCase.findMany({
      where: {
        companyId: member.companyId,
      },
      select: {
        id: true,
        title: true,
        status: true,
        viewCount: true,
        publishedAt: true,
        mainImageUrl: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    // 最近の問い合わせを取得（5件）
    const recentInquiries = await prisma.inquiry.findMany({
      where: {
        companyId: member.companyId,
      },
      select: {
        id: true,
        inquirerName: true,
        message: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return NextResponse.json({
      member: {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
      },
      company,
      stats: {
        cases: caseStats,
        inquiries: inquiryStats,
      },
      recentCases,
      recentInquiries,
    });
  } catch (error) {
    console.error("Failed to get member dashboard data:", error);

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
