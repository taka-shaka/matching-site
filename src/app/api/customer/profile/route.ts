// src/app/api/customer/profile/route.ts
// Customer プロフィール取得・更新API

import { NextRequest, NextResponse } from "next/server";
import { requireCustomer } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

// プロフィール取得
export async function GET() {
  try {
    const { customer } = await requireCustomer();

    return NextResponse.json({
      customer: {
        id: customer.id,
        email: customer.email,
        lastName: customer.lastName,
        firstName: customer.firstName,
        phoneNumber: customer.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Failed to get customer profile:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to get profile" },
      { status: 500 }
    );
  }
}

// プロフィール更新
export async function PUT(request: NextRequest) {
  try {
    const { customer } = await requireCustomer();
    const body = await request.json();

    // バリデーション
    if (!body.lastName?.trim() || !body.firstName?.trim()) {
      return NextResponse.json({ error: "姓と名は必須です" }, { status: 400 });
    }

    // 電話番号のバリデーション（入力されている場合のみ）
    if (body.phoneNumber && !/^[0-9-]+$/.test(body.phoneNumber)) {
      return NextResponse.json(
        { error: "電話番号の形式が正しくありません" },
        { status: 400 }
      );
    }

    // プロフィール更新
    const updatedCustomer = await prisma.customer.update({
      where: { id: customer.id },
      data: {
        lastName: body.lastName.trim(),
        firstName: body.firstName.trim(),
        phoneNumber: body.phoneNumber?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "プロフィールを更新しました",
      customer: {
        id: updatedCustomer.id,
        email: updatedCustomer.email,
        lastName: updatedCustomer.lastName,
        firstName: updatedCustomer.firstName,
        phoneNumber: updatedCustomer.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Failed to update customer profile:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
