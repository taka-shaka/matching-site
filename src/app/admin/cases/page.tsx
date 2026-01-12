"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Menu,
  Search,
  Filter,
  ChevronDown,
  MapPin,
  Eye,
  Edit2,
  CheckCircle,
  FileText,
  Building2,
  Loader2,
  AlertCircle,
  Trash2,
  XCircle,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/lib/auth-provider";
import { formatBudget } from "@/lib/format";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Company {
  id: number;
  name: string;
  prefecture: string;
  city: string;
}

interface Author {
  id: number;
  name: string;
}

interface CaseTag {
  id: number;
  tag: {
    id: number;
    name: string;
    category: string;
  };
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
  company: Company;
  author: Author;
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

export default function AdminCasesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "PUBLISHED" | "DRAFT"
  >("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  // 認証・役割チェック
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/admin/login");
      } else if (user.userType !== "admin") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  // 施工事例一覧取得
  const apiUrl =
    filterStatus === "all"
      ? "/api/admin/cases"
      : `/api/admin/cases?status=${filterStatus}`;

  const { data, error, isLoading, mutate } = useSWR<CasesResponse>(
    apiUrl,
    fetcher
  );

  // ローカル検索フィルター
  const filteredCases = data?.cases.filter(
    (caseItem) =>
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.prefecture.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 統計計算
  const stats = {
    total: data?.pagination.total || 0,
    published: data?.cases.filter((c) => c.status === "PUBLISHED").length || 0,
    draft: data?.cases.filter((c) => c.status === "DRAFT").length || 0,
    totalViews: data?.cases.reduce((sum, c) => sum + c.viewCount, 0) || 0,
  };

  // ステータストグル処理
  async function handleToggleStatus(
    caseId: number,
    currentStatus: "DRAFT" | "PUBLISHED"
  ) {
    if (togglingId) return;

    const confirmMessage =
      currentStatus === "PUBLISHED"
        ? "この施工事例を下書きに戻しますか？"
        : "この施工事例を公開しますか？";

    if (!confirm(confirmMessage)) return;

    setTogglingId(caseId);

    try {
      const response = await fetch(`/api/admin/cases/${caseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "ステータスの更新に失敗しました");
      }

      // データを再取得
      await mutate();
      alert("ステータスを更新しました");
    } catch (error) {
      console.error("Failed to toggle status:", error);
      alert(
        error instanceof Error
          ? error.message
          : "ステータスの更新に失敗しました"
      );
    } finally {
      setTogglingId(null);
    }
  }

  // 削除処理
  async function handleDelete(caseId: number, caseTitle: string) {
    if (deletingId) return;

    if (
      !confirm(
        `施工事例「${caseTitle}」を削除しますか？\n\nこの操作は取り消せません。関連する画像やタグも削除されます。`
      )
    ) {
      return;
    }

    setDeletingId(caseId);

    try {
      const response = await fetch(`/api/admin/cases/${caseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "施工事例の削除に失敗しました");
      }

      // データを再取得
      await mutate();
      alert("施工事例を削除しました");
    } catch (error) {
      console.error("Failed to delete case:", error);
      alert(
        error instanceof Error ? error.message : "施工事例の削除に失敗しました"
      );
    } finally {
      setDeletingId(null);
    }
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
  if (!user || user.userType !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* サイドバー */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        adminName={user?.email || "管理者"}
        adminRole="ADMIN"
      />

      {/* メインコンテンツ */}
      <div className="lg:pl-64">
        {/* トップバー */}
        <div className="sticky top-0 z-10 flex h-16 shrink-0 bg-white border-b border-gray-200">
          <button
            type="button"
            className="px-4 text-gray-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex flex-1 items-center">
              <h1 className="text-2xl font-black text-gray-900">
                施工事例管理
              </h1>
            </div>
            <div className="flex items-center gap-3"></div>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <main className="p-4 lg:p-8">
          {/* アクションバー */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* 検索バー */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="タイトル、工務店名、エリアで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* フィルター */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                >
                  <Filter className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-700">
                    {filterStatus === "all"
                      ? "すべて"
                      : filterStatus === "PUBLISHED"
                        ? "公開中"
                        : "下書き"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10">
                    <button
                      onClick={() => {
                        setFilterStatus("all");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                    >
                      すべて ({stats.total})
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus("PUBLISHED");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                    >
                      公開中 ({stats.published})
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus("DRAFT");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                    >
                      下書き ({stats.draft})
                    </button>
                  </div>
                )}
              </div>
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
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
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
              {/* 統計カード */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">全施工事例</p>
                  <p className="text-3xl font-black text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">公開中</p>
                  <p className="text-3xl font-black text-gray-900">
                    {stats.published}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">下書き</p>
                  <p className="text-3xl font-black text-gray-900">
                    {stats.draft}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">総閲覧数</p>
                  <p className="text-3xl font-black text-gray-900">
                    {stats.totalViews.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* 施工事例一覧 */}
              {filteredCases && filteredCases.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    {searchQuery
                      ? "検索条件に一致する施工事例が見つかりませんでした"
                      : "まだ施工事例が登録されていません"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredCases?.map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      {/* 画像 */}
                      <div className="relative h-48 bg-gray-100">
                        {caseItem.mainImageUrl ? (
                          <Image
                            src={caseItem.mainImageUrl}
                            alt={caseItem.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-16 h-16 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <span
                            className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full ${
                              caseItem.status === "PUBLISHED"
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-orange-100 text-orange-700 border border-orange-200"
                            }`}
                          >
                            {caseItem.status === "PUBLISHED" ? (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                公開中
                              </>
                            ) : (
                              <>
                                <Edit2 className="h-3 w-3" />
                                下書き
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-2">
                          {caseItem.title}
                        </h3>

                        {/* 工務店・投稿者情報 */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {caseItem.company.name}
                          </span>
                          <span>投稿者: {caseItem.author.name}</span>
                        </div>

                        {/* エリア情報 */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {caseItem.prefecture} {caseItem.city}
                          </span>
                        </div>

                        {/* 統計情報 */}
                        <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">
                              延床面積
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {caseItem.buildingArea
                                ? `${caseItem.buildingArea}㎡`
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">予算</p>
                            <p className="text-sm font-bold text-gray-900">
                              {formatBudget(caseItem.budget)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">閲覧数</p>
                            <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {caseItem.viewCount}
                            </p>
                          </div>
                        </div>

                        {/* アクション */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {caseItem.status === "PUBLISHED" ? (
                            <Link
                              href={`/cases/${caseItem.id}`}
                              target="_blank"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition border border-blue-200"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="font-medium">
                                公開ページを見る
                              </span>
                            </Link>
                          ) : (
                            <button
                              disabled
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 bg-gray-100 rounded-lg border border-gray-200 cursor-not-allowed"
                              title="下書きのため公開ページはありません"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="font-medium">
                                公開ページを見る
                              </span>
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleToggleStatus(caseItem.id, caseItem.status)
                            }
                            disabled={togglingId === caseItem.id}
                            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition border ${
                              togglingId === caseItem.id
                                ? "opacity-50 cursor-not-allowed"
                                : caseItem.status === "PUBLISHED"
                                  ? "text-orange-600 border-orange-200 hover:bg-orange-50"
                                  : "text-green-600 border-green-200 hover:bg-green-50"
                            }`}
                          >
                            {togglingId === caseItem.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="font-medium">処理中...</span>
                              </>
                            ) : caseItem.status === "PUBLISHED" ? (
                              <>
                                <XCircle className="h-4 w-4" />
                                <span className="font-medium">
                                  下書きに戻す
                                </span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                <span className="font-medium">公開する</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() =>
                              router.push(`/admin/cases/${caseItem.id}/edit`)
                            }
                            className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition border border-purple-200"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="font-medium">編集</span>
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(caseItem.id, caseItem.title)
                            }
                            disabled={deletingId === caseItem.id}
                            className={`flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200 ${
                              deletingId === caseItem.id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {deletingId === caseItem.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="font-medium">削除中...</span>
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4" />
                                <span className="font-medium">削除</span>
                              </>
                            )}
                          </button>
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
