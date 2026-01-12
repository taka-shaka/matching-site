// src/app/api/auth/me/route.ts
// 現在ログイン中のユーザー情報を取得するAPI

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getUserType } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 現在のユーザーを取得
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const userType = getUserType(user);

    // ユーザータイプに応じて詳細情報を取得
    let userData = null;

    switch (userType) {
      case "admin":
        userData = await prisma.admin.findUnique({
          where: { authId: user.id },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            lastLoginAt: true,
            createdAt: true,
          },
        });
        break;

      case "member":
        userData = await prisma.member.findUnique({
          where: { authId: user.id },
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
          },
        });
        break;

      case "customer":
        userData = await prisma.customer.findUnique({
          where: { authId: user.id },
          select: {
            id: true,
            email: true,
            lastName: true,
            firstName: true,
            phoneNumber: true,
            isActive: true,
            lastLoginAt: true,
            createdAt: true,
          },
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid user type" },
          { status: 400 }
        );
    }

    if (!userData) {
      return NextResponse.json(
        { error: "User data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        authId: user.id,
        userType,
        ...userData,
        email: user.email, // Override with Supabase email to ensure consistency
      },
    });
  } catch (error) {
    console.error("Failed to get current user:", error);
    return NextResponse.json(
      { error: "Failed to get current user" },
      { status: 500 }
    );
  }
}
