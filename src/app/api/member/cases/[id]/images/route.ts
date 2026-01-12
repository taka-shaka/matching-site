// 施工事例画像アップロード・削除API
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase";

// 画像アップロード
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caseId = parseInt(id);
    const supabase = await createSupabaseServerClient();

    // 認証チェック
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || user.app_metadata?.user_type !== "member") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 施工事例の所有確認
    const caseData = await prisma.constructionCase.findUnique({
      where: { id: caseId },
      include: { company: { include: { members: true } } },
    });

    if (
      !caseData ||
      !caseData.company.members.some((m) => m.authId === user.id)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    // ファイル名生成
    const timestamp = Date.now();
    const filename = `${caseId}/${timestamp}_${file.name}`;

    // Supabase Storageにアップロード
    const { data, error } = await supabase.storage
      .from("construction-cases")
      .upload(filename, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw error;

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from("construction-cases").getPublicUrl(filename);

    // DBに保存
    const image = await prisma.constructionCaseImage.create({
      data: {
        caseId,
        imageUrl: publicUrl,
        displayOrder: 0,
      },
    });

    return NextResponse.json({ image });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// 画像削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json({ error: "Missing imageId" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.app_metadata?.user_type !== "member") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 画像情報取得
    const image = await prisma.constructionCaseImage.findUnique({
      where: { id: parseInt(imageId) },
      include: {
        case: {
          include: { company: { include: { members: true } } },
        },
      },
    });

    if (
      !image ||
      !image.case.company.members.some((m) => m.authId === user.id)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Storageから削除
    const filepath = image.imageUrl.split("/construction-cases/")[1];
    await supabase.storage.from("construction-cases").remove([filepath]);

    // DBから削除
    await prisma.constructionCaseImage.delete({
      where: { id: parseInt(imageId) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
