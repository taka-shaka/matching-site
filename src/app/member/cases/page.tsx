// src/app/member/cases/page.tsx
// メンバー（工務店）施工事例管理一覧ページ（UI実装 - モックデータ使用）

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Filter,
  ChevronDown,
  Menu,
  FileText,
} from "lucide-react";
import MemberSidebar from "@/components/member/MemberSidebar";

// モックデータ（Prismaスキーマに準拠）
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

const MOCK_CASES = [
  {
    id: 1,
    title: "自然素材にこだわった平屋の家",
    description:
      "木のぬくもりを感じられる、自然素材をふんだんに使った平屋住宅。無垢材のフローリングと珪藻土の壁が特徴です。",
    prefecture: "愛知県",
    city: "名古屋市中区",
    buildingArea: 95.5,
    budget: 3500,
    completionYear: 2024,
    mainImageUrl: "https://placehold.co/800x600/f97316/white?text=Case+1",
    status: "PUBLISHED" as const,
    viewCount: 342,
    publishedAt: "2024-11-15",
    createdAt: "2024-11-10",
    tags: [
      { id: 1, name: "平屋", category: "HOUSE_TYPE" },
      { id: 2, name: "3000-4000万円", category: "PRICE_RANGE" },
      { id: 3, name: "木造", category: "STRUCTURE" },
    ],
  },
  {
    id: 2,
    title: "モダンデザインの二世帯住宅",
    description:
      "シンプルでモダンなデザインの二世帯住宅。各世帯のプライバシーを保ちながら、家族の絆を大切にする設計です。",
    prefecture: "愛知県",
    city: "名古屋市東区",
    buildingArea: 135.2,
    budget: 4800,
    completionYear: 2024,
    mainImageUrl: "https://placehold.co/800x600/ea580c/white?text=Case+2",
    status: "PUBLISHED" as const,
    viewCount: 521,
    publishedAt: "2024-10-20",
    createdAt: "2024-10-15",
    tags: [
      { id: 4, name: "二世帯", category: "HOUSE_TYPE" },
      { id: 5, name: "4000-5000万円", category: "PRICE_RANGE" },
      { id: 6, name: "モダン", category: "ATMOSPHERE" },
    ],
  },
  {
    id: 3,
    title: "開放的なリビングが魅力の家",
    description:
      "吹き抜けの大空間リビングが特徴。自然光がたっぷり入る明るく開放的な住まいです。",
    prefecture: "愛知県",
    city: "春日井市",
    buildingArea: 110.8,
    budget: 4200,
    completionYear: 2024,
    mainImageUrl: "https://placehold.co/800x600/dc2626/white?text=Case+3",
    status: "PUBLISHED" as const,
    viewCount: 287,
    publishedAt: "2024-09-05",
    createdAt: "2024-09-01",
    tags: [
      { id: 7, name: "2階建て", category: "HOUSE_TYPE" },
      { id: 8, name: "開放感", category: "PREFERENCE" },
    ],
  },
  {
    id: 4,
    title: "省エネ性能に優れたZEH住宅",
    description:
      "高断熱・高気密で省エネ性能に優れたZEH仕様の住宅。太陽光発電システムも完備しています。",
    prefecture: "愛知県",
    city: "一宮市",
    buildingArea: 102.4,
    budget: 3800,
    completionYear: 2023,
    mainImageUrl: "https://placehold.co/800x600/f97316/white?text=Case+4",
    status: "DRAFT" as const,
    viewCount: 0,
    publishedAt: null,
    createdAt: "2024-11-20",
    tags: [
      { id: 9, name: "省エネ", category: "PREFERENCE" },
      { id: 10, name: "3000-4000万円", category: "PRICE_RANGE" },
    ],
  },
  {
    id: 5,
    title: "和モダンな平屋の邸宅",
    description:
      "伝統的な和の要素を取り入れながら、現代的な快適さを兼ね備えた和モダンスタイルの平屋です。",
    prefecture: "愛知県",
    city: "豊田市",
    buildingArea: 115.6,
    budget: 4500,
    completionYear: 2023,
    mainImageUrl: "https://placehold.co/800x600/ea580c/white?text=Case+5",
    status: "DRAFT" as const,
    viewCount: 0,
    publishedAt: null,
    createdAt: "2024-11-18",
    tags: [
      { id: 11, name: "平屋", category: "HOUSE_TYPE" },
      { id: 12, name: "和モダン", category: "ATMOSPHERE" },
    ],
  },
];

type FilterStatus = "all" | "PUBLISHED" | "DRAFT";

export default function MemberCasesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // フィルタリングロジック
  const filteredCases = MOCK_CASES.filter((case_) => {
    const matchesSearch = case_.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || case_.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    all: MOCK_CASES.length,
    published: MOCK_CASES.filter((c) => c.status === "PUBLISHED").length,
    draft: MOCK_CASES.filter((c) => c.status === "DRAFT").length,
  };

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
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  施工事例管理
                </h1>
                <p className="text-gray-600 mt-1">
                  施工事例の投稿・編集・管理ができます
                </p>
              </div>
            </div>

            {/* アクションバー */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* 検索バー */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="タイトルで検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
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
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                      >
                        すべて ({stats.all})
                      </button>
                      <button
                        onClick={() => {
                          setFilterStatus("PUBLISHED");
                          setShowFilterDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                      >
                        公開中 ({stats.published})
                      </button>
                      <button
                        onClick={() => {
                          setFilterStatus("DRAFT");
                          setShowFilterDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                      >
                        下書き ({stats.draft})
                      </button>
                    </div>
                  )}
                </div>

                {/* 新規作成ボタン */}
                <Link
                  href="/member/cases/new"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-bold">新規作成</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 施工事例一覧 */}
          {filteredCases.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchQuery
                  ? "検索条件に一致する施工事例が見つかりませんでした"
                  : "まだ施工事例がありません"}
              </p>
              {!searchQuery && (
                <Link
                  href="/member/cases/new"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-linear-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-bold">最初の施工事例を作成</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredCases.map((case_) => (
                <div
                  key={case_.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* サムネイル */}
                    <div className="md:w-80 h-64 md:h-auto bg-gray-200 flex-shrink-0">
                      <img
                        src={case_.mainImageUrl}
                        alt={case_.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* コンテンツ */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-black text-gray-900">
                              {case_.title}
                            </h3>
                            <span
                              className={`px-3 py-1 text-xs font-bold rounded-full ${
                                case_.status === "PUBLISHED"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {case_.status === "PUBLISHED"
                                ? "公開中"
                                : "下書き"}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {case_.description}
                          </p>
                        </div>
                      </div>

                      {/* タグ */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {case_.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="px-3 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-full border border-red-200"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>

                      {/* メタ情報 */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">所在地</p>
                          <p className="text-sm font-medium text-gray-900">
                            {case_.prefecture} {case_.city}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">延床面積</p>
                          <p className="text-sm font-medium text-gray-900">
                            {case_.buildingArea}㎡
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">予算</p>
                          <p className="text-sm font-medium text-gray-900">
                            {case_.budget}万円
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">完成年</p>
                          <p className="text-sm font-medium text-gray-900">
                            {case_.completionYear}年
                          </p>
                        </div>
                      </div>

                      {/* アクションと統計 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{case_.viewCount} views</span>
                          </div>
                          {case_.publishedAt && (
                            <span>公開: {case_.publishedAt}</span>
                          )}
                          {!case_.publishedAt && (
                            <span>作成: {case_.createdAt}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/member/cases/${case_.id}/edit`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="font-medium">編集</span>
                          </Link>
                          <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="h-4 w-4" />
                            <span className="font-medium">削除</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
