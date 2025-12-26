// src/app/member/page.tsx
// メンバーダッシュボードトップ（UI実装 - モックデータ使用）

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Eye,
  Star,
  Calendar,
  Menu,
  Settings,
  PlusCircle,
  FileText,
  MessageSquare,
} from "lucide-react";
import MemberSidebar from "@/components/member/MemberSidebar";

// モックデータ（ログイン中の工務店メンバー情報）
const MOCK_MEMBER = {
  id: 1,
  name: "山田太郎",
  email: "yamada@nagoya-home.co.jp",
  role: "ADMIN", // ADMIN or GENERAL
  company: {
    id: 1,
    name: "株式会社ナゴヤホーム",
    prefecture: "愛知県",
    city: "名古屋市中区",
  },
};

// モックデータ（統計情報）
const MOCK_STATS = {
  totalCases: 12,
  publishedCases: 10,
  draftCases: 2,
  totalViews: 2450,
  totalInquiries: 28,
  newInquiries: 5,
  avgRating: 4.8,
  reviewCount: 48,
};

// モックデータ（最近の施工事例）
const RECENT_CASES = [
  {
    id: 1,
    title: "自然素材にこだわった和モダンの家",
    status: "PUBLISHED",
    viewCount: 245,
    publishedAt: "2024-01-15",
    mainImageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
  },
  {
    id: 2,
    title: "開放的な吹き抜けリビングのある家",
    status: "PUBLISHED",
    viewCount: 189,
    publishedAt: "2024-01-10",
    mainImageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
  },
  {
    id: 3,
    title: "平屋で叶える快適な暮らし",
    status: "DRAFT",
    viewCount: 0,
    publishedAt: null,
    mainImageUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400",
  },
];

// モックデータ（最近の問い合わせ）
const RECENT_INQUIRIES = [
  {
    id: 1,
    inquirerName: "田中花子",
    message: "自然素材の家について詳しく知りたいです...",
    status: "NEW",
    createdAt: "2024-01-20T10:30:00",
  },
  {
    id: 2,
    inquirerName: "佐藤次郎",
    message: "見学会の日程について教えてください...",
    status: "IN_PROGRESS",
    createdAt: "2024-01-19T15:20:00",
  },
  {
    id: 3,
    inquirerName: "鈴木三郎",
    message: "予算3500万円で建てられますか？...",
    status: "RESOLVED",
    createdAt: "2024-01-18T09:15:00",
  },
];

export default function MemberDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full">
            公開中
          </span>
        );
      case "DRAFT":
        return (
          <span className="px-2 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded-full">
            下書き
          </span>
        );
      default:
        return null;
    }
  };

  const getInquiryStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return (
          <span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full">
            未対応
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-700 rounded-full">
            対応中
          </span>
        );
      case "RESOLVED":
        return (
          <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full">
            解決済み
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* サイドバー */}
      <MemberSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        memberName={MOCK_MEMBER.name}
        memberRole={MOCK_MEMBER.role}
        companyName={MOCK_MEMBER.company.name}
        companyPrefecture={MOCK_MEMBER.company.prefecture}
        companyCity={MOCK_MEMBER.company.city}
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
            <div className="ml-4 flex items-center space-x-4">
              <Link
                href="/member/cases/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg text-white bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition shadow-md hover:shadow-lg"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                新規作成
              </Link>
              <Link
                href="/member/company"
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Settings className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>

        {/* ダッシュボードコンテンツ */}
        <main className="flex-1 p-6 lg:p-8">
          {/* 統計カード */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* 施工事例数 */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">
                  施工事例
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">
                {MOCK_STATS.totalCases}件
              </div>
              <p className="text-sm text-gray-600">
                公開中: {MOCK_STATS.publishedCases}件 / 下書き:{" "}
                {MOCK_STATS.draftCases}件
              </p>
            </div>

            {/* 閲覧数 */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">
                  総閲覧数
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">
                {MOCK_STATS.totalViews.toLocaleString()}
              </div>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                今月+15%
              </p>
            </div>

            {/* 問い合わせ */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <MessageSquare className="h-6 w-6 text-orange-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">
                  問い合わせ
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">
                {MOCK_STATS.totalInquiries}件
              </div>
              <p className="text-sm text-red-600">
                未対応: {MOCK_STATS.newInquiries}件
              </p>
            </div>

            {/* 評価 */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">
                  平均評価
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">
                {MOCK_STATS.avgRating}
              </div>
              <p className="text-sm text-gray-600">
                {MOCK_STATS.reviewCount}件のレビュー
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 最近の施工事例 */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  最近の施工事例
                </h2>
                <Link
                  href="/member/cases"
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  すべて見る →
                </Link>
              </div>

              <div className="space-y-4">
                {RECENT_CASES.map((caseItem) => (
                  <Link
                    key={caseItem.id}
                    href={`/member/cases/${caseItem.id}/edit`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={caseItem.mainImageUrl}
                        alt={caseItem.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {caseItem.title}
                        </p>
                        {getStatusBadge(caseItem.status)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {caseItem.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {caseItem.publishedAt}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {caseItem.viewCount}回
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 最近の問い合わせ */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  最近の問い合わせ
                </h2>
                <Link
                  href="/member/inquiries"
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  すべて見る →
                </Link>
              </div>

              <div className="space-y-4">
                {RECENT_INQUIRIES.map((inquiry) => (
                  <Link
                    key={inquiry.id}
                    href={`/member/inquiries#inquiry-${inquiry.id}`}
                    className="block p-3 rounded-xl hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-bold text-gray-900">
                        {inquiry.inquirerName}
                      </p>
                      {getInquiryStatusBadge(inquiry.status)}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {inquiry.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(inquiry.createdAt).toLocaleString("ja-JP")}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
