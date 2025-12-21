import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // 問い合わせを作成
    const inquiry = await prisma.inquiry.create({
      data: {
        companyId: parseInt(body.companyId),
        customerId: body.customerId ? parseInt(body.customerId) : null,
        inquirerName: body.inquirerName,
        inquirerEmail: body.inquirerEmail,
        inquirerPhone: body.inquirerPhone,
        message: body.message,
        status: "NEW",
      },
    });

    return NextResponse.json(
      {
        success: true,
        inquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create inquiry:", error);
    return NextResponse.json(
      { error: "Failed to create inquiry" },
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
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
