"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  Search,
  Filter,
  ChevronDown,
  MapPin,
  Eye,
  Edit2,
  CheckCircle,
  XCircle,
  FileText,
  Building2,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

// モック管理者データ
const MOCK_ADMIN = {
  name: "管理者 太郎",
  email: "admin@matching-site.jp",
  role: "SUPER_ADMIN" as const,
};

// モック施工事例データ (Prismaスキーマに準拠)
const MOCK_CASES = [
  {
    id: 1,
    companyId: 1,
    companyName: "株式会社ナゴヤホーム",
    authorId: 1,
    authorName: "田中一郎",
    title: "自然光が降り注ぐ開放的な吹き抜けのある家",
    description:
      "家族の笑顔が集まるリビングを中心に設計した、明るく開放的な住まい...",
    prefecture: "愛知県",
    city: "名古屋市中区",
    buildingArea: 120.5,
    budget: 35000000,
    completionYear: 2023,
    mainImageUrl: "https://placehold.co/800x600/f97316/white?text=Case1",
    status: "PUBLISHED" as const,
    viewCount: 1523,
    publishedAt: "2024-02-01T10:00:00",
    createdAt: "2024-01-25",
  },
  {
    id: 2,
    companyId: 1,
    companyName: "株式会社ナゴヤホーム",
    authorId: 2,
    authorName: "鈴木花子",
    title: "和モダンが融合するスタイリッシュな二世帯住宅",
    description: "伝統的な和の要素と現代的なデザインを融合させた二世帯住宅...",
    prefecture: "愛知県",
    city: "名古屋市東区",
    buildingArea: 150.8,
    budget: 48000000,
    completionYear: 2023,
    mainImageUrl: "https://placehold.co/800x600/f97316/white?text=Case2",
    status: "PUBLISHED" as const,
    viewCount: 987,
    publishedAt: "2024-02-10T14:30:00",
    createdAt: "2024-02-05",
  },
  {
    id: 3,
    companyId: 2,
    companyName: "大阪ビルダーズ株式会社",
    authorId: 3,
    authorName: "佐藤次郎",
    title: "都市型狭小住宅の新しいカタチ",
    description:
      "限られた敷地を最大限に活用した、機能的でスタイリッシュな3階建て住宅...",
    prefecture: "大阪府",
    city: "大阪市北区",
    buildingArea: 85.3,
    budget: 28000000,
    completionYear: 2023,
    mainImageUrl: "https://placehold.co/800x600/f97316/white?text=Case3",
    status: "DRAFT" as const,
    viewCount: 0,
    publishedAt: null,
    createdAt: "2024-02-15",
  },
  {
    id: 4,
    companyId: 2,
    companyName: "大阪ビルダーズ株式会社",
    authorId: 4,
    authorName: "高橋美咲",
    title: "中庭のある平屋で実現するゆとりの暮らし",
    description:
      "プライバシーを守りながら開放感を得られる中庭を中心とした平屋住宅...",
    prefecture: "大阪府",
    city: "豊中市",
    buildingArea: 110.2,
    budget: 38000000,
    completionYear: 2024,
    mainImageUrl: "https://placehold.co/800x600/f97316/white?text=Case4",
    status: "PUBLISHED" as const,
    viewCount: 756,
    publishedAt: "2024-03-01T09:00:00",
    createdAt: "2024-02-20",
  },
  {
    id: 5,
    companyId: 3,
    companyName: "京都工房",
    authorId: 6,
    authorName: "小林真理子",
    title: "京町家の伝統を受け継ぐリノベーション住宅",
    description:
      "築100年超の京町家をモダンにリノベーション。歴史と快適性の融合...",
    prefecture: "京都府",
    city: "京都市下京区",
    buildingArea: 95.6,
    budget: 32000000,
    completionYear: 2023,
    mainImageUrl: "https://placehold.co/800x600/f97316/white?text=Case5",
    status: "PUBLISHED" as const,
    viewCount: 1845,
    publishedAt: "2024-01-20T11:00:00",
    createdAt: "2024-01-15",
  },
  {
    id: 6,
    companyId: 4,
    companyName: "神戸ハウジング",
    authorId: 7,
    authorName: "山本大輔",
    title: "海を望むリゾートライクな住まい",
    description:
      "神戸の海を一望できる高台に建つ、リゾート感覚を楽しめる住宅...",
    prefecture: "兵庫県",
    city: "神戸市垂水区",
    buildingArea: 135.4,
    budget: 45000000,
    completionYear: 2024,
    mainImageUrl: "https://placehold.co/800x600/f97316/white?text=Case6",
    status: "PUBLISHED" as const,
    viewCount: 1234,
    publishedAt: "2024-02-25T15:00:00",
    createdAt: "2024-02-18",
  },
];

export default function AdminCasesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "PUBLISHED" | "DRAFT"
  >("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // 統計計算
  const stats = {
    total: MOCK_CASES.length,
    published: MOCK_CASES.filter((c) => c.status === "PUBLISHED").length,
    draft: MOCK_CASES.filter((c) => c.status === "DRAFT").length,
    totalViews: MOCK_CASES.reduce((sum, c) => sum + c.viewCount, 0),
  };

  // フィルタリング処理
  const filteredCases = MOCK_CASES.filter((caseItem) => {
    const matchesSearch =
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.prefecture.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || caseItem.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  function handleTogglePublish(caseId: number) {
    // TODO: 実際の公開/非公開切り替え処理はAPI実装時に追加
    alert(`施工事例ID ${caseId} の公開ステータスを切り替えました`);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* サイドバー */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        adminName={MOCK_ADMIN.name}
        adminRole={MOCK_ADMIN.role}
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
              <h1 className="text-3xl font-black text-gray-900">
                施工事例管理
              </h1>
              <p className="text-gray-600 mt-1">
                登録施工事例の確認・管理ができます
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
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">全施工事例</p>
            <p className="text-3xl font-black text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">公開中</p>
            <p className="text-3xl font-black text-gray-900">
              {stats.published}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">下書き</p>
            <p className="text-3xl font-black text-gray-900">{stats.draft}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">総閲覧数</p>
            <p className="text-3xl font-black text-gray-900">
              {stats.totalViews.toLocaleString()}
            </p>
          </div>
        </div>

        {/* 施工事例一覧 */}
        {filteredCases.length === 0 ? (
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
            {filteredCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* 画像 */}
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={caseItem.mainImageUrl}
                    alt={caseItem.title}
                    className="w-full h-full object-cover"
                  />
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
                      {caseItem.companyName}
                    </span>
                    <span>投稿者: {caseItem.authorName}</span>
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
                      <p className="text-xs text-gray-600 mb-1">延床面積</p>
                      <p className="text-sm font-bold text-gray-900">
                        {caseItem.buildingArea}㎡
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">予算</p>
                      <p className="text-sm font-bold text-gray-900">
                        {(caseItem.budget / 10000).toFixed(0)}万円
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
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/cases/${caseItem.id}`}
                      target="_blank"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition border border-blue-200"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">公開ページを見る</span>
                    </Link>
                    <button
                      onClick={() => handleTogglePublish(caseItem.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition border ${
                        caseItem.status === "PUBLISHED"
                          ? "text-orange-600 hover:bg-orange-50 border-orange-200"
                          : "text-green-600 hover:bg-green-50 border-green-200"
                      }`}
                    >
                      {caseItem.status === "PUBLISHED" ? (
                        <>
                          <XCircle className="h-4 w-4" />
                          <span className="font-medium">非公開</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">公開</span>
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
