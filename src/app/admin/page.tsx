// src/app/admin/page.tsx
// 管理者ダッシュボードトップページ

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/lib/auth-provider";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Stats {
  totalCompanies: number;
  publishedCompanies: number;
  totalMembers: number;
  activeMembers: number;
  totalCustomers: number;
  totalCases: number;
  publishedCases: number;
  totalInquiries: number;
  newInquiries: number;
}

interface MonthlyStats {
  newCompanies: number;
  newCases: number;
  newInquiries: number;
  totalViews: number;
}

interface Activity {
  id: string;
  action: string;
  performer: string;
  details: string;
  createdAt: Date;
  type: "company" | "case" | "inquiry" | "member";
}

interface DashboardData {
  stats: Stats;
  monthlyStats: MonthlyStats;
  recentActivity: Activity[];
}

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
  const { user, loading } = useAuth();
  const router = useRouter();

  // 認証・役割チェック
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/admin/login");
      } else if (user.userType !== "admin") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  // ダッシュボードデータ取得
  const { data, error, isLoading } = useSWR<DashboardData>(
    "/api/admin/stats",
    fetcher
  );

  function formatDateTime(dateString: string | Date) {
    const date = new Date(dateString);
    return date.toLocaleString("ja-JP", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // ローディング中の処理
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // 未認証または役割不一致の処理
  if (!user || user.userType !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* サイドバー */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        adminName={user?.email || "管理者"}
        adminRole="ADMIN"
      />

      {/* メインコンテンツ */}
      <div className="lg:pl-64">
        {/* トップバー */}
        <div className="sticky top-0 z-10 flex h-16 shrink-0 bg-white border-b border-gray-200">
          <button
            type="button"
            className="px-4 text-gray-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex flex-1 items-center">
              <h1 className="text-2xl font-black text-gray-900">
                管理者ダッシュボード
              </h1>
            </div>
            <div className="flex items-center gap-3"></div>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <main className="p-4 lg:p-8">
          {/* ローディング状態 */}
          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          )}

          {/* エラー状態 */}
          {error && (
            <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium mb-4">
                データの取得に失敗しました
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {error?.message || "不明なエラー"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
              >
                再読み込み
              </button>
            </div>
          )}

          {/* データ表示 */}
          {!isLoading && !error && data && (
            <>
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
                    {data?.stats?.totalCompanies || 0}
                  </p>
                  <p className="text-xs text-blue-600">
                    公開中: {data?.stats?.publishedCompanies || 0}
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
                    {data?.stats?.totalMembers || 0}
                  </p>
                  <p className="text-xs text-purple-600">
                    アクティブ: {data?.stats?.activeMembers || 0}
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
                    {data?.stats?.totalCases || 0}
                  </p>
                  <p className="text-xs text-green-600">
                    公開中: {data?.stats?.publishedCases || 0}
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
                    {data?.stats?.totalCustomers || 0}
                  </p>
                  <p className="text-xs text-orange-600">
                    問い合わせ: {data?.stats?.totalInquiries || 0}
                  </p>
                </div>
              </div>

              {/* 今月の統計 */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
                <h2 className="text-xl font-black text-gray-900 mb-6">
                  今月の統計
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">新規工務店</p>
                    <p className="text-2xl font-black text-gray-900">
                      +{data?.monthlyStats?.newCompanies || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">新規施工事例</p>
                    <p className="text-2xl font-black text-gray-900">
                      +{data?.monthlyStats?.newCases || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">新規問い合わせ</p>
                    <p className="text-2xl font-black text-gray-900">
                      +{data?.monthlyStats?.newInquiries || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">総閲覧数</p>
                    <p className="text-2xl font-black text-gray-900">
                      {data?.monthlyStats?.totalViews?.toLocaleString() || 0}
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
                  {data?.recentActivity?.map((activity) => {
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
