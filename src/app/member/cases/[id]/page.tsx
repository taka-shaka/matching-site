// src/app/member/cases/[id]/page.tsx
// メンバー（工務店）施工事例詳細プレビューページ

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  Loader2,
} from "lucide-react";
import MemberSidebar from "@/components/member/MemberSidebar";
import { useAuth } from "@/lib/auth-provider";
import { formatBudget } from "@/lib/format";

interface MemberData {
  member: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  company: {
    id: number;
    name: string;
    prefecture: string;
    city: string;
    logoUrl: string | null;
  };
}

interface CaseData {
  id: number;
  title: string;
  description: string;
  prefecture: string;
  city: string;
  buildingArea: number;
  budget: number;
  completionYear: number;
  status: string;
  viewCount: number;
  publishedAt: string | null;
  mainImageUrl: string | null;
  images: Array<{ id: number; imageUrl: string; displayOrder: number }>;
  tags: Array<{
    id: number;
    tag: { id: number; name: string; category: string };
  }>;
  author: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function MemberCaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const caseId = params.id as string;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 認証・役割チェック
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/member/login");
      } else if (user.userType !== "member") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  // メンバー情報と施工事例データを取得
  useEffect(() => {
    async function fetchData() {
      if (!user || user.userType !== "member") return;

      setIsLoadingData(true);
      setError(null);

      try {
        // メンバー情報を取得
        const memberResponse = await fetch("/api/member/dashboard");
        if (!memberResponse.ok) {
          throw new Error("Failed to fetch member data");
        }
        const memberResult = await memberResponse.json();
        setMemberData(memberResult);

        // 施工事例詳細を取得
        const caseResponse = await fetch(`/api/member/cases/${caseId}`);
        if (!caseResponse.ok) {
          if (caseResponse.status === 404) {
            setError("not_found");
          } else {
            throw new Error("Failed to fetch case data");
          }
          return;
        }
        const caseResult = await caseResponse.json();
        setCaseData(caseResult.case);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("fetch_error");
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchData();
  }, [user, caseId]);

  async function handleDelete() {
    try {
      const response = await fetch(`/api/member/cases/${caseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete case");
      }

      setShowDeleteModal(false);
      router.push("/member/cases");
    } catch (error) {
      console.error("Error deleting case:", error);
      alert("施工事例の削除に失敗しました");
    }
  }

  // 認証ローディング中
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // 未認証またはメンバー以外の場合
  if (!user || user.userType !== "member") {
    return null;
  }

  // データローディング中
  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-green-50 to-teal-50">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // エラー表示
  if (error === "not_found" || !caseData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">
            施工事例が見つかりませんでした
          </p>
          <Link
            href="/member/cases"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            施工事例一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  if (error === "fetch_error") {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">
            データの取得に失敗しました
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  const isPublished = caseData.status === "PUBLISHED";
  const imageUrls = caseData.images
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((img) => img.imageUrl);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-green-50 to-teal-50">
      {/* サイドバー */}
      <MemberSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        memberName={memberData?.member.name || "メンバー"}
        memberRole={memberData?.member.role || "MEMBER"}
        companyName={memberData?.company.name || ""}
        companyPrefecture={memberData?.company.prefecture || ""}
        companyCity={memberData?.company.city || ""}
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
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition"
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
              {imageUrls.length > 0 ? (
                <Image
                  src={imageUrls[selectedImage]}
                  alt={caseData.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              ) : caseData.mainImageUrl ? (
                <Image
                  src={caseData.mainImageUrl}
                  alt={caseData.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  画像なし
                </div>
              )}
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
            {imageUrls.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50">
                {imageUrls.map((imageUrl: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${caseData.title} - ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
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
                {caseData.tags.map(
                  (tagItem: { id: number; tag: { name: string } }) => (
                    <span
                      key={tagItem.id}
                      className="px-3 py-1 bg-linear-to-r from-blue-100 to-green-100 text-blue-700 text-sm font-medium rounded-full"
                    >
                      {tagItem.tag.name}
                    </span>
                  )
                )}
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
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-blue-600" />
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
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
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
