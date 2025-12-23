// src/app/cases/[id]/page.tsx
// 施工事例詳細ページ（UI実装 - モックデータ使用）

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  TrendingUp,
  Calendar,
  Home,
  Menu,
  X,
  Building2,
  Ruler,
  Mail,
  Phone,
  Globe,
  ChevronLeft,
  Share2,
} from "lucide-react";

// モックデータ（施工事例詳細）
const MOCK_CASE = {
  id: 1,
  title: "自然素材にこだわった和モダンの家",
  description:
    "無垢材と漆喰壁を使用した、健康的で快適な住空間。家族の健康を第一に考え、自然素材をふんだんに使用しました。リビングには大きな吹き抜けを設け、光と風が家中を巡る設計に。キッチンは奥様のこだわりが詰まったオーダーメイド。収納も充実させ、暮らしやすさを追求しています。",
  prefecture: "愛知県",
  city: "名古屋市中区",
  buildingArea: 120.5,
  budget: 35000000,
  completionYear: 2023,
  status: "PUBLISHED",
  viewCount: 245,
  publishedAt: "2023-06-15",
  mainImageUrl:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
  images: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
  ],
  company: {
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
  },
  tags: [
    { id: 1, tag: { id: 1, name: "和モダン", category: "ATMOSPHERE" } },
    { id: 2, tag: { id: 8, name: "自然素材", category: "PREFERENCE" } },
    { id: 3, tag: { id: 9, name: "高気密高断熱", category: "PREFERENCE" } },
  ],
  author: {
    id: 1,
    name: "山田太郎",
  },
};

// 関連する施工事例（モックデータ）
const RELATED_CASES = [
  {
    id: 2,
    title: "都心の狭小地に建つスタイリッシュな3階建て",
    prefecture: "愛知県",
    city: "名古屋市東区",
    budget: 45000000,
    mainImageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
    company: { name: "東海ハウジング" },
  },
  {
    id: 3,
    title: "開放的なリビングが特徴の平屋",
    prefecture: "愛知県",
    city: "豊田市",
    budget: 50000000,
    mainImageUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400",
    company: { name: "三河建設" },
  },
  {
    id: 4,
    title: "高性能住宅で実現する省エネ生活",
    prefecture: "愛知県",
    city: "一宮市",
    budget: 38000000,
    mainImageUrl:
      "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=400",
    company: { name: "尾張工務店" },
  },
];

export default function CaseDetailPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const navItems = [
    { label: "工務店検索", href: "/companies" },
    { label: "施工事例", href: "/cases", active: true },
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
        {/* パンくずリスト */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-red-600 transition">
                ホーム
              </Link>
              <span>/</span>
              <Link href="/cases" className="hover:text-red-600 transition">
                施工事例
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">
                {MOCK_CASE.title}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* メインコンテンツ */}
            <div className="lg:col-span-2">
              {/* 戻るボタン */}
              <Link
                href="/cases"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition mb-6"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>施工事例一覧に戻る</span>
              </Link>

              {/* タイトルエリア */}
              <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                  {MOCK_CASE.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <span>
                      {MOCK_CASE.prefecture} {MOCK_CASE.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <span>{MOCK_CASE.completionYear}年竣工</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span>{(MOCK_CASE.budget / 10000).toFixed(0)}万円</span>
                  </div>
                </div>

                {/* タグ */}
                <div className="flex flex-wrap gap-2">
                  {MOCK_CASE.tags.map((ct) => (
                    <span
                      key={ct.id}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-linear-to-r from-red-50 to-orange-50 text-red-700 border border-red-100"
                    >
                      {ct.tag.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* 画像ギャラリー */}
              <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="h-1 w-6 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
                  写真ギャラリー
                </h2>

                {/* メイン画像 */}
                <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={MOCK_CASE.images[selectedImage]}
                    alt={`${MOCK_CASE.title} - 画像${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* サムネイル */}
                <div className="grid grid-cols-4 gap-4">
                  {MOCK_CASE.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-video bg-gray-200 rounded-lg overflow-hidden transition-all ${
                        selectedImage === idx
                          ? "ring-4 ring-red-500 scale-95"
                          : "hover:scale-105"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`サムネイル${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* 物件詳細 */}
              <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="h-1 w-6 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
                  物件詳細
                </h2>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">都道府県</div>
                    <div className="text-lg font-bold text-gray-900">
                      {MOCK_CASE.prefecture}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">市区町村</div>
                    <div className="text-lg font-bold text-gray-900">
                      {MOCK_CASE.city}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">延床面積</div>
                    <div className="text-lg font-bold text-gray-900">
                      {MOCK_CASE.buildingArea}㎡
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">建築費用</div>
                    <div className="text-lg font-bold text-gray-900">
                      {(MOCK_CASE.budget / 10000).toFixed(0)}万円
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">竣工年</div>
                    <div className="text-lg font-bold text-gray-900">
                      {MOCK_CASE.completionYear}年
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">閲覧数</div>
                    <div className="text-lg font-bold text-gray-900">
                      {MOCK_CASE.viewCount}回
                    </div>
                  </div>
                </div>
              </div>

              {/* 説明 */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="h-1 w-6 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
                  物件の説明
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {MOCK_CASE.description}
                </p>
              </div>
            </div>

            {/* サイドバー */}
            <div className="lg:col-span-1">
              {/* 工務店情報 */}
              <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  この事例を手がけた工務店
                </h3>

                <Link
                  href={`/companies/${MOCK_CASE.company.id}`}
                  className="block group"
                >
                  {/* 工務店ロゴ/アイコン */}
                  <div className="w-20 h-20 bg-linear-to-br from-red-400 to-orange-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition">
                    {MOCK_CASE.company.name}
                  </h4>
                </Link>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {MOCK_CASE.company.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{MOCK_CASE.company.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>{MOCK_CASE.company.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="truncate">{MOCK_CASE.company.email}</span>
                  </div>
                  {MOCK_CASE.company.websiteUrl && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4 text-green-500 shrink-0" />
                      <a
                        href={MOCK_CASE.company.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        公式サイト
                      </a>
                    </div>
                  )}
                </div>

                <Link
                  href={`/companies/${MOCK_CASE.company.id}`}
                  className="block w-full px-6 py-3 bg-linear-to-r from-red-500 to-orange-500 text-white text-center rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 mb-3"
                >
                  工務店の詳細を見る
                </Link>

                <button className="w-full px-6 py-3 text-red-600 bg-white border-2 border-red-200 text-center rounded-full font-bold hover:bg-red-50 transition-all duration-300">
                  この工務店に問い合わせ
                </button>
              </div>

              {/* シェアボタン */}
              <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  この事例をシェア
                </h3>
                <button className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  <span>シェアする</span>
                </button>
              </div>
            </div>
          </div>

          {/* 関連する施工事例 */}
          <div className="mt-16">
            <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <div className="h-1 w-8 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
              関連する施工事例
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RELATED_CASES.map((relatedCase) => (
                <Link
                  key={relatedCase.id}
                  href={`/cases/${relatedCase.id}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={relatedCase.mainImageUrl}
                      alt={relatedCase.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition">
                      {relatedCase.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                      <span>
                        {relatedCase.prefecture} {relatedCase.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <TrendingUp className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>{(relatedCase.budget / 10000).toFixed(0)}万円</span>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        {relatedCase.company.name}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
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
