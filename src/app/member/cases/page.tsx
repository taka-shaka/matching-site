// src/app/member/cases/page.tsx
// メンバー（工務店）施工事例管理一覧ページ

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Menu,
  FileText,
  Loader2,
  AlertCircle,
  Calendar,
} from "lucide-react";
import MemberSidebar from "@/components/member/MemberSidebar";
import { useAuth } from "@/lib/auth-provider";
import { formatBudget } from "@/lib/format";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Member {
  name: string;
  role: "ADMIN" | "GENERAL";
}

interface Company {
  name: string;
}

interface Tag {
  id: number;
  name: string;
  category: string;
}

interface CaseTag {
  id: number;
  tag: Tag;
}

interface CaseItem {
  id: number;
  title: string;
  description: string;
  prefecture: string;
  city: string;
  buildingArea: number | null;
  budget: number | null;
  completionYear: number | null;
  mainImageUrl: string | null;
  status: "DRAFT" | "PUBLISHED";
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  author: {
    id: number;
    name: string;
  };
  tags: CaseTag[];
}

interface CasesResponse {
  cases: CaseItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

type StatusFilter = "all" | "PUBLISHED" | "DRAFT";

export default function MemberCasesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();

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

  // ダッシュボードデータ取得（メンバー情報用）
  const { data: dashboardData } = useSWR("/api/member/dashboard", fetcher);

  // 施工事例一覧取得
  const apiUrl =
    statusFilter === "all"
      ? "/api/member/cases"
      : `/api/member/cases?status=${statusFilter}`;

  const { data, error, isLoading } = useSWR<CasesResponse>(apiUrl, fetcher);

  // ローカル検索フィルター
  const filteredCases = data?.cases.filter((caseItem) =>
    caseItem.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  // ローディング中の処理
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // 未認証または役割不一致の処理
  if (!user || user.userType !== "member") {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* サイドバー */}
      <MemberSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        memberName={dashboardData?.member.name || user?.email || "メンバー"}
        companyName={dashboardData?.company.name || ""}
        memberRole={dashboardData?.member.role || "GENERAL"}
      />

      {/* メインコンテンツ */}
      <div className="lg:pl-64">
        {/* トップバー */}
        <div className="sticky top-0 z-10 flex h-16 shrink-0 bg-white border-b border-gray-200">
          <button
            type="button"
            className="px-4 text-gray-500 lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex flex-1 items-center">
              <h1 className="text-2xl font-black text-gray-900">
                施工事例管理
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/member/cases/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
              >
                <Plus className="h-5 w-5" />
                新規作成
              </Link>
            </div>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <main className="p-4 lg:p-8">
          {/* フィルター・検索 */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            {/* 検索 */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="施工事例を検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* ステータスフィルター */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  statusFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                すべて
              </button>
              <button
                onClick={() => setStatusFilter("PUBLISHED")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  statusFilter === "PUBLISHED"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                公開中
              </button>
              <button
                onClick={() => setStatusFilter("DRAFT")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  statusFilter === "DRAFT"
                    ? "bg-gray-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                下書き
              </button>
            </div>
          </div>

          {/* ローディング状態 */}
          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          )}

          {/* エラー状態 */}
          {error && (
            <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
              <AlertCircle className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium mb-4">
                データの取得に失敗しました
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
              >
                再読み込み
              </button>
            </div>
          )}

          {/* データ表示 */}
          {!isLoading && !error && data && (
            <>
              {/* 統計情報 */}
              <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {filteredCases?.length || 0} 件の施工事例
                    {searchQuery && ` （「${searchQuery}」で検索）`}
                  </p>
                  <p className="text-xs text-gray-500">
                    全{data.pagination.total}件中
                  </p>
                </div>
              </div>

              {/* 施工事例一覧 */}
              {filteredCases && filteredCases.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {searchQuery
                      ? "検索条件に一致する施工事例がありません"
                      : "まだ施工事例がありません"}
                  </p>
                  {!searchQuery && (
                    <Link
                      href="/member/cases/new"
                      className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                      <Plus className="h-5 w-5" />
                      最初の施工事例を作成
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCases?.map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group"
                    >
                      {/* 画像 */}
                      <div className="relative h-48 overflow-hidden bg-linear-to-br from-blue-400 to-indigo-400">
                        {caseItem.mainImageUrl ? (
                          <img
                            src={caseItem.mainImageUrl}
                            alt={caseItem.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-16 h-16 text-white opacity-50" />
                          </div>
                        )}

                        {/* ステータスバッジ */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              caseItem.status === "PUBLISHED"
                                ? "bg-green-500 text-white"
                                : "bg-gray-500 text-white"
                            }`}
                          >
                            {caseItem.status === "PUBLISHED"
                              ? "公開"
                              : "下書き"}
                          </span>
                        </div>

                        {/* 閲覧数 */}
                        <div className="absolute bottom-3 left-3">
                          <div className="flex items-center gap-1 px-2 py-1 bg-black bg-opacity-50 rounded-full">
                            <Eye className="h-3 w-3 text-white" />
                            <span className="text-xs text-white font-medium">
                              {caseItem.viewCount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* コンテンツ */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                          {caseItem.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {caseItem.description}
                        </p>

                        {/* メタ情報 */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                          <span>
                            {caseItem.prefecture} {caseItem.city}
                          </span>
                          {caseItem.budget && (
                            <>
                              <span>•</span>
                              <span>{formatBudget(caseItem.budget)}</span>
                            </>
                          )}
                        </div>

                        {/* タグ */}
                        {caseItem.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {caseItem.tags.slice(0, 3).map((ct) => (
                              <span
                                key={ct.id}
                                className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                              >
                                {ct.tag.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* 作成日時 */}
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                          <Calendar className="h-3 w-3" />
                          {formatDate(caseItem.createdAt)}
                        </div>

                        {/* アクション */}
                        <div className="flex gap-2">
                          <Link
                            href={`/member/cases/${caseItem.id}`}
                            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-center text-sm font-medium rounded-lg hover:bg-gray-200 transition"
                          >
                            詳細
                          </Link>
                          <Link
                            href={`/member/cases/${caseItem.id}/edit`}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white text-center text-sm font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-1"
                          >
                            <Edit2 className="h-4 w-4" />
                            編集
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
