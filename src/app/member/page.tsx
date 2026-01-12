// src/app/member/page.tsx
// メンバーダッシュボードトップ

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import {
  TrendingUp,
  Eye,
  Calendar,
  Menu,
  PlusCircle,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  Circle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import MemberSidebar from "@/components/member/MemberSidebar";
import { useAuth } from "@/lib/auth-provider";

// API Fetcher
const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "API request failed");
  }

  return data;
};

interface Member {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "GENERAL";
}

interface Company {
  id: number;
  name: string;
  prefecture: string;
  city: string;
  logoUrl: string | null;
}

interface RecentCase {
  id: number;
  title: string;
  status: "DRAFT" | "PUBLISHED";
  viewCount: number;
  publishedAt: string | null;
  mainImageUrl: string | null;
  createdAt: string;
}

interface RecentInquiry {
  id: number;
  inquirerName: string;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
}

interface DashboardResponse {
  member: Member;
  company: Company;
  stats: {
    cases: {
      total: number;
      published: number;
      draft: number;
      totalViews: number;
    };
    inquiries: {
      total: number;
      new: number;
      inProgress: number;
      resolved: number;
    };
  };
  recentCases: RecentCase[];
  recentInquiries: RecentInquiry[];
}

const STATUS_CONFIG = {
  NEW: {
    label: "新規",
    icon: Circle,
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

export default function MemberDashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  // 認証・役割チェック
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/member/login");
      } else if (user.userType !== "member") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  // ダッシュボードデータ取得
  const { data, error, isLoading } = useSWR<DashboardResponse>(
    "/api/member/dashboard",
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

  // ローディング中の処理
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // 未認証または役割不一致の処理
  if (!user || user.userType !== "member") {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* サイドバー */}
      <MemberSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        memberName={data?.member.name || user?.email || "メンバー"}
        companyName={data?.company.name || ""}
        memberRole={data?.member.role || "GENERAL"}
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
              <span className="text-sm text-gray-600">
                {data?.member.name || user?.email}
              </span>
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
              <AlertCircle className="h-16 w-16 text-blue-500 mx-auto mb-4" />
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
                  ようこそ、{data.member.name}さん！
                </h2>
                <p className="text-gray-600">
                  {data.company?.name || "工務店"} の管理画面です
                </p>
              </div>

              {/* 統計カード */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* 総施工事例数 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">施工事例</p>
                  <p className="text-3xl font-black text-gray-900">
                    {data.stats.cases.total}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    公開: {data.stats.cases.published} / 下書き:{" "}
                    {data.stats.cases.draft}
                  </p>
                </div>

                {/* 総閲覧数 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">総閲覧数</p>
                  <p className="text-3xl font-black text-gray-900">
                    {data.stats.cases.totalViews.toLocaleString()}
                  </p>
                </div>

                {/* 総問い合わせ数 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">問い合わせ</p>
                  <p className="text-3xl font-black text-gray-900">
                    {data.stats.inquiries.total}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    新規: {data.stats.inquiries.new}
                  </p>
                </div>

                {/* 対応中の問い合わせ */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">対応中</p>
                  <p className="text-3xl font-black text-gray-900">
                    {data.stats.inquiries.inProgress + data.stats.inquiries.new}
                  </p>
                </div>
              </div>

              {/* クイックアクション */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Link
                  href="/member/cases/new"
                  className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white hover:shadow-xl transition group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <PlusCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black mb-1">
                        新しい施工事例を追加
                      </h3>
                      <p className="text-sm opacity-90">
                        素敵な施工事例を公開しましょう
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/member/inquiries"
                  className="bg-linear-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white hover:shadow-xl transition group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black mb-1">
                        問い合わせを確認
                      </h3>
                      <p className="text-sm opacity-90">
                        {data.stats.inquiries.new > 0
                          ? `${data.stats.inquiries.new}件の新規問い合わせがあります`
                          : "すべての問い合わせを管理"}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* 最近の施工事例 */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black text-gray-900">
                    最近の施工事例
                  </h3>
                  <Link
                    href="/member/cases"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    すべて見る →
                  </Link>
                </div>

                {data.recentCases.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">まだ施工事例がありません</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.recentCases.map((caseItem) => (
                      <Link
                        key={caseItem.id}
                        href={`/member/cases/${caseItem.id}`}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group"
                      >
                        <div className="relative h-48 overflow-hidden bg-linear-to-br from-blue-400 to-indigo-400">
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
                          <div className="absolute top-3 right-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                caseItem.status === "PUBLISHED"
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-500 text-white"
                              }`}
                            >
                              {caseItem.status === "PUBLISHED"
                                ? "公開"
                                : "下書き"}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">
                            {caseItem.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{caseItem.viewCount}</span>
                            </div>
                            {caseItem.publishedAt && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(caseItem.publishedAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 最近の問い合わせ */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black text-gray-900">
                    最近の問い合わせ
                  </h3>
                  <Link
                    href="/member/inquiries"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    すべて見る →
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
                            href={`/member/inquiries/${inquiry.id}`}
                            className="block p-6 hover:bg-gray-50 transition"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <p className="font-bold text-gray-900">
                                    {inquiry.inquirerName}
                                  </p>
                                  <div
                                    className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusConfig.bgColor}`}
                                  >
                                    <StatusIcon
                                      className={`h-3 w-3 ${statusConfig.color}`}
                                    />
                                    <span
                                      className={`text-xs font-bold ${statusConfig.color}`}
                                    >
                                      {statusConfig.label}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                  {inquiry.message}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(inquiry.createdAt)}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
