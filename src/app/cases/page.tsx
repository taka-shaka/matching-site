// src/app/cases/page.tsx
// 施工事例一覧ページ（API連携版）

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import {
  MapPin,
  TrendingUp,
  Calendar,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { formatBudget } from "@/lib/format";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Tag {
  id: number;
  name: string;
  category: string;
}

interface CaseTag {
  id: number;
  caseId: number;
  tagId: number;
  createdAt: string;
  tag: Tag;
}

interface Company {
  id: number;
  name: string;
  prefecture: string;
  city: string;
  logoUrl: string | null;
}

interface Author {
  id: number;
  name: string;
}

interface ConstructionCase {
  id: number;
  companyId: number;
  authorId: number;
  title: string;
  description: string;
  prefecture: string;
  city: string;
  buildingArea: number | null;
  budget: number | null;
  completionYear: number | null;
  mainImageUrl: string | null;
  status: string;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  company: Company;
  tags: CaseTag[];
  author: Author;
}

interface CasesResponse {
  cases: ConstructionCase[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [prefectureFilter, setPrefectureFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // APIパラメータ構築
  const buildApiUrl = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (prefectureFilter) params.append("prefecture", prefectureFilter);
    if (tagFilter) params.append("tag", tagFilter);
    params.append("page", currentPage.toString());
    params.append("limit", "12");

    return `/api/public/cases?${params.toString()}`;
  };

  // データ取得
  const { data, error, isLoading } = useSWR<CasesResponse>(
    buildApiUrl(),
    fetcher
  );

  // 都道府県一覧取得（簡易版 - 固定値）
  const PREFECTURES = ["愛知県", "岐阜県", "三重県"];

  // 人気タグをAPIから取得
  const { data: tagsData } = useSWR<{
    tags: Array<{
      id: number;
      name: string;
      category: string;
      companyCount: number;
      caseCount: number;
    }>;
  }>("/api/tags?withCounts=true", fetcher);

  // 施工事例数でソートして上位15件を抽出（カウント0のタグも表示）
  const POPULAR_TAGS = (tagsData?.tags || [])
    .sort((a, b) => b.caseCount - a.caseCount)
    .slice(0, 15)
    .map((tag) => ({ name: tag.name, count: tag.caseCount }));

  // 検索ハンドラー
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // 検索時はページを1にリセット
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* メインコンテンツ（固定ヘッダー分の余白を追加） */}
      <main className="pt-[60px]">
        {/* ヒーローセクション */}
        <section className="relative text-white py-20 overflow-hidden">
          {/* 背景画像 */}
          <div className="absolute inset-0">
            <Image
              src="/images/cases-hero-bg.jpg"
              alt="施工事例を探す"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            {/* テキスト視認性向上のためのオーバーレイ */}
            <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/50 to-black/60"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-black mb-6">
                施工事例を探す
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8">
                {data?.pagination.total || 0}
                件の実例から、あなたの理想の住まいを見つけましょう
              </p>

              {/* 検索バー */}
              <form
                onSubmit={handleSearch}
                className="max-w-2xl mx-auto bg-white rounded-full p-2 shadow-2xl"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-gray-400 ml-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="キーワードで検索..."
                    className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none rounded-full"
                  />
                  <button
                    type="submit"
                    className="px-8 py-3 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-full font-bold hover:shadow-lg transition-all duration-300"
                  >
                    検索
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* メインコンテンツ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* サイドバー（フィルター） */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="h-1 w-6 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
                  絞り込み
                </h2>

                {/* 都道府県フィルター */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">都道府県</h3>
                  <select
                    value={prefectureFilter}
                    onChange={(e) => {
                      setPrefectureFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">すべて</option>
                    {PREFECTURES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* タグフィルター */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">人気タグ</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setTagFilter("");
                        setCurrentPage(1);
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        !tagFilter
                          ? "bg-linear-to-r from-red-50 to-orange-50 text-red-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      すべて ({data?.pagination.total || 0})
                    </button>
                    {POPULAR_TAGS.map((tag) => (
                      <button
                        key={tag.name}
                        onClick={() => {
                          setTagFilter(tag.name);
                          setCurrentPage(1);
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          tagFilter === tag.name
                            ? "bg-linear-to-r from-red-50 to-orange-50 text-red-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {tag.name} ({tag.count})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* 施工事例グリッド */}
            <div className="lg:col-span-3">
              {/* ローディング状態 */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
                  <p className="text-gray-600">読み込み中...</p>
                </div>
              )}

              {/* エラー状態 */}
              {error && (
                <div className="flex flex-col items-center justify-center py-20">
                  <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                  <p className="text-gray-600 mb-4">
                    データの取得に失敗しました
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    再読み込み
                  </button>
                </div>
              )}

              {/* データ表示 */}
              {!isLoading && !error && data && (
                <>
                  {/* 結果表示 */}
                  <div className="mb-6">
                    <p className="text-gray-600">
                      {data.pagination.total}件中{" "}
                      {(data.pagination.page - 1) * data.pagination.limit + 1}〜
                      {Math.min(
                        data.pagination.page * data.pagination.limit,
                        data.pagination.total
                      )}
                      件を表示
                    </p>
                  </div>

                  {/* 空データ */}
                  {data.cases.length === 0 && (
                    <div className="text-center py-20">
                      <p className="text-gray-600 text-lg">
                        条件に一致する施工事例が見つかりませんでした
                      </p>
                    </div>
                  )}

                  {/* 事例グリッド */}
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                    {data.cases.map((case_) => (
                      <Link
                        key={case_.id}
                        href={`/cases/${case_.id}`}
                        className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                      >
                        {/* 画像 */}
                        <div className="h-48 bg-linear-to-br from-red-400 to-orange-400 relative overflow-hidden">
                          {case_.mainImageUrl ? (
                            <img
                              src={case_.mainImageUrl}
                              alt={case_.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                              <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-2xl"></div>
                              <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 bg-white/90 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                  <svg
                                    className="w-12 h-12 text-red-500"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                                  </svg>
                                </div>
                              </div>
                            </>
                          )}

                          {/* 竣工年バッジ */}
                          {case_.completionYear && (
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-red-500" />
                                <span className="text-xs font-bold text-gray-700">
                                  {case_.completionYear}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* コンテンツ */}
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                            {case_.title}
                          </h3>

                          {/* メタ情報 */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                              <span className="truncate">
                                {case_.prefecture} {case_.city}
                              </span>
                            </div>

                            {case_.budget && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <TrendingUp className="w-4 h-4 text-orange-500 shrink-0" />
                                <span>{formatBudget(case_.budget)}</span>
                              </div>
                            )}
                          </div>

                          {/* タグ */}
                          <div className="flex flex-wrap gap-2">
                            {case_.tags.slice(0, 2).map((ct) => (
                              <span
                                key={ct.id}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-red-50 to-orange-50 text-red-700 border border-red-100"
                              >
                                {ct.tag.name}
                              </span>
                            ))}
                            {case_.tags.length > 2 && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                +{case_.tags.length - 2}
                              </span>
                            )}
                          </div>

                          {/* 工務店名 */}
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                              {case_.company.name}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* ページネーション */}
                  {data.pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                      {currentPage > 1 && (
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          前へ
                        </button>
                      )}

                      {Array.from(
                        { length: data.pagination.totalPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            page === currentPage
                              ? "bg-linear-to-r from-red-500 to-orange-500 text-white font-bold"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      {currentPage < data.pagination.totalPages && (
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          次へ
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
