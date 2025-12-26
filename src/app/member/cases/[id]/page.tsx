// src/app/member/cases/[id]/page.tsx
// メンバー（工務店）施工事例詳細プレビューページ（UI実装 - モックデータ使用）

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Ruler,
  TrendingUp,
  Building2,
} from "lucide-react";
import MemberSidebar from "@/components/member/MemberSidebar";

// モックデータ
const MOCK_MEMBER = {
  id: 1,
  name: "山田太郎",
  email: "yamada@nagoya-home.co.jp",
  role: "ADMIN",
  company: {
    id: 1,
    name: "株式会社ナゴヤホーム",
    prefecture: "愛知県",
    city: "名古屋市中区",
    logoUrl: "https://placehold.co/120x120/f97316/white?text=NH",
  },
};

// 施工事例詳細モックデータ
const MOCK_CASE_DETAILS: Record<string, any> = {
  "1": {
    id: 1,
    title: "自然素材にこだわった和モダンの家",
    description:
      "無垢材と漆喰壁を使用した、健康的で快適な住空間。家族の健康を第一に考え、自然素材をふんだんに使用しました。リビングには大きな吹き抜けを設け、光と風が家中を巡る設計に。キッチンは奥様のこだわりが詰まったオーダーメイド。収納も充実させ、暮らしやすさを追求しています。",
    prefecture: "愛知県",
    city: "名古屋市中区",
    buildingArea: 120.5,
    budget: 35000000,
    completionYear: 2023,
    status: "PUBLISHED",
    viewCount: 245,
    publishedAt: "2023-06-15",
    mainImageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    ],
    tags: [
      { id: 1, tag: { id: 1, name: "和モダン", category: "ATMOSPHERE" } },
      { id: 2, tag: { id: 8, name: "自然素材", category: "PREFERENCE" } },
      { id: 3, tag: { id: 9, name: "高気密高断熱", category: "PREFERENCE" } },
    ],
    author: {
      id: 1,
      name: "山田太郎",
    },
    createdAt: "2023-05-10",
    updatedAt: "2023-06-15",
  },
  "2": {
    id: 2,
    title: "モダンデザインの二世帯住宅",
    description:
      "親世帯と子世帯が快適に暮らせる二世帯住宅。プライバシーを保ちながらも、家族の繋がりを大切にした間取り設計。共有スペースと各世帯専用スペースをバランスよく配置しました。",
    prefecture: "愛知県",
    city: "豊田市",
    buildingArea: 180.0,
    budget: 48000000,
    completionYear: 2024,
    status: "DRAFT",
    viewCount: 0,
    publishedAt: null,
    mainImageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    ],
    tags: [
      { id: 1, tag: { id: 2, name: "モダン", category: "ATMOSPHERE" } },
      { id: 2, tag: { id: 5, name: "二世帯住宅", category: "HOUSE_TYPE" } },
    ],
    author: {
      id: 1,
      name: "山田太郎",
    },
    createdAt: "2024-12-01",
    updatedAt: "2024-12-18",
  },
};

export default function MemberCaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const caseData = MOCK_CASE_DETAILS[caseId];

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">
            施工事例が見つかりませんでした
          </p>
          <Link
            href="/member/cases"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            施工事例一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const isPublished = caseData.status === "PUBLISHED";

  function handleDelete() {
    // TODO: API実装時に実際の削除処理を追加
    setShowDeleteModal(false);
    router.push("/member/cases");
  }

  function formatBudget(budget: number) {
    return (budget / 10000).toLocaleString() + "万円";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* サイドバー */}
      <MemberSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        memberName={MOCK_MEMBER.name}
        memberRole={MOCK_MEMBER.role}
        companyName={MOCK_MEMBER.company.name}
        companyPrefecture={MOCK_MEMBER.company.prefecture}
        companyCity={MOCK_MEMBER.company.city}
      />

      {/* メインコンテンツ */}
      <div className="lg:pl-64">
        <main className="p-4 lg:p-8 overflow-y-auto">
          {/* ヘッダー */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link
                href="/member/cases"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-black text-gray-900">
                  施工事例プレビュー
                </h1>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex flex-wrap items-center gap-3">
              {/* ステータスバッジ */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                  isPublished
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
                }`}
              >
                {isPublished ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-bold">公開中</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-bold">下書き</span>
                  </>
                )}
              </div>

              {/* 編集ボタン */}
              <Link
                href={`/member/cases/${caseId}/edit`}
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:shadow-lg transition"
              >
                <Edit className="h-4 w-4" />
                編集
              </Link>

              {/* 削除ボタン */}
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition"
              >
                <Trash2 className="h-4 w-4" />
                削除
              </button>

              {/* 公開ページで見る */}
              {isPublished && (
                <Link
                  href={`/cases/${caseId}`}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
                >
                  <Eye className="h-4 w-4" />
                  公開ページで見る
                </Link>
              )}
            </div>
          </div>

          {/* プレビューコンテンツ */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* メイン画像 */}
            <div className="relative h-96 bg-gray-200">
              <img
                src={caseData.images[selectedImage]}
                alt={caseData.title}
                className="w-full h-full object-cover"
              />
              {!isPublished && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  プレビューモード（未公開）
                </div>
              )}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {caseData.viewCount} 閲覧
              </div>
            </div>

            {/* サムネイル */}
            {caseData.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50">
                {caseData.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index
                        ? "border-red-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${caseData.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* 詳細情報 */}
            <div className="p-6 lg:p-8">
              {/* タイトル */}
              <h1 className="text-3xl font-black text-gray-900 mb-4">
                {caseData.title}
              </h1>

              {/* タグ */}
              <div className="flex flex-wrap gap-2 mb-6">
                {caseData.tags.map((tagItem: any) => (
                  <span
                    key={tagItem.id}
                    className="px-3 py-1 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 text-sm font-medium rounded-full"
                  >
                    {tagItem.tag.name}
                  </span>
                ))}
              </div>

              {/* 基本情報グリッド */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MapPin className="h-4 w-4" />
                    <p className="text-xs">所在地</p>
                  </div>
                  <p className="font-bold text-gray-900">
                    {caseData.prefecture}
                  </p>
                  <p className="text-sm text-gray-600">{caseData.city}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Ruler className="h-4 w-4" />
                    <p className="text-xs">延床面積</p>
                  </div>
                  <p className="font-bold text-gray-900">
                    {caseData.buildingArea}㎡
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <p className="text-xs">予算</p>
                  </div>
                  <p className="font-bold text-gray-900">
                    {formatBudget(caseData.budget)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="h-4 w-4" />
                    <p className="text-xs">竣工年</p>
                  </div>
                  <p className="font-bold text-gray-900">
                    {caseData.completionYear}年
                  </p>
                </div>
              </div>

              {/* 説明 */}
              <div className="mb-8">
                <h2 className="text-xl font-black text-gray-900 mb-4">
                  施工事例の説明
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {caseData.description}
                </p>
              </div>

              {/* 作成・更新情報 */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">作成日:</span>{" "}
                    {new Date(caseData.createdAt).toLocaleDateString("ja-JP")}
                  </div>
                  <div>
                    <span className="font-medium">更新日:</span>{" "}
                    {new Date(caseData.updatedAt).toLocaleDateString("ja-JP")}
                  </div>
                  {caseData.publishedAt && (
                    <div>
                      <span className="font-medium">公開日:</span>{" "}
                      {new Date(caseData.publishedAt).toLocaleDateString(
                        "ja-JP"
                      )}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">投稿者:</span>{" "}
                    {caseData.author.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 削除確認モーダル */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900">
                施工事例を削除
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              この施工事例を削除してもよろしいですか？この操作は取り消せません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
