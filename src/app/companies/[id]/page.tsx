// src/app/companies/[id]/page.tsx
// 工務店詳細ページ（UI実装 - モックデータ使用）

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  TrendingUp,
  Home,
  Menu,
  X,
  Building2,
  Mail,
  Phone,
  Globe,
  ChevronLeft,
  Share2,
  Users,
  Award,
  Clock,
  Star,
  MessageCircle,
  ExternalLink,
  Calendar,
} from "lucide-react";

// モックデータ（工務店詳細）
const MOCK_COMPANY = {
  id: 1,
  name: "株式会社ナゴヤホーム",
  description:
    "愛知県を中心に、お客様の理想の住まいづくりをサポートしています。自然素材を活かした健康住宅が得意です。創業以来30年以上にわたり、地域密着型の家づくりを続けてきました。お客様一人ひとりのライフスタイルに合わせた、オーダーメイドの住まいをご提案いたします。",
  prefecture: "愛知県",
  city: "名古屋市中区",
  address: "愛知県名古屋市中区栄1-2-3",
  phoneNumber: "052-123-4567",
  email: "info@nagoya-home.co.jp",
  websiteUrl: "https://nagoya-home.co.jp",
  logoUrl: null,
  isPublished: true,
  createdAt: "1993-04-01",
  establishedYear: 1993,
  employeeCount: 25,
  rating: 4.8,
  reviewCount: 48,
  tags: [
    { id: 1, tag: { id: 1, name: "和モダン", category: "ATMOSPHERE" } },
    { id: 2, tag: { id: 8, name: "自然素材", category: "PREFERENCE" } },
    { id: 3, tag: { id: 9, name: "高気密高断熱", category: "PREFERENCE" } },
    { id: 4, tag: { id: 2, name: "平屋", category: "HOUSE_TYPE" } },
  ],
  features: [
    {
      title: "自然素材へのこだわり",
      description:
        "無垢材、漆喰、珪藻土など、自然由来の素材を積極的に採用。健康で快適な住環境を実現します。",
    },
    {
      title: "高い断熱性能",
      description:
        "次世代省エネ基準を大幅に上回る断熱性能。冷暖房費を抑え、一年中快適に過ごせます。",
    },
    {
      title: "地域密着30年",
      description:
        "愛知県での豊富な施工実績。地域の気候や風土を熟知したプロの提案力が強みです。",
    },
    {
      title: "充実のアフターサービス",
      description:
        "定期点検、メンテナンスまで長期的にサポート。建てた後も安心してお任せいただけます。",
    },
  ],
  _count: {
    cases: 12,
  },
};

// 施工事例（この工務店の事例）
const COMPANY_CASES = [
  {
    id: 1,
    title: "自然素材にこだわった和モダンの家",
    prefecture: "愛知県",
    city: "名古屋市中区",
    budget: 35000000,
    completionYear: 2023,
    mainImageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
    tags: [{ tag: { name: "和モダン" } }, { tag: { name: "自然素材" } }],
  },
  {
    id: 2,
    title: "開放的な吹き抜けリビングのある家",
    prefecture: "愛知県",
    city: "春日井市",
    budget: 42000000,
    completionYear: 2023,
    mainImageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
    tags: [{ tag: { name: "モダン" } }, { tag: { name: "吹き抜け" } }],
  },
  {
    id: 3,
    title: "平屋で叶える快適な暮らし",
    prefecture: "愛知県",
    city: "豊田市",
    budget: 38000000,
    completionYear: 2024,
    mainImageUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400",
    tags: [{ tag: { name: "平屋" } }, { tag: { name: "自然素材" } }],
  },
  {
    id: 4,
    title: "高性能住宅で省エネ生活",
    prefecture: "愛知県",
    city: "一宮市",
    budget: 40000000,
    completionYear: 2024,
    mainImageUrl:
      "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=400",
    tags: [{ tag: { name: "高気密高断熱" } }, { tag: { name: "省エネ" } }],
  },
  {
    id: 5,
    title: "家族の成長を見守る二世帯住宅",
    prefecture: "愛知県",
    city: "岡崎市",
    budget: 55000000,
    completionYear: 2023,
    mainImageUrl:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400",
    tags: [{ tag: { name: "二世帯住宅" } }, { tag: { name: "和モダン" } }],
  },
  {
    id: 6,
    title: "都市型コンパクト住宅の提案",
    prefecture: "愛知県",
    city: "名古屋市東区",
    budget: 32000000,
    completionYear: 2024,
    mainImageUrl:
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=400",
    tags: [{ tag: { name: "コンパクト" } }, { tag: { name: "都市型" } }],
  },
];

// 関連する工務店（モックデータ）
const RELATED_COMPANIES = [
  {
    id: 2,
    name: "東海ハウジング",
    description:
      "モダンでスタイリッシュなデザインが得意な工務店。都市型住宅の実績が豊富です。",
    prefecture: "愛知県",
    city: "名古屋市東区",
    tags: [{ tag: { name: "モダン" } }, { tag: { name: "都市型" } }],
    _count: { cases: 15 },
    rating: 4.7,
  },
  {
    id: 3,
    name: "三河建設",
    description:
      "伝統的な日本建築の技術を活かした、こだわりの家づくりを行っています。",
    prefecture: "愛知県",
    city: "豊田市",
    tags: [{ tag: { name: "和風" } }, { tag: { name: "伝統工法" } }],
    _count: { cases: 10 },
    rating: 4.9,
  },
  {
    id: 4,
    name: "尾張工務店",
    description:
      "高性能住宅を適正価格で。コストパフォーマンスの高い家づくりを実現します。",
    prefecture: "愛知県",
    city: "一宮市",
    tags: [{ tag: { name: "高性能" } }, { tag: { name: "コスパ" } }],
    _count: { cases: 8 },
    rating: 4.6,
  },
];

export default function CompanyDetailPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        {/* パンくずリスト */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-red-600 transition">
                ホーム
              </Link>
              <span>/</span>
              <Link href="/companies" className="hover:text-red-600 transition">
                工務店検索
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">
                {MOCK_COMPANY.name}
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
                href="/companies"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition mb-6"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>工務店一覧に戻る</span>
              </Link>

              {/* 工務店基本情報 */}
              <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                {/* ロゴ・名前 */}
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-24 h-24 bg-linear-to-br from-red-400 to-orange-400 rounded-2xl flex items-center justify-center shrink-0">
                    <Building2 className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                      {MOCK_COMPANY.name}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <span>
                        {MOCK_COMPANY.prefecture} {MOCK_COMPANY.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-gray-900">
                          {MOCK_COMPANY.rating}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({MOCK_COMPANY.reviewCount}件)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* タグ */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {MOCK_COMPANY.tags.map((ct) => (
                    <span
                      key={ct.id}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-linear-to-r from-red-50 to-orange-50 text-red-700 border border-red-100"
                    >
                      {ct.tag.name}
                    </span>
                  ))}
                </div>

                {/* 統計情報 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-orange-500 mb-1">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                      {new Date().getFullYear() - MOCK_COMPANY.establishedYear}
                      年
                    </div>
                    <div className="text-sm text-gray-500">創業年数</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-blue-500 mb-1">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                      {MOCK_COMPANY.employeeCount}人
                    </div>
                    <div className="text-sm text-gray-500">従業員数</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-green-500 mb-1">
                      <Home className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                      {MOCK_COMPANY._count.cases}件
                    </div>
                    <div className="text-sm text-gray-500">施工事例</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-yellow-500 mb-1">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                      {MOCK_COMPANY.rating}
                    </div>
                    <div className="text-sm text-gray-500">評価</div>
                  </div>
                </div>
              </div>

              {/* 会社の説明 */}
              <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="h-1 w-6 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
                  会社について
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {MOCK_COMPANY.description}
                </p>
              </div>

              {/* 特徴・強み */}
              <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="h-1 w-6 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
                  特徴・強み
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {MOCK_COMPANY.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="p-6 bg-linear-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-linear-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center shrink-0">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 pt-1">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 施工事例 */}
              <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <div className="h-1 w-6 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
                    施工事例 ({MOCK_COMPANY._count.cases}件)
                  </h2>
                  <Link
                    href="/cases"
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    すべて見る
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {COMPANY_CASES.map((caseItem) => (
                    <Link
                      key={caseItem.id}
                      href={`/cases/${caseItem.id}`}
                      className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="aspect-video bg-gray-200 overflow-hidden">
                        <img
                          src={caseItem.mainImageUrl}
                          alt={caseItem.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition">
                          {caseItem.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                          <span>
                            {caseItem.prefecture} {caseItem.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <TrendingUp className="w-4 h-4 text-orange-500 shrink-0" />
                          <span>
                            {(caseItem.budget / 10000).toFixed(0)}万円
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {caseItem.tags.slice(0, 2).map((ct, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200"
                            >
                              {ct.tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 会社情報 */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="h-1 w-6 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
                  会社情報
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="text-sm text-gray-500 w-24 shrink-0 pt-1">
                      会社名
                    </div>
                    <div className="text-base font-medium text-gray-900">
                      {MOCK_COMPANY.name}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="text-sm text-gray-500 w-24 shrink-0 pt-1">
                      所在地
                    </div>
                    <div className="text-base text-gray-900">
                      {MOCK_COMPANY.address}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="text-sm text-gray-500 w-24 shrink-0 pt-1">
                      電話番号
                    </div>
                    <div className="text-base text-gray-900">
                      {MOCK_COMPANY.phoneNumber}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="text-sm text-gray-500 w-24 shrink-0 pt-1">
                      メール
                    </div>
                    <div className="text-base text-gray-900">
                      {MOCK_COMPANY.email}
                    </div>
                  </div>
                  {MOCK_COMPANY.websiteUrl && (
                    <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                      <div className="text-sm text-gray-500 w-24 shrink-0 pt-1">
                        ウェブサイト
                      </div>
                      <a
                        href={MOCK_COMPANY.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base text-blue-600 hover:underline flex items-center gap-1"
                      >
                        公式サイトを見る
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="text-sm text-gray-500 w-24 shrink-0 pt-1">
                      創業年
                    </div>
                    <div className="text-base text-gray-900">
                      {MOCK_COMPANY.establishedYear}年
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* サイドバー */}
            <div className="lg:col-span-1">
              {/* お問い合わせカード */}
              <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  この工務店に問い合わせる
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                    <span>通常24時間以内に返信</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MessageCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span>無料相談受付中</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full px-6 py-3 bg-linear-to-r from-red-500 to-orange-500 text-white text-center rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" />
                    <span>メールで問い合わせ</span>
                  </button>
                  <button className="w-full px-6 py-3 text-red-600 bg-white border-2 border-red-200 text-center rounded-full font-bold hover:bg-red-50 transition-all duration-300 flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    <span>電話で問い合わせ</span>
                  </button>
                </div>

                <div className="mt-6 p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-bold text-blue-700">
                      無料相談実施中！
                    </span>
                    <br />
                    家づくりに関するご相談や見学会の予約など、お気軽にお問い合わせください。
                  </p>
                </div>
              </div>

              {/* シェアボタン */}
              <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  この工務店をシェア
                </h3>
                <button className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  <span>シェアする</span>
                </button>
              </div>
            </div>
          </div>

          {/* 関連する工務店 */}
          <div className="mt-16">
            <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <div className="h-1 w-8 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
              この工務店に似た条件の工務店
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RELATED_COMPANIES.map((company) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.id}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* ヘッダー */}
                  <div className="bg-linear-to-br from-red-400 to-orange-400 p-6">
                    <div className="w-20 h-20 bg-white/90 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Building2 className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:scale-105 transition-transform">
                      {company.name}
                    </h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>
                        {company.prefecture} {company.city}
                      </span>
                    </div>
                  </div>

                  {/* コンテンツ */}
                  <div className="p-6">
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                      {company.description}
                    </p>

                    {/* タグ */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {company.tags.slice(0, 3).map((ct, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-red-50 to-orange-50 text-red-700 border border-red-100"
                        >
                          {ct.tag.name}
                        </span>
                      ))}
                    </div>

                    {/* メトリクス */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Home className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">
                          施工事例 {company._count.cases}件
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-gray-900">
                          {company.rating}
                        </span>
                      </div>
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
