// src/app/cases/page.tsx
// 施工事例一覧ページ（ステップ1: UI実装 - モックデータ使用）

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  TrendingUp,
  Calendar,
  Search,
  Home,
  Menu,
  X,
} from "lucide-react";

// モックデータ
const MOCK_CASES = [
  {
    id: 1,
    title: "自然素材にこだわった和モダンの家",
    description: "無垢材と漆喰壁を使用した、健康的で快適な住空間。",
    prefecture: "愛知県",
    city: "名古屋市中区",
    buildingArea: 120.5,
    budget: 35000000,
    completionYear: 2023,
    mainImageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    company: {
      id: 1,
      name: "株式会社ナゴヤホーム",
      prefecture: "愛知県",
      city: "名古屋市中区",
    },
    tags: [
      { id: 1, tag: { id: 1, name: "和モダン", category: "ATMOSPHERE" } },
      { id: 2, tag: { id: 8, name: "自然素材", category: "PREFERENCE" } },
    ],
    viewCount: 245,
  },
  {
    id: 2,
    title: "都心の狭小地に建つスタイリッシュな3階建て",
    description: "限られた敷地を最大限に活用した機能的なデザイン。",
    prefecture: "愛知県",
    city: "名古屋市東区",
    buildingArea: 85.0,
    budget: 45000000,
    completionYear: 2024,
    mainImageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    company: {
      id: 2,
      name: "東海ハウジング",
      prefecture: "愛知県",
      city: "名古屋市東区",
    },
    tags: [
      { id: 3, tag: { id: 7, name: "狭小住宅", category: "HOUSE_TYPE" } },
      { id: 4, tag: { id: 2, name: "モダン", category: "ATMOSPHERE" } },
    ],
    viewCount: 189,
  },
  {
    id: 3,
    title: "開放的なリビングが特徴の平屋",
    description: "大きな吹き抜けと中庭で、光と風を感じる暮らし。",
    prefecture: "愛知県",
    city: "豊田市",
    buildingArea: 150.0,
    budget: 50000000,
    completionYear: 2023,
    mainImageUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    company: {
      id: 3,
      name: "三河建設",
      prefecture: "愛知県",
      city: "豊田市",
    },
    tags: [
      { id: 5, tag: { id: 5, name: "平屋", category: "HOUSE_TYPE" } },
      { id: 6, tag: { id: 3, name: "ナチュラル", category: "ATMOSPHERE" } },
    ],
    viewCount: 312,
  },
  {
    id: 4,
    title: "高性能住宅で実現する省エネ生活",
    description: "断熱性能と気密性にこだわった、光熱費を抑える家。",
    prefecture: "愛知県",
    city: "一宮市",
    buildingArea: 110.0,
    budget: 38000000,
    completionYear: 2024,
    mainImageUrl:
      "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800",
    company: {
      id: 4,
      name: "尾張工務店",
      prefecture: "愛知県",
      city: "一宮市",
    },
    tags: [
      { id: 7, tag: { id: 9, name: "高気密高断熱", category: "PREFERENCE" } },
      { id: 8, tag: { id: 10, name: "省エネ", category: "PREFERENCE" } },
    ],
    viewCount: 156,
  },
  {
    id: 5,
    title: "北欧スタイルの明るい二世帯住宅",
    description: "家族のつながりを大切にしながら、プライバシーも確保。",
    prefecture: "岐阜県",
    city: "大垣市",
    buildingArea: 180.0,
    budget: 55000000,
    completionYear: 2023,
    mainImageUrl:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    company: {
      id: 5,
      name: "ファミリーホームズ",
      prefecture: "岐阜県",
      city: "大垣市",
    },
    tags: [
      { id: 9, tag: { id: 6, name: "二世帯住宅", category: "HOUSE_TYPE" } },
      { id: 10, tag: { id: 4, name: "北欧スタイル", category: "ATMOSPHERE" } },
    ],
    viewCount: 278,
  },
  {
    id: 6,
    title: "コンパクトながら快適な20坪の家",
    description: "収納の工夫で、狭さを感じさせない住空間を実現。",
    prefecture: "三重県",
    city: "津市",
    buildingArea: 66.0,
    budget: 28000000,
    completionYear: 2024,
    mainImageUrl:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800",
    company: {
      id: 6,
      name: "コンパクトハウス",
      prefecture: "三重県",
      city: "津市",
    },
    tags: [
      { id: 11, tag: { id: 7, name: "狭小住宅", category: "HOUSE_TYPE" } },
      { id: 12, tag: { id: 11, name: "ローコスト", category: "PRICE_RANGE" } },
    ],
    viewCount: 423,
  },
];

const MOCK_PREFECTURES = [
  { prefecture: "愛知県" },
  { prefecture: "岐阜県" },
  { prefecture: "三重県" },
];

const MOCK_TAGS = [
  { id: 1, name: "和モダン", category: "ATMOSPHERE", _count: { cases: 12 } },
  { id: 2, name: "モダン", category: "ATMOSPHERE", _count: { cases: 18 } },
  { id: 3, name: "ナチュラル", category: "ATMOSPHERE", _count: { cases: 15 } },
  {
    id: 4,
    name: "北欧スタイル",
    category: "ATMOSPHERE",
    _count: { cases: 10 },
  },
  { id: 5, name: "平屋", category: "HOUSE_TYPE", _count: { cases: 8 } },
  { id: 6, name: "二世帯住宅", category: "HOUSE_TYPE", _count: { cases: 6 } },
  { id: 7, name: "狭小住宅", category: "HOUSE_TYPE", _count: { cases: 14 } },
  { id: 8, name: "自然素材", category: "PREFERENCE", _count: { cases: 11 } },
  { id: 9, name: "高気密高断熱", category: "PREFERENCE", _count: { cases: 9 } },
  { id: 10, name: "省エネ", category: "PREFERENCE", _count: { cases: 7 } },
];

export default function CasesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalCount = MOCK_CASES.length;
  const currentPage = 1;
  const totalPages = 1;
  const itemsPerPage = 12;
  const searchQuery = "";
  const prefectureFilter = "";
  const tagFilter = "";

  const navItems = [
    { label: "工務店検索", href: "/companies" },
    { label: "施工事例", href: "/cases", active: true },
    { label: "家づくりの流れ", href: "/#process" },
    { label: "無料相談", href: "/#contact" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー（page.tsxのHeaderコンポーネントと同じデザイン） */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        {/* メインヘッダー */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15">
            {/* ロゴ */}
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

            {/* デスクトップナビゲーション */}
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

            {/* デスクトップボタン */}
            <div className="hidden lg:flex items-center gap-3">
              <button className="px-6 py-2.5 text-sm font-bold text-red-600 bg-white border-2 border-red-200 rounded-full hover:bg-red-50 transition-all duration-300 hover:scale-105">
                新規登録
              </button>
              <button className="px-6 py-2.5 text-sm font-bold text-white bg-linear-to-r from-red-500 to-orange-500 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                ログイン
              </button>
            </div>

            {/* モバイルメニューボタン */}
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

        {/* モバイルメニュー */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {/* モバイルナビゲーション */}
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

              {/* モバイルボタン */}
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

      {/* メインコンテンツ（固定ヘッダー分の余白を追加） */}
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
                施工事例を探す
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8">
                {totalCount}件の実例から、あなたの理想の住まいを見つけましょう
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
                  <h3 className="font-bold text-gray-900 mb-3">人気タグ</h3>
                  <div className="space-y-2">
                    <Link
                      href="/cases"
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
                        href={`/cases?tag=${encodeURIComponent(tag.name)}`}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          tagFilter === tag.name
                            ? "bg-linear-to-r from-red-50 to-orange-50 text-red-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {tag.name} ({tag._count.cases})
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* 施工事例グリッド */}
            <div className="lg:col-span-3">
              {/* 結果表示 */}
              <div className="mb-6">
                <p className="text-gray-600">
                  {totalCount}件中 {(currentPage - 1) * itemsPerPage + 1}〜
                  {Math.min(currentPage * itemsPerPage, totalCount)}件を表示
                </p>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                {MOCK_CASES.map((case_) => (
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
                            <span>{(case_.budget / 10000).toFixed(0)}万円</span>
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
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={`/cases?page=${currentPage - 1}`}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      前へ
                    </Link>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Link
                        key={page}
                        href={`/cases?page=${page}`}
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
                      href={`/cases?page=${currentPage + 1}`}
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

      {/* フッター（page.tsxのFooterコンポーネントと同じデザイン） */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* ロゴとキャッチコピー */}
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

            {/* リンク */}
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

          {/* コピーライト */}
          <div className="text-center text-gray-600 text-sm pt-8 border-t border-gray-200">
            © 2026 House Match（仮）. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
