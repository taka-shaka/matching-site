// src/app/api/admin/members/[id]/route.ts
// Admin メンバー詳細取得・更新・削除API

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;

    // メンバー詳細を取得
    const member = await prisma.member.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            prefecture: true,
            city: true,
            phoneNumber: true,
            email: true,
          },
        },
        cases: {
          select: {
            id: true,
            title: true,
            status: true,
            publishedAt: true,
            viewCount: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            cases: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ member });
  } catch (error) {
    console.error("Failed to get member detail:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to get member detail" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    // メンバーが存在するか確認
    const existingMember = await prisma.member.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // 更新データを構築
    const updateData: any = {};

    if (body.name !== undefined) {
      if (body.name.trim() === "") {
        return NextResponse.json(
          { error: "名前を入力してください" },
          { status: 400 }
        );
      }
      updateData.name = body.name.trim();
    }

    if (body.email !== undefined) {
      if (body.email.trim() === "") {
        return NextResponse.json(
          { error: "メールアドレスを入力してください" },
          { status: 400 }
        );
      }

      // メールアドレスの基本的なバリデーション
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        return NextResponse.json(
          { error: "有効なメールアドレスを入力してください" },
          { status: 400 }
        );
      }

      // 他のメンバーで同じメールアドレスが使われていないかチェック
      const duplicateMember = await prisma.member.findFirst({
        where: {
          email: body.email,
          id: {
            not: parseInt(id),
          },
        },
      });

      if (duplicateMember) {
        return NextResponse.json(
          { error: "このメールアドレスは既に使用されています" },
          { status: 400 }
        );
      }

      updateData.email = body.email.trim();
    }

    if (body.role !== undefined) {
      // 役割のバリデーション
      if (body.role !== "ADMIN" && body.role !== "GENERAL") {
        return NextResponse.json(
          { error: "無効な役割が指定されました" },
          { status: 400 }
        );
      }
      updateData.role = body.role;
    }

    if (body.companyId !== undefined) {
      // 工務店の存在確認
      const company = await prisma.company.findUnique({
        where: { id: body.companyId },
      });

      if (!company) {
        return NextResponse.json(
          { error: "指定された工務店が見つかりません" },
          { status: 404 }
        );
      }

      updateData.companyId = body.companyId;
    }

    if (body.isActive !== undefined) {
      updateData.isActive = Boolean(body.isActive);
    }

    // メンバー情報を更新
    const updatedMember = await prisma.member.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            prefecture: true,
            city: true,
          },
        },
      },
    });

    // メールアドレスが変更された場合、Supabase Authも更新
    if (body.email && body.email !== existingMember.email) {
      try {
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

        await supabaseAdmin.auth.admin.updateUserById(existingMember.authId, {
          email: body.email,
        });
      } catch (authError) {
        console.error("Failed to update Supabase auth email:", authError);
        // Auth更新失敗してもDB更新は成功しているので警告のみ
      }
    }

    return NextResponse.json({ success: true, member: updatedMember });
  } catch (error) {
    console.error("Failed to update member:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "メンバーの更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;

    // メンバーが存在するか確認
    const existingMember = await prisma.member.findUnique({
      where: { id: parseInt(id) },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            cases: true,
          },
        },
      },
    });

    if (!existingMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // 削除前の確認情報を取得
    const deletionInfo = {
      memberId: existingMember.id,
      memberName: existingMember.name,
      memberEmail: existingMember.email,
      companyName: existingMember.company.name,
      caseCount: existingMember._count.cases,
    };

    // Supabase Authユーザーを削除
    try {
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

      await supabaseAdmin.auth.admin.deleteUser(existingMember.authId);
    } catch (authError) {
      console.error("Failed to delete Supabase auth user:", authError);
      // Authの削除に失敗してもDB削除は続行（オーファンレコード防止）
    }

    // メンバーを削除（CASCADE設定により関連データも自動削除）
    // Casesなどが連鎖削除される
    await prisma.member.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Member deleted successfully",
      deletionInfo,
    });
  } catch (error) {
    console.error("Failed to delete member:", error);

    // 認証エラーの場合
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "メンバーの削除に失敗しました" },
      { status: 500 }
    );
  }
}
