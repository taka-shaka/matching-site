// src/app/companies/page.tsx
// 工務店一覧ページ（UI実装 - モックデータ使用）

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Search,
  Home,
  Menu,
  X,
  Building2,
  Star,
  Briefcase,
} from "lucide-react";

// モックデータ（工務店一覧）
const MOCK_COMPANIES = [
  {
    id: 1,
    name: "株式会社ナゴヤホーム",
    description:
      "愛知県を中心に、お客様の理想の住まいづくりをサポートしています。自然素材を活かした健康住宅が得意です。",
    prefecture: "愛知県",
    city: "名古屋市中区",
    address: "愛知県名古屋市中区栄1-2-3",
    phoneNumber: "052-123-4567",
    email: "info@nagoya-home.co.jp",
    websiteUrl: "https://nagoya-home.co.jp",
    logoUrl: null,
    isPublished: true,
    tags: [
      { tag: { id: 1, name: "和モダン", category: "ATMOSPHERE" } },
      { tag: { id: 8, name: "自然素材", category: "PREFERENCE" } },
    ],
    _count: {
      cases: 12,
    },
  },
  {
    id: 2,
    name: "東海ハウジング",
    description:
      "都市型住宅のプロフェッショナル。狭小地でも快適な住空間を実現します。デザイン性と機能性を両立した家づくりが強みです。",
    prefecture: "愛知県",
    city: "名古屋市東区",
    address: "愛知県名古屋市東区泉1-5-10",
    phoneNumber: "052-234-5678",
    email: "contact@tokai-housing.jp",
    websiteUrl: "https://tokai-housing.jp",
    logoUrl: null,
    isPublished: true,
    tags: [
      { tag: { id: 7, name: "狭小住宅", category: "HOUSE_TYPE" } },
      { tag: { id: 2, name: "モダン", category: "ATMOSPHERE" } },
    ],
    _count: {
      cases: 18,
    },
  },
  {
    id: 3,
    name: "三河建設",
    description:
      "平屋・二世帯住宅の実績豊富。家族のライフスタイルに合わせた設計で、長く快適に暮らせる家を提供します。",
    prefecture: "愛知県",
    city: "豊田市",
    address: "愛知県豊田市若宮町2-20-15",
    phoneNumber: "0565-345-6789",
    email: "info@mikawa-kensetsu.com",
    websiteUrl: null,
    logoUrl: null,
    isPublished: true,
    tags: [
      { tag: { id: 5, name: "平屋", category: "HOUSE_TYPE" } },
      { tag: { id: 6, name: "二世帯住宅", category: "HOUSE_TYPE" } },
    ],
    _count: {
      cases: 15,
    },
  },
  {
    id: 4,
    name: "尾張工務店",
    description:
      "高気密高断熱住宅のパイオニア。省エネで快適な住環境を提供し、光熱費を抑えながら一年中快適に過ごせます。",
    prefecture: "愛知県",
    city: "一宮市",
    address: "愛知県一宮市本町3-10-8",
    phoneNumber: "0586-456-7890",
    email: "owari@koumuten.co.jp",
    websiteUrl: "https://owari-koumuten.co.jp",
    logoUrl: null,
    isPublished: true,
    tags: [
      { tag: { id: 9, name: "高気密高断熱", category: "PREFERENCE" } },
      { tag: { id: 10, name: "省エネ", category: "PREFERENCE" } },
    ],
    _count: {
      cases: 9,
    },
  },
  {
    id: 5,
    name: "岐阜ホームデザイン",
    description:
      "北欧スタイルの住宅が得意。明るく開放的な空間で、家族が自然と集まる温かい家づくりを心がけています。",
    prefecture: "岐阜県",
    city: "岐阜市",
    address: "岐阜県岐阜市長住町5-15-3",
    phoneNumber: "058-567-8901",
    email: "info@gifu-homedesign.jp",
    websiteUrl: "https://gifu-homedesign.jp",
    logoUrl: null,
    isPublished: true,
    tags: [
      { tag: { id: 4, name: "北欧スタイル", category: "ATMOSPHERE" } },
      { tag: { id: 3, name: "ナチュラル", category: "ATMOSPHERE" } },
    ],
    _count: {
      cases: 11,
    },
  },
  {
    id: 6,
    name: "三重コンパクトハウス",
    description:
      "ローコスト住宅専門。限られた予算でも妥協しない品質とデザイン。コストパフォーマンスに優れた家づくりを実現します。",
    prefecture: "三重県",
    city: "津市",
    address: "三重県津市栄町1-8-20",
    phoneNumber: "059-678-9012",
    email: "compact@mie-house.com",
    websiteUrl: null,
    logoUrl: null,
    isPublished: true,
    tags: [
      { tag: { id: 11, name: "ローコスト", category: "PRICE_RANGE" } },
      { tag: { id: 7, name: "狭小住宅", category: "HOUSE_TYPE" } },
    ],
    _count: {
      cases: 14,
    },
  },
];

const MOCK_PREFECTURES = [
  { prefecture: "愛知県" },
  { prefecture: "岐阜県" },
  { prefecture: "三重県" },
];

const MOCK_TAGS = [
  { id: 1, name: "和モダン", category: "ATMOSPHERE", _count: { companies: 5 } },
  { id: 2, name: "モダン", category: "ATMOSPHERE", _count: { companies: 8 } },
  {
    id: 3,
    name: "ナチュラル",
    category: "ATMOSPHERE",
    _count: { companies: 6 },
  },
  {
    id: 4,
    name: "北欧スタイル",
    category: "ATMOSPHERE",
    _count: { companies: 4 },
  },
  { id: 5, name: "平屋", category: "HOUSE_TYPE", _count: { companies: 3 } },
  {
    id: 6,
    name: "二世帯住宅",
    category: "HOUSE_TYPE",
    _count: { companies: 3 },
  },
  { id: 7, name: "狭小住宅", category: "HOUSE_TYPE", _count: { companies: 6 } },
  {
    id: 8,
    name: "自然素材",
    category: "PREFERENCE",
    _count: { companies: 5 },
  },
  {
    id: 9,
    name: "高気密高断熱",
    category: "PREFERENCE",
    _count: { companies: 4 },
  },
  { id: 10, name: "省エネ", category: "PREFERENCE", _count: { companies: 3 } },
];

export default function CompaniesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalCount = MOCK_COMPANIES.length;
  const currentPage = 1;
  const totalPages = 1;
  const itemsPerPage = 12;
  const searchQuery = "";
  const prefectureFilter = "";
  const tagFilter = "";

  const navItems = [
    { label: "工務店検索", href: "/companies", active: true },
    { label: "施工事例", href: "/cases" },
    { label: "家づくりの流れ", href: "/#process" },
    { label: "無料相談", href: "/#contact" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15">
            <Link
              href="/"
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-12 h-12 bg-linear-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Home className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-black text-gray-900 hidden sm:block">
                House Match（仮）
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`text-base font-medium transition-colors duration-200 relative group ${
                    item.active
                      ? "text-red-600 font-bold"
                      : "text-gray-700 hover:text-red-600"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-red-500 to-orange-500 transition-all duration-300 ${
                      item.active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <button className="px-6 py-2.5 text-sm font-bold text-red-600 bg-white border-2 border-red-200 rounded-full hover:bg-red-50 transition-all duration-300 hover:scale-105">
                新規登録
              </button>
              <button className="px-6 py-2.5 text-sm font-bold text-white bg-linear-to-r from-red-500 to-orange-500 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                ログイン
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-3 px-4 text-base font-medium rounded-xl transition-all duration-200 ${
                    item.active
                      ? "text-red-600 bg-red-50 font-bold"
                      : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 space-y-3 border-t border-gray-200">
                <button className="w-full px-6 py-3 text-sm font-bold text-red-600 bg-white border-2 border-red-200 rounded-full hover:bg-red-50 transition-all duration-300">
                  新規登録
                </button>
                <button className="w-full px-6 py-3 text-sm font-bold text-white bg-linear-to-r from-red-500 to-orange-500 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                  ログイン
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* メインコンテンツ */}
      <main className="pt-[60px]">
        {/* ヒーローセクション */}
        <section className="relative bg-linear-to-br from-red-500 to-orange-500 text-white py-20 overflow-hidden">
          {/* 背景装飾 */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-black mb-6">
                工務店を探す
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8">
                {totalCount}
                社の工務店から、あなたにぴったりのパートナーを見つけましょう
              </p>

              {/* 検索バー */}
              <form
                method="GET"
                className="max-w-2xl mx-auto bg-white rounded-full p-2 shadow-2xl"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-gray-400 ml-4" />
                  <input
                    type="text"
                    name="search"
                    defaultValue={searchQuery}
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
                    name="prefecture"
                    defaultValue={prefectureFilter}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">すべて</option>
                    {MOCK_PREFECTURES.map((p) => (
                      <option key={p.prefecture} value={p.prefecture}>
                        {p.prefecture}
                      </option>
                    ))}
                  </select>
                </div>

                {/* タグフィルター */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">得意分野</h3>
                  <div className="space-y-2">
                    <Link
                      href="/companies"
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        !tagFilter
                          ? "bg-linear-to-r from-red-50 to-orange-50 text-red-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      すべて ({totalCount})
                    </Link>
                    {MOCK_TAGS.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/companies?tag=${encodeURIComponent(tag.name)}`}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          tagFilter === tag.name
                            ? "bg-linear-to-r from-red-50 to-orange-50 text-red-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {tag.name} ({tag._count.companies})
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* 工務店一覧 */}
            <div className="lg:col-span-3">
              {/* 結果表示 */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">
                  全{" "}
                  <span className="font-bold text-gray-900">{totalCount}</span>{" "}
                  社の工務店
                </p>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>おすすめ順</option>
                  <option>施工事例が多い順</option>
                  <option>新着順</option>
                </select>
              </div>

              {/* グリッドレイアウト */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {MOCK_COMPANIES.map((company) => (
                  <Link
                    key={company.id}
                    href={`/companies/${company.id}`}
                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                  >
                    {/* ヘッダー部分 */}
                    <div className="bg-linear-to-br from-red-400 to-orange-400 p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

                      <div className="relative flex items-center gap-4">
                        {/* ロゴ/アイコン */}
                        <div className="w-20 h-20 bg-white/90 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Building2 className="w-10 h-10 text-red-500" />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1 group-hover:scale-105 transition-transform duration-300">
                            {company.name}
                          </h3>
                          <div className="flex items-center gap-2 text-white/90 text-sm">
                            <MapPin className="w-4 h-4" />
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
                        {company.tags.slice(0, 3).map((ct, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-linear-to-r from-red-50 to-orange-50 text-red-700 text-xs font-medium rounded-full border border-red-100"
                          >
                            {ct.tag.name}
                          </span>
                        ))}
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
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={`/companies?page=${currentPage - 1}`}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      前へ
                    </Link>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Link
                        key={page}
                        href={`/companies?page=${page}`}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          page === currentPage
                            ? "bg-linear-to-r from-red-500 to-orange-500 text-white font-bold"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </Link>
                    )
                  )}

                  {currentPage < totalPages && (
                    <Link
                      href={`/companies?page=${currentPage + 1}`}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      次へ
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                </div>
                <span className="text-2xl font-black text-gray-900">
                  House Match
                </span>
              </div>
              <p className="text-gray-600 mb-4">理想の住まいと出会える</p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">サービス</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link
                    href="/companies"
                    className="hover:text-red-600 transition-colors"
                  >
                    工務店を探す
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cases"
                    className="hover:text-red-600 transition-colors"
                  >
                    施工事例
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#contact"
                    className="hover:text-red-600 transition-colors"
                  >
                    よくある質問
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">会社情報</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-red-600 transition-colors">
                    運営会社
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-red-600 transition-colors">
                    利用規約
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-red-600 transition-colors">
                    プライバシーポリシー
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center text-gray-600 text-sm pt-8 border-t border-gray-200">
            © 2026 House Match（仮）. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
