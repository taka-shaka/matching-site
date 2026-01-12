// src/app/api/admin/customers/[id]/route.ts
// Admin 顧客詳細取得・削除API

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { createSupabaseAdminClient } from "@/lib/supabase";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;

    // 顧客詳細を取得
    const customer = await prisma.customer.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        inquiries: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
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
        },
        _count: {
          select: {
            inquiries: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // 顧客のメールアドレスで管理者への問い合わせを取得
    const generalInquiries = await prisma.generalInquiry.findMany({
      where: {
        inquirerEmail: customer.email,
      },
      include: {
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

    return NextResponse.json({ customer, generalInquiries });
  } catch (error) {
    console.error("Failed to get customer detail:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to get customer detail" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    // 顧客が存在するか確認
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // 更新データを構築
    const updateData: any = {};

    if (body.isActive !== undefined) {
      updateData.isActive = body.isActive;
    }

    // 顧客情報を更新
    const updatedCustomer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        _count: {
          select: {
            inquiries: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, customer: updatedCustomer });
  } catch (error) {
    console.error("Failed to update customer:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "顧客情報の更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;

    // 顧客が存在するか確認
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            inquiries: true,
          },
        },
      },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // 削除前の確認情報を取得
    const deletionInfo = {
      customerId: existingCustomer.id,
      customerName: `${existingCustomer.lastName} ${existingCustomer.firstName}`,
      customerEmail: existingCustomer.email,
      inquiryCount: existingCustomer._count.inquiries,
      authId: existingCustomer.authId,
    };

    // Supabase Authからユーザーを削除
    const supabase = createSupabaseAdminClient();
    const { error: authError } = await supabase.auth.admin.deleteUser(
      existingCustomer.authId
    );

    if (authError) {
      console.error("Failed to delete user from Supabase Auth:", authError);
      return NextResponse.json(
        { error: "認証システムからユーザーの削除に失敗しました" },
        { status: 500 }
      );
    }

    // データベースから顧客を削除（CASCADE設定により関連データも自動削除）
    // Inquiriesなどが連鎖削除される
    await prisma.customer.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully",
      deletionInfo,
    });
  } catch (error) {
    console.error("Failed to delete customer:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "顧客の削除に失敗しました" },
      { status: 500 }
    );
  }
}
