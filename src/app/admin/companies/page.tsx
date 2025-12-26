// src/app/admin/companies/page.tsx
// 管理者 工務店管理一覧ページ（UI実装 - モックデータ使用）

"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

// モックデータ
const MOCK_ADMIN = {
  id: 1,
  name: "管理者 太郎",
  email: "admin@matching-site.jp",
  role: "SUPER_ADMIN",
};

// 工務店モックデータ（Prismaスキーマに準拠）
const MOCK_COMPANIES = [
  {
    id: 1,
    name: "株式会社ナゴヤホーム",
    prefecture: "愛知県",
    city: "名古屋市中区",
    phoneNumber: "052-123-4567",
    email: "info@nagoya-home.co.jp",
    isPublished: true,
    memberCount: 5,
    caseCount: 12,
    inquiryCount: 28,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "株式会社豊田ハウジング",
    prefecture: "愛知県",
    city: "豊田市",
    phoneNumber: "0565-987-6543",
    email: "contact@toyota-housing.co.jp",
    isPublished: true,
    memberCount: 8,
    caseCount: 25,
    inquiryCount: 45,
    createdAt: "2023-11-20",
  },
  {
    id: 3,
    name: "株式会社春日井建設",
    prefecture: "愛知県",
    city: "春日井市",
    phoneNumber: "0568-555-1234",
    email: "info@kasugai-const.jp",
    isPublished: true,
    memberCount: 6,
    caseCount: 18,
    inquiryCount: 32,
    createdAt: "2024-03-10",
  },
  {
    id: 4,
    name: "株式会社岡崎工務店",
    prefecture: "愛知県",
    city: "岡崎市",
    phoneNumber: "0564-777-8888",
    email: "support@okazaki-komuten.jp",
    isPublished: false,
    memberCount: 3,
    caseCount: 5,
    inquiryCount: 8,
    createdAt: "2024-11-05",
  },
  {
    id: 5,
    name: "株式会社一宮ホームズ",
    prefecture: "愛知県",
    city: "一宮市",
    phoneNumber: "0586-333-4444",
    email: "hello@ichinomiya-homes.com",
    isPublished: true,
    memberCount: 7,
    caseCount: 22,
    inquiryCount: 38,
    createdAt: "2023-08-22",
  },
  {
    id: 6,
    name: "株式会社三河ホーム",
    prefecture: "愛知県",
    city: "岡崎市",
    phoneNumber: "0564-222-3333",
    email: "info@mikawa-home.jp",
    isPublished: false,
    memberCount: 2,
    caseCount: 3,
    inquiryCount: 4,
    createdAt: "2024-12-01",
  },
];

type FilterStatus = "all" | "published" | "unpublished";

export default function AdminCompaniesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // フィルタリングロジック
  const filteredCompanies = MOCK_COMPANIES.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "published" && company.isPublished) ||
      (filterStatus === "unpublished" && !company.isPublished);
    return matchesSearch && matchesStatus;
  });

  const stats = {
    all: MOCK_COMPANIES.length,
    published: MOCK_COMPANIES.filter((c) => c.isPublished).length,
    unpublished: MOCK_COMPANIES.filter((c) => !c.isPublished).length,
  };

  function handleTogglePublish(companyId: number) {
    // TODO: 実際の公開/非公開切り替え処理はAPI実装時に追加
    alert(`工務店ID ${companyId} の公開ステータスを切り替えました`);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* サイドバー */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        adminName={MOCK_ADMIN.name}
        adminRole={MOCK_ADMIN.role as "SUPER_ADMIN" | "ADMIN"}
      />

      {/* メインコンテンツ */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900">工務店管理</h1>
              <p className="text-gray-600 mt-1">
                登録工務店の確認・管理ができます
              </p>
            </div>
          </div>

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
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">全工務店</p>
            <p className="text-3xl font-black text-gray-900">{stats.all}</p>
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
        {filteredCompanies.length === 0 ? (
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
            {filteredCompanies.map((company) => (
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
                            {company.createdAt}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 統計情報 */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">メンバー</p>
                      <p className="text-lg font-bold text-gray-900">
                        {company.memberCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">施工事例</p>
                      <p className="text-lg font-bold text-gray-900">
                        {company.caseCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">問い合わせ</p>
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
                      <span className="font-medium">公開ページを見る</span>
                    </Link>
                    <button
                      onClick={() => handleTogglePublish(company.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition border ${
                        company.isPublished
                          ? "text-orange-600 hover:bg-orange-50 border-orange-200"
                          : "text-green-600 hover:bg-green-50 border-green-200"
                      }`}
                    >
                      {company.isPublished ? (
                        <>
                          <XCircle className="h-4 w-4" />
                          <span className="font-medium">非公開にする</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">公開する</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
