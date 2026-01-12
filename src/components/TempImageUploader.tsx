// src/components/TempImageUploader.tsx
// 一時画像アップロードコンポーネント（ケース作成前の画像アップロード用）

"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface TempImageUploaderProps {
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
  currentImageUrl?: string;
  label?: string;
  description?: string;
}

export default function TempImageUploader({
  onUploadComplete,
  onRemove,
  currentImageUrl,
  label = "画像をアップロード",
  description = "クリックまたはドラッグ&ドロップで画像をアップロード",
}: TempImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  async function handleFileSelect(file: File) {
    // ファイルタイプのバリデーション
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("JPEG、PNG、WebP形式の画像のみアップロード可能です");
      return;
    }

    // ファイルサイズのバリデーション（10MB）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("ファイルサイズは10MB以下にしてください");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/temp-images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "アップロードに失敗しました");
      }

      const data = await response.json();
      onUploadComplete(data.url);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err instanceof Error ? err.message : "画像のアップロードに失敗しました"
      );
    } finally {
      setIsUploading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }

  if (currentImageUrl) {
    return (
      <div className="relative">
        <img
          src={currentImageUrl}
          alt="アップロード済み画像"
          className="w-full h-64 object-cover rounded-xl"
        />
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-lg"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label}
      </label>
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-500"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!isUploading) {
            document.getElementById("file-input")?.click();
          }
        }}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-600">アップロード中...</p>
          </div>
        ) : (
          <>
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">{description}</p>
            <p className="text-xs text-gray-500">
              推奨サイズ: 1200 x 800px (JPEG, PNG, WebP / 最大10MB)
            </p>
          </>
        )}
        <input
          id="file-input"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleChange}
          disabled={isUploading}
          className="hidden"
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
          <X className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}
