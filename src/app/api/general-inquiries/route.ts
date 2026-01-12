// src/app/api/general-inquiries/route.ts
// 一般問い合わせ送信API（認証不要）

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "お名前は必須です" }, { status: 400 });
    }

    if (!body.email || !body.email.trim()) {
      return NextResponse.json(
        { error: "メールアドレスは必須です" },
        { status: 400 }
      );
    }

    // メールアドレスの簡易バリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "有効なメールアドレスを入力してください" },
        { status: 400 }
      );
    }

    if (!body.message || !body.message.trim()) {
      return NextResponse.json(
        { error: "メッセージは必須です" },
        { status: 400 }
      );
    }

    // 問い合わせを作成
    const inquiry = await prisma.generalInquiry.create({
      data: {
        inquirerName: body.name.trim(),
        inquirerEmail: body.email.trim(),
        inquirerPhone: body.phone?.trim() || null,
        message: body.message.trim(),
        status: "NEW",
      },
    });

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error) {
    console.error("Failed to create general inquiry:", error);
    return NextResponse.json(
      { error: "問い合わせの送信に失敗しました" },
      { status: 500 }
    );
  }
}
