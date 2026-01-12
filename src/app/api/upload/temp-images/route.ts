// src/app/api/upload/temp-images/route.ts
// 一時画像アップロードAPI（ケース作成前の画像アップロード用）

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // 認証チェック - メンバーまたは管理者のみ許可
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userType = user.app_metadata?.user_type;
    if (userType !== "member" && userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // FormDataから画像ファイルを取得
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ファイルタイプのバリデーション
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // ファイルサイズのバリデーション（10MB制限）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // バケットの存在確認（デバッグ用）
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error("Failed to list buckets:", bucketsError);
    } else {
      console.log(
        "Available buckets:",
        buckets?.map((b) => b.name)
      );
    }

    // 一時ファイル名生成: temp/{userId}/{timestamp}_{filename}
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `temp/${user.id}/${timestamp}_${sanitizedFilename}`;

    console.log("Attempting to upload to:", filename);

    // Supabase Storageにアップロード
    const { error: uploadError } = await supabase.storage
      .from("construction-cases")
      .upload(filename, file, {
        contentType: file.type,
        upsert: false,
        cacheControl: "3600", // 1時間キャッシュ
      });

    if (uploadError) {
      console.error("Supabase Storage upload error:", uploadError);
      console.error("Error details:", JSON.stringify(uploadError, null, 2));
      return NextResponse.json(
        {
          error: "Failed to upload image to storage",
          details: uploadError.message || "Unknown error",
        },
        { status: 500 }
      );
    }

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from("construction-cases").getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
      originalName: file.name,
      size: file.size,
      contentType: file.type,
    });
  } catch (error) {
    console.error("Temporary image upload error:", error);
    return NextResponse.json(
      { error: "Internal server error during image upload" },
      { status: 500 }
    );
  }
}
