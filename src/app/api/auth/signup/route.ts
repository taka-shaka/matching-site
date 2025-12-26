// src/app/api/auth/signup/route.ts
// Customer新規登録API

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

// Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (body.password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // 1. Supabase Authでユーザーを作成
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: body.email,
        password: body.password,
        email_confirm: false, // メール認証必要
        app_metadata: {
          user_type: "customer",
        },
        user_metadata: {
          full_name:
            body.lastName && body.firstName
              ? `${body.lastName} ${body.firstName}`
              : undefined,
        },
      });

    if (authError) {
      console.error("Supabase Auth error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create auth user" },
        { status: 500 }
      );
    }

    // 2. Prismaデータベースにcustomerレコードを作成
    try {
      const customer = await prisma.customer.create({
        data: {
          authId: authData.user.id,
          email: body.email,
          lastName: body.lastName || null,
          firstName: body.firstName || null,
          phoneNumber: body.phoneNumber || null,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message:
            "Registration successful. Please check your email to confirm your account.",
          customer: {
            id: customer.id,
            email: customer.email,
            lastName: customer.lastName,
            firstName: customer.firstName,
          },
        },
        { status: 201 }
      );
    } catch (dbError) {
      // データベースエラーの場合、Supabase Authのユーザーも削除
      console.error("Database error:", dbError);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

      return NextResponse.json(
        { error: "Failed to create customer record" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
