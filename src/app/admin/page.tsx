// src/app/admin/page.tsx
// 管理者ダッシュボードトップページ（UI実装 - モックデータ使用）

"use client";

import { useState } from "react";
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  Eye,
  MessageSquare,
  CheckCircle,
  Menu,
  UserCircle,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

// モックデータ
const MOCK_ADMIN = {
  id: 1,
  name: "管理者 太郎",
  email: "admin@matching-site.jp",
  role: "SUPER_ADMIN",
};

// 統計データ（モック）
const MOCK_STATS = {
  totalCompanies: 48,
  publishedCompanies: 35,
  totalMembers: 156,
  activeMembers: 142,
  totalCustomers: 1234,
  totalCases: 428,
  publishedCases: 385,
  totalInquiries: 892,
  newInquiries: 23,
};

// 最近のアクティビティ（モック）
const MOCK_RECENT_ACTIVITY = [
  {
    id: 1,
    action: "新規工務店登録",
    performer: "株式会社三河ホーム",
    details: "愛知県岡崎市の工務店が新規登録されました",
    createdAt: "2024-12-23T10:30:00",
    type: "company",
  },
  {
    id: 2,
    action: "施工事例公開",
    performer: "株式会社ナゴヤホーム",
    details: "自然素材にこだわった平屋の家",
    createdAt: "2024-12-23T09:15:00",
    type: "case",
  },
  {
    id: 3,
    action: "新規問い合わせ",
    performer: "顧客: 山田花子",
    details: "モダンデザインの二世帯住宅について",
    createdAt: "2024-12-23T08:45:00",
    type: "inquiry",
  },
  {
    id: 4,
    action: "メンバー追加",
    performer: "株式会社豊田ハウジング",
    details: "新しい担当者が追加されました",
    createdAt: "2024-12-22T16:20:00",
    type: "member",
  },
  {
    id: 5,
    action: "工務店情報更新",
    performer: "株式会社春日井建設",
    details: "会社説明とロゴが更新されました",
    createdAt: "2024-12-22T14:10:00",
    type: "company",
  },
];

// 月次統計（モック）
const MOCK_MONTHLY_STATS = {
  newCompanies: 5,
  newCases: 38,
  newInquiries: 156,
  totalViews: 12450,
};

const ACTIVITY_TYPE_CONFIG = {
  company: { color: "text-blue-600", bgColor: "bg-blue-100", icon: Building2 },
  case: { color: "text-green-600", bgColor: "bg-green-100", icon: FileText },
  inquiry: {
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    icon: MessageSquare,
  },
  member: { color: "text-purple-600", bgColor: "bg-purple-100", icon: Users },
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString("ja-JP", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* サイドバー */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        adminName={MOCK_ADMIN.name}
        adminRole={MOCK_ADMIN.role as "SUPER_ADMIN" | "ADMIN"}
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
                管理者ダッシュボード
              </h1>
              <p className="text-gray-600 mt-1">
                サイト全体の統計情報と最近のアクティビティ
              </p>
            </div>
          </div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 工務店 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">工務店</p>
            <p className="text-3xl font-black text-gray-900 mb-1">
              {MOCK_STATS.totalCompanies}
            </p>
            <p className="text-xs text-blue-600">
              公開中: {MOCK_STATS.publishedCompanies}
            </p>
          </div>

          {/* メンバー */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center shadow">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">メンバー</p>
            <p className="text-3xl font-black text-gray-900 mb-1">
              {MOCK_STATS.totalMembers}
            </p>
            <p className="text-xs text-purple-600">
              アクティブ: {MOCK_STATS.activeMembers}
            </p>
          </div>

          {/* 施工事例 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center shadow">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <Eye className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">施工事例</p>
            <p className="text-3xl font-black text-gray-900 mb-1">
              {MOCK_STATS.totalCases}
            </p>
            <p className="text-xs text-green-600">
              公開中: {MOCK_STATS.publishedCases}
            </p>
          </div>

          {/* 顧客 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-orange-600 to-orange-500 rounded-xl flex items-center justify-center shadow">
                <UserCircle className="h-6 w-6 text-white" />
              </div>
              <MessageSquare className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">顧客</p>
            <p className="text-3xl font-black text-gray-900 mb-1">
              {MOCK_STATS.totalCustomers}
            </p>
            <p className="text-xs text-orange-600">
              問い合わせ: {MOCK_STATS.totalInquiries}
            </p>
          </div>
        </div>

        {/* 今月の統計 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-6">今月の統計</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">新規工務店</p>
              <p className="text-2xl font-black text-gray-900">
                +{MOCK_MONTHLY_STATS.newCompanies}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">新規施工事例</p>
              <p className="text-2xl font-black text-gray-900">
                +{MOCK_MONTHLY_STATS.newCases}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">新規問い合わせ</p>
              <p className="text-2xl font-black text-gray-900">
                +{MOCK_MONTHLY_STATS.newInquiries}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">総閲覧数</p>
              <p className="text-2xl font-black text-gray-900">
                {MOCK_MONTHLY_STATS.totalViews.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* 最近のアクティビティ */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-black text-gray-900">
              最近のアクティビティ
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {MOCK_RECENT_ACTIVITY.map((activity) => {
              const config =
                ACTIVITY_TYPE_CONFIG[
                  activity.type as keyof typeof ACTIVITY_TYPE_CONFIG
                ];
              const Icon = config.icon;

              return (
                <div
                  key={activity.id}
                  className="px-6 py-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-gray-900">
                          {activity.action}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(activity.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        {activity.performer}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.details}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
