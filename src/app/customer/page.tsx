"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import {
  Menu,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Building2,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import CustomerSidebar from "@/components/customer/CustomerSidebar";
import { useAuth } from "@/lib/auth-provider";
import { formatBudget } from "@/lib/format";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Customer {
  id: number;
  email: string;
  lastName: string | null;
  firstName: string | null;
  phoneNumber: string | null;
}

interface RecentInquiry {
  id: number;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  company: {
    id: number;
    name: string;
  };
}

interface RecommendedCase {
  id: number;
  title: string;
  description: string;
  prefecture: string;
  city: string;
  budget: number | null;
  mainImageUrl: string | null;
  company: {
    id: number;
    name: string;
  };
}

interface DashboardResponse {
  customer: Customer;
  stats: {
    total: number;
    new: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  recentInquiries: RecentInquiry[];
  recommendedCases: RecommendedCase[];
}

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
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  // 認証・役割チェック
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.userType !== "customer") {
        // 顧客以外はアクセス不可
        router.push("/");
      }
    }
  }, [user, loading, router]);

  // ダッシュボードデータ取得
  const { data, error, isLoading } = useSWR<DashboardResponse>(
    "/api/customer/dashboard",
    fetcher
  );

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  // ローディング中
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // 未認証または顧客以外の場合
  if (!user || user.userType !== "customer") {
    return null;
  }

  const customerName =
    data?.customer.lastName && data?.customer.firstName
      ? `${data.customer.lastName} ${data.customer.firstName}`
      : user.email || "ゲスト";

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-red-50 to-pink-50">
      {/* サイドバー */}
      <CustomerSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        customerName={customerName}
        customerEmail={data?.customer.email || user?.email || ""}
      />

      {/* メインコンテンツ */}
      <div className="lg:pl-64">
        {/* トップバー */}
        <div className="sticky top-0 z-10 flex h-16 shrink-0 bg-white border-b border-gray-200">
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
              <span className="text-sm text-gray-600">{customerName}さん</span>
            </div>
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
              {/* ウェルカムメッセージ */}
              <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-2">
                  ようこそ、
                  {data.customer.lastName || user?.email || "ゲスト"}さん！
                </h2>
                <p className="text-gray-600">
                  理想の住まいづくりをサポートします
                </p>
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
                    {data.stats.total}
                  </p>
                </div>

                {/* 対応中 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    対応中の問い合わせ
                  </p>
                  <p className="text-3xl font-black text-gray-900">
                    {data.stats.inProgress + data.stats.new}
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
                    {data.stats.resolved}
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
                  {data.recentInquiries.length === 0 ? (
                    <div className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        まだ問い合わせがありません
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {data.recentInquiries.map((inquiry) => {
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
                                    {inquiry.company.name}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3 mb-2">
                                  <FileText className="h-5 w-5 text-gray-400" />
                                  <p className="text-sm text-gray-600 line-clamp-1">
                                    {inquiry.message}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(inquiry.createdAt)}
                                </div>
                              </div>
                              <div
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bgColor} shrink-0`}
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
                  {data.recommendedCases.slice(0, 3).map((caseItem) => (
                    <Link
                      key={caseItem.id}
                      href={`/cases/${caseItem.id}`}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group"
                    >
                      <div className="relative h-48 overflow-hidden bg-linear-to-br from-red-400 to-orange-400">
                        {caseItem.mainImageUrl ? (
                          <img
                            src={caseItem.mainImageUrl}
                            alt={caseItem.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-16 h-16 text-white opacity-50" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">
                          {caseItem.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {caseItem.company.name}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {caseItem.prefecture} {caseItem.city}
                          </span>
                          {caseItem.budget && (
                            <span className="font-bold text-blue-600">
                              {formatBudget(caseItem.budget)}
                            </span>
                          )}
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
