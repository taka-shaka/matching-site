// src/app/admin/companies/page.tsx
// 管理者 工務店管理一覧ページ

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import {
  Building2,
  Menu,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Edit2,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
  Plus,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/lib/auth-provider";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Company {
  id: number;
  name: string;
  description: string | null;
  address: string;
  prefecture: string;
  city: string;
  phoneNumber: string;
  email: string;
  websiteUrl: string | null;
  logoUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  caseCount: number;
  inquiryCount: number;
}

interface CompaniesResponse {
  companies: Company[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

type FilterStatus = "all" | "published" | "unpublished";

export default function AdminCompaniesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
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

  // 工務店一覧取得
  const apiUrl =
    filterStatus === "all"
      ? "/api/admin/companies"
      : `/api/admin/companies?isPublished=${filterStatus === "published"}`;

  const { data, error, isLoading } = useSWR<CompaniesResponse>(apiUrl, fetcher);

  // ローカル検索フィルター
  const filteredCompanies = data?.companies?.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 統計計算
  const stats = {
    all: data?.pagination.total || 0,
    published: data?.companies?.filter((c) => c.isPublished).length || 0,
    unpublished: data?.companies?.filter((c) => !c.isPublished).length || 0,
  };

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
              <h1 className="text-2xl font-black text-gray-900">工務店管理</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/companies/new"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
              >
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">新規登録</span>
              </Link>
            </div>
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
                  placeholder="工務店名、メール、市区町村で検索..."
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
                      : filterStatus === "published"
                        ? "公開中"
                        : "非公開"}
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
                      すべて ({stats.all})
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus("published");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                    >
                      公開中 ({stats.published})
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus("unpublished");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                    >
                      非公開 ({stats.unpublished})
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">全工務店</p>
                  <p className="text-3xl font-black text-gray-900">
                    {stats.all}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">公開中</p>
                  <p className="text-3xl font-black text-gray-900">
                    {stats.published}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">非公開</p>
                  <p className="text-3xl font-black text-gray-900">
                    {stats.unpublished}
                  </p>
                </div>
              </div>

              {/* 工務店一覧 */}
              {filteredCompanies && filteredCompanies.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
                  <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    {searchQuery
                      ? "検索条件に一致する工務店が見つかりませんでした"
                      : "まだ工務店が登録されていません"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCompanies?.map((company) => (
                    <div
                      key={company.id}
                      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-black text-gray-900">
                                {company.name}
                              </h3>
                              <span
                                className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full ${
                                  company.isPublished
                                    ? "bg-green-100 text-green-700 border border-green-200"
                                    : "bg-orange-100 text-orange-700 border border-orange-200"
                                }`}
                              >
                                {company.isPublished ? (
                                  <>
                                    <CheckCircle className="h-3 w-3" />
                                    公開中
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3" />
                                    非公開
                                  </>
                                )}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {company.prefecture} {company.city}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {company.phoneNumber}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {company.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-600">
                                登録日:{" "}
                                <span className="text-gray-900">
                                  {formatDate(company.createdAt)}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 統計情報 */}
                        <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">
                              メンバー
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {company.memberCount}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">
                              施工事例
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {company.caseCount}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">
                              問い合わせ
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {company.inquiryCount}
                            </p>
                          </div>
                        </div>

                        {/* アクション */}
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/companies/${company.id}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition border border-blue-200"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="font-medium">詳細・編集</span>
                          </Link>
                          <Link
                            href={`/companies/${company.id}`}
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition border border-gray-200"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="font-medium">
                              公開ページを見る
                            </span>
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
