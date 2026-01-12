"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import NextImage from "next/image";

interface CaseImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
}

interface Props {
  caseId: number;
  images: CaseImage[];
  onUpdate: () => void;
}

export default function ImageUploader({ caseId, images, onUpdate }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // サイズチェック (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("ファイルサイズは5MB以下にしてください");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/member/cases/${caseId}/images`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      onUpdate();
    } catch (error) {
      alert("アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: number) => {
    if (!confirm("削除しますか？")) return;

    try {
      const res = await fetch(
        `/api/member/cases/${caseId}/images?imageId=${imageId}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Delete failed");
      onUpdate();
    } catch (error) {
      alert("削除に失敗しました");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">画像ギャラリー</h3>

      {/* 画像一覧 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {images.map((img) => (
          <div key={img.id} className="relative group h-32">
            <NextImage
              src={img.imageUrl}
              alt=""
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <button
              onClick={() => handleDelete(img.id)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* アップロードボタン */}
      <label className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition cursor-pointer">
        {uploading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            アップロード中...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            画像を追加
          </>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
      <p className="text-xs text-gray-500 mt-2 text-center">
        JPEG, PNG, WebP対応（最大5MB）
      </p>
    </div>
  );
}
