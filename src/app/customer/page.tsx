"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  MessageSquare,
  Heart,
  TrendingUp,
  ArrowRight,
  Building2,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react";
import CustomerSidebar from "@/components/customer/CustomerSidebar";

// モックデータ
const MOCK_CUSTOMER = {
  id: 1,
  firstName: "花子",
  lastName: "山田",
  email: "hanako.yamada@example.com",
  phoneNumber: "090-1234-5678",
};

const MOCK_RECENT_INQUIRIES = [
  {
    id: 1,
    companyName: "株式会社ナゴヤホーム",
    caseTitle: "自然素材にこだわった和モダンの家",
    status: "IN_PROGRESS",
    createdAt: "2024-12-20T10:30:00",
  },
  {
    id: 2,
    companyName: "株式会社豊田ハウジング",
    caseTitle: "開放的なリビングが魅力の家",
    status: "RESOLVED",
    createdAt: "2024-12-18T14:15:00",
  },
  {
    id: 3,
    companyName: "岐阜建設株式会社",
    caseTitle: null,
    status: "NEW",
    createdAt: "2024-12-22T09:00:00",
  },
];

const MOCK_RECOMMENDED_CASES = [
  {
    id: 1,
    title: "自然素材にこだわった和モダンの家",
    companyName: "株式会社ナゴヤホーム",
    prefecture: "愛知県",
    city: "名古屋市中区",
    budget: 3500,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
  },
  {
    id: 2,
    title: "開放的なリビングが魅力の家",
    companyName: "株式会社豊田ハウジング",
    prefecture: "愛知県",
    city: "豊田市",
    budget: 4200,
    imageUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400",
  },
  {
    id: 3,
    title: "モダンデザインの二世帯住宅",
    companyName: "岐阜建設株式会社",
    prefecture: "岐阜県",
    city: "岐阜市",
    budget: 5000,
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
  },
];

const STATUS_CONFIG = {
  NEW: {
    label: "新規",
    icon: MessageSquare,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  IN_PROGRESS: {
    label: "対応中",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  RESOLVED: {
    label: "解決済み",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  CLOSED: {
    label: "クローズ",
    icon: CheckCircle,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
};

export default function CustomerDashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const stats = {
    totalInquiries: MOCK_RECENT_INQUIRIES.length,
    activeInquiries: MOCK_RECENT_INQUIRIES.filter(
      (i) => i.status === "IN_PROGRESS" || i.status === "NEW"
    ).length,
    resolvedInquiries: MOCK_RECENT_INQUIRIES.filter(
      (i) => i.status === "RESOLVED"
    ).length,
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50">
      {/* サイドバー */}
      <CustomerSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        customerName={`${MOCK_CUSTOMER.lastName} ${MOCK_CUSTOMER.firstName}`}
        customerEmail={MOCK_CUSTOMER.email}
      />

      {/* メインコンテンツ */}
      <div className="lg:pl-64">
        {/* トップバー */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white border-b border-gray-200">
          <button
            type="button"
            className="px-4 text-gray-500 lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex flex-1 items-center">
              <h1 className="text-2xl font-black text-gray-900">
                ダッシュボード
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {MOCK_CUSTOMER.lastName} {MOCK_CUSTOMER.firstName}さん
              </span>
            </div>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <main className="p-4 lg:p-8">
          {/* ウェルカムメッセージ */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              ようこそ、{MOCK_CUSTOMER.lastName}さん！
            </h2>
            <p className="text-gray-600">理想の住まいづくりをサポートします</p>
          </div>

          {/* 統計カード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 総問い合わせ数 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">総問い合わせ数</p>
              <p className="text-3xl font-black text-gray-900">
                {stats.totalInquiries}
              </p>
            </div>

            {/* 対応中 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">対応中の問い合わせ</p>
              <p className="text-3xl font-black text-gray-900">
                {stats.activeInquiries}
              </p>
            </div>

            {/* 解決済み */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">解決済み</p>
              <p className="text-3xl font-black text-gray-900">
                {stats.resolvedInquiries}
              </p>
            </div>
          </div>

          {/* 最近の問い合わせ */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-gray-900">
                最近の問い合わせ
              </h3>
              <Link
                href="/customer/inquiries"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                すべて見る
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {MOCK_RECENT_INQUIRIES.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">まだ問い合わせがありません</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {MOCK_RECENT_INQUIRIES.map((inquiry) => {
                    const statusConfig =
                      STATUS_CONFIG[
                        inquiry.status as keyof typeof STATUS_CONFIG
                      ];
                    const StatusIcon = statusConfig.icon;
                    return (
                      <Link
                        key={inquiry.id}
                        href={`/customer/inquiries/${inquiry.id}`}
                        className="block p-6 hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Building2 className="h-5 w-5 text-gray-400" />
                              <p className="font-bold text-gray-900">
                                {inquiry.companyName}
                              </p>
                            </div>
                            {inquiry.caseTitle && (
                              <div className="flex items-center gap-3 mb-2">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <p className="text-sm text-gray-600">
                                  {inquiry.caseTitle}
                                </p>
                              </div>
                            )}
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <Calendar className="h-4 w-4" />
                              {formatDate(inquiry.createdAt)}
                            </div>
                          </div>
                          <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bgColor}`}
                          >
                            <StatusIcon
                              className={`h-4 w-4 ${statusConfig.color}`}
                            />
                            <span
                              className={`text-xs font-bold ${statusConfig.color}`}
                            >
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* おすすめ施工事例 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-gray-900">
                おすすめの施工事例
              </h3>
              <Link
                href="/cases"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                もっと見る
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_RECOMMENDED_CASES.map((caseItem) => (
                <Link
                  key={caseItem.id}
                  href={`/cases/${caseItem.id}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={caseItem.imageUrl}
                      alt={caseItem.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {caseItem.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {caseItem.companyName}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {caseItem.prefecture} {caseItem.city}
                      </span>
                      <span className="font-bold text-blue-600">
                        {caseItem.budget}万円
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CTAボタン */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/cases"
              className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white hover:shadow-xl transition group"
            >
              <FileText className="h-12 w-12 mb-4 opacity-80" />
              <h4 className="text-xl font-black mb-2">施工事例を探す</h4>
              <p className="text-sm opacity-90 mb-4">
                理想の住まいのイメージを見つけよう
              </p>
              <div className="flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all">
                探す
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            <Link
              href="/companies"
              className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white hover:shadow-xl transition group"
            >
              <Building2 className="h-12 w-12 mb-4 opacity-80" />
              <h4 className="text-xl font-black mb-2">工務店を探す</h4>
              <p className="text-sm opacity-90 mb-4">
                信頼できるパートナーを見つけよう
              </p>
              <div className="flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all">
                探す
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
