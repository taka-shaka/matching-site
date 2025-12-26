// src/app/api/customer/profile/route.ts
// Customer プロフィール取得・更新API

import { NextRequest, NextResponse } from "next/server";
import { requireCustomer } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

// プロフィール取得
export async function GET(request: NextRequest) {
  try {
    const { customer } = await requireCustomer();

    return NextResponse.json({ customer });
  } catch (error) {
    console.error("Failed to get customer profile:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// プロフィール更新
export async function PATCH(request: NextRequest) {
  try {
    const { customer } = await requireCustomer();
    const body = await request.json();

    // バリデーション
    const updateData: any = {};

    if (body.lastName !== undefined) {
      updateData.lastName = body.lastName.trim() || null;
    }

    if (body.firstName !== undefined) {
      updateData.firstName = body.firstName.trim() || null;
    }

    if (body.phoneNumber !== undefined) {
      // 電話番号のフォーマットチェック（オプション）
      if (body.phoneNumber && !/^[0-9-]+$/.test(body.phoneNumber)) {
        return NextResponse.json(
          { error: "Invalid phone number format" },
          { status: 400 }
        );
      }
      updateData.phoneNumber = body.phoneNumber.trim() || null;
    }

    if (body.email !== undefined) {
      // メールアドレスのバリデーション
      if (!body.email || !body.email.includes("@")) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        );
      }

      // メールアドレスが既に使用されていないかチェック
      const existingCustomer = await prisma.customer.findUnique({
        where: { email: body.email },
      });

      if (existingCustomer && existingCustomer.id !== customer.id) {
        return NextResponse.json(
          { error: "Email address already in use" },
          { status: 400 }
        );
      }

      updateData.email = body.email.trim();
    }

    // データベース更新
    const updatedCustomer = await prisma.customer.update({
      where: { id: customer.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        lastName: true,
        firstName: true,
        phoneNumber: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      customer: updatedCustomer,
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
