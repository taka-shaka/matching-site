// src/app/api/inquiries/route.ts
// 問い合わせ作成API（非ログインユーザー・ログインユーザー対応）

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    if (
      !body.companyId ||
      !body.inquirerName ||
      !body.inquirerEmail ||
      !body.message
    ) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    // メールアドレスの簡易バリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.inquirerEmail)) {
      return NextResponse.json(
        { error: "有効なメールアドレスを入力してください" },
        { status: 400 }
      );
    }

    // 工務店の存在確認
    const company = await prisma.company.findUnique({
      where: { id: parseInt(body.companyId) },
    });

    if (!company) {
      return NextResponse.json(
        { error: "指定された工務店が見つかりません" },
        { status: 404 }
      );
    }

    // ログインユーザーの場合、customerIdを自動取得
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let customerId = null;
    if (user) {
      const customer = await prisma.customer.findUnique({
        where: { authId: user.id },
      });
      customerId = customer?.id || null;
    }

    // 問い合わせを作成
    const inquiry = await prisma.inquiry.create({
      data: {
        companyId: parseInt(body.companyId),
        customerId,
        inquirerName: body.inquirerName,
        inquirerEmail: body.inquirerEmail,
        inquirerPhone: body.inquirerPhone || null,
        message: body.message,
        status: "NEW",
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "問い合わせを送信しました",
        inquiry: {
          id: inquiry.id,
          inquirerName: inquiry.inquirerName,
          inquirerEmail: inquiry.inquirerEmail,
          company: inquiry.company,
          createdAt: inquiry.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("問い合わせ作成エラー:", error);
    return NextResponse.json(
      { error: "問い合わせの送信に失敗しました" },
      { status: 500 }
    );
  }
}

// 問い合わせ一覧取得（管理者・工務店用）
export async function GET(request: NextRequest) {
  try {
    // ここでは認証チェックを省略
    // 実際には requireMember() などで認証する

    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get("companyId");

    const inquiries = await prisma.inquiry.findMany({
      where: companyId ? { companyId: parseInt(companyId) } : {},
      include: {
        company: {
          select: { id: true, name: true },
        },
        customer: {
          select: { id: true, lastName: true, firstName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ inquiries });
  } catch {
    return NextResponse.json(
      { error: "問い合わせの取得に失敗しました" },
      { status: 500 }
    );
  }
}
