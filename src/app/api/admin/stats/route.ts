// src/app/api/admin/stats/route.ts
// Admin ダッシュボード統計取得API

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    // 今月の開始日時を取得
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 並列で統計データを取得
    const [
      totalCompanies,
      publishedCompanies,
      totalMembers,
      activeMembers,
      totalCustomers,
      totalCases,
      publishedCases,
      totalInquiries,
      newInquiries,
      newCompaniesThisMonth,
      newCasesThisMonth,
      newInquiriesThisMonth,
      totalViews,
    ] = await Promise.all([
      // 総工務店数
      prisma.company.count(),
      // 公開中の工務店数
      prisma.company.count({ where: { isPublished: true } }),
      // 総メンバー数
      prisma.member.count(),
      // アクティブなメンバー数
      prisma.member.count({ where: { isActive: true } }),
      // 総顧客数
      prisma.customer.count(),
      // 総施工事例数
      prisma.constructionCase.count(),
      // 公開中の施工事例数
      prisma.constructionCase.count({ where: { status: "PUBLISHED" } }),
      // 総問い合わせ数
      prisma.inquiry.count(),
      // 新規問い合わせ数（ステータスがNEW）
      prisma.inquiry.count({ where: { status: "NEW" } }),
      // 今月の新規工務店数
      prisma.company.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      // 今月の新規施工事例数
      prisma.constructionCase.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      // 今月の新規問い合わせ数
      prisma.inquiry.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      // 総閲覧数（全施工事例のviewCountの合計）
      prisma.constructionCase.aggregate({
        _sum: {
          viewCount: true,
        },
      }),
    ]);

    // 最近のアクティビティを取得（各種データを統合）
    const recentActivities: any[] = [];

    // 最近の工務店登録（5件）
    const recentCompanies = await prisma.company.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        prefecture: true,
        city: true,
        createdAt: true,
      },
    });

    recentCompanies.forEach((company) => {
      recentActivities.push({
        id: `company-${company.id}`,
        action: "新規工務店登録",
        performer: company.name,
        details: `${company.prefecture}${company.city}の工務店が新規登録されました`,
        createdAt: company.createdAt,
        type: "company",
      });
    });

    // 最近の施工事例公開（5件）
    const recentCases = await prisma.constructionCase.findMany({
      where: { status: "PUBLISHED" },
      take: 5,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        publishedAt: true,
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    recentCases.forEach((caseItem) => {
      if (caseItem.publishedAt) {
        recentActivities.push({
          id: `case-${caseItem.id}`,
          action: "施工事例公開",
          performer: caseItem.company.name,
          details: caseItem.title,
          createdAt: caseItem.publishedAt,
          type: "case",
        });
      }
    });

    // 最近の問い合わせ（5件）
    const recentInquiries = await prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        inquirerName: true,
        message: true,
        createdAt: true,
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    recentInquiries.forEach((inquiry) => {
      recentActivities.push({
        id: `inquiry-${inquiry.id}`,
        action: "新規問い合わせ",
        performer: `顧客: ${inquiry.inquirerName}`,
        details: inquiry.message.slice(0, 50) + "...",
        createdAt: inquiry.createdAt,
        type: "inquiry",
      });
    });

    // 最近のメンバー追加（5件）
    const recentMembers = await prisma.member.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    recentMembers.forEach((member) => {
      recentActivities.push({
        id: `member-${member.id}`,
        action: "メンバー追加",
        performer: member.company.name,
        details: `新しい担当者（${member.name}）が追加されました`,
        createdAt: member.createdAt,
        type: "member",
      });
    });

    // アクティビティを日時順にソートして最新15件を取得
    const sortedActivities = recentActivities
      .sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
      .slice(0, 15);

    return NextResponse.json({
      stats: {
        totalCompanies,
        publishedCompanies,
        totalMembers,
        activeMembers,
        totalCustomers,
        totalCases,
        publishedCases,
        totalInquiries,
        newInquiries,
      },
      monthlyStats: {
        newCompanies: newCompaniesThisMonth,
        newCases: newCasesThisMonth,
        newInquiries: newInquiriesThisMonth,
        totalViews: totalViews._sum.viewCount || 0,
      },
      recentActivity: sortedActivities,
    });
  } catch (error) {
    console.error("Failed to get admin stats:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
  }
}
