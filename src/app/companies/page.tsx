// src/app/companies/page.tsx
// 工務店一覧ページ（API連携版）

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import {
  MapPin,
  Search,
  Building2,
  Star,
  Briefcase,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Tag {
  id: number;
  name: string;
  category: string;
}

interface CompanyTag {
  id: number;
  companyId: number;
  tagId: number;
  createdAt: string;
  tag: Tag;
}

interface CasePreview {
  id: number;
  title: string;
  mainImageUrl: string | null;
}

interface Company {
  id: number;
  name: string;
  description: string;
  address: string;
  prefecture: string;
  city: string;
  phoneNumber: string;
  email: string;
  websiteUrl: string | null;
  logoUrl: string | null;
  mainImageUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  tags: CompanyTag[];
  cases: CasePreview[];
  _count: {
    cases: number;
  };
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

export default function CompaniesPage() {
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

    return `/api/public/companies?${params.toString()}`;
  };

  // データ取得
  const { data, error, isLoading } = useSWR<CompaniesResponse>(
    buildApiUrl(),
    fetcher
  );

  // 都道府県一覧（固定値）
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

  // 工務店数でソートして上位10件を抽出（カウント0のタグも表示）
  const POPULAR_TAGS = (tagsData?.tags || [])
    .sort((a, b) => b.companyCount - a.companyCount)
    .slice(0, 15)
    .map((tag) => ({ name: tag.name, count: tag.companyCount }));

  // 検索ハンドラー
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* メインコンテンツ */}
      <main className="pt-[60px]">
        {/* ヒーローセクション */}
        <section className="relative text-white py-20 overflow-hidden">
          {/* 背景画像 */}
          <div className="absolute inset-0">
            <Image
              src="/images/companies-hero-bg.jpg"
              alt="工務店を探す"
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
                工務店を探す
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8">
                {data?.pagination.total || 0}
                社の工務店から、あなたにぴったりのパートナーを見つけましょう
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
                    placeholder="工務店名や特徴で検索..."
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
                  <h3 className="font-bold text-gray-900 mb-3">得意分野</h3>
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

            {/* 工務店一覧 */}
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
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-gray-600">
                      全{" "}
                      <span className="font-bold text-gray-900">
                        {data.pagination.total}
                      </span>{" "}
                      社の工務店
                    </p>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>おすすめ順</option>
                      <option>施工事例が多い順</option>
                      <option>新着順</option>
                    </select>
                  </div>

                  {/* 空データ */}
                  {data.companies.length === 0 && (
                    <div className="text-center py-20">
                      <p className="text-gray-600 text-lg">
                        条件に一致する工務店が見つかりませんでした
                      </p>
                    </div>
                  )}

                  {/* グリッドレイアウト */}
                  <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {data.companies.map((company) => (
                      <Link
                        key={company.id}
                        href={`/companies/${company.id}`}
                        className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                      >
                        {/* ヘッダー部分 */}
                        <div className="p-6 relative overflow-hidden h-40">
                          {/* 背景画像またはグラデーション */}
                          {company.mainImageUrl ? (
                            <>
                              <Image
                                src={company.mainImageUrl}
                                alt={company.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                              />
                              {/* テキスト視認性向上のためのグラデーションオーバーレイ */}
                              <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-black/70"></div>
                            </>
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-linear-to-br from-red-400 to-orange-400"></div>
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                            </>
                          )}

                          <div className="relative z-10 flex items-center gap-4 h-full">
                            {/* ロゴ/アイコン */}
                            <div className="w-20 h-20 bg-white/90 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                              {company.logoUrl ? (
                                <Image
                                  src={company.logoUrl}
                                  alt={company.name}
                                  fill
                                  sizes="80px"
                                  className="object-cover rounded-2xl"
                                />
                              ) : (
                                <Building2 className="w-10 h-10 text-red-500" />
                              )}
                            </div>

                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-1 group-hover:scale-105 transition-transform duration-300 [text-shadow:0_2px_8px_rgb(0_0_0/80%)]">
                                {company.name}
                              </h3>
                              <div className="flex items-center gap-2 text-white text-sm [text-shadow:0_1px_4px_rgb(0_0_0/60%)]">
                                <MapPin className="w-4 h-4 drop-shadow-lg" />
                                <span>
                                  {company.prefecture} {company.city}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* コンテンツ部分 */}
                        <div className="p-6">
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {company.description}
                          </p>

                          {/* タグ */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {company.tags.slice(0, 3).map((ct) => (
                              <span
                                key={ct.id}
                                className="px-3 py-1 bg-linear-to-r from-red-50 to-orange-50 text-red-700 text-xs font-medium rounded-full border border-red-100"
                              >
                                {ct.tag.name}
                              </span>
                            ))}
                            {company.tags.length > 3 && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                +{company.tags.length - 3}
                              </span>
                            )}
                          </div>

                          {/* メタ情報 */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Briefcase className="w-4 h-4 text-orange-500" />
                              <span>施工事例 {company._count.cases}件</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-bold">4.8</span>
                            </div>
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
