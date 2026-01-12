// src/app/member/inquiries/page.tsx
// メンバー（工務店）問い合わせ管理ページ

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import {
  Search,
  Filter,
  ChevronDown,
  Menu,
  Mail,
  Phone,
  Calendar,
  Eye,
  CheckCircle,
  Circle,
  Clock,
  XCircle,
  MessageSquare,
  Loader2,
  AlertCircle,
} from "lucide-react";
import MemberSidebar from "@/components/member/MemberSidebar";
import { useAuth } from "@/lib/auth-provider";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Customer {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string | null;
}

interface InquiryResponse {
  id: number;
  memberId: number;
  message: string;
  createdAt: string;
}

interface Inquiry {
  id: number;
  inquirerName: string;
  inquirerEmail: string;
  inquirerPhone: string | null;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  customer: Customer | null;
  responses: InquiryResponse[];
}

interface InquiriesResponse {
  inquiries: Inquiry[];
}

type InquiryStatus = "all" | "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

const STATUS_CONFIG = {
  NEW: {
    label: "新規",
    icon: Circle,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
  },
  IN_PROGRESS: {
    label: "対応中",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-200",
  },
  RESOLVED: {
    label: "解決済み",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
  },
  CLOSED: {
    label: "クローズ",
    icon: XCircle,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200",
  },
};

export default function InquiriesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<InquiryStatus>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
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

  // ダッシュボードデータ取得（メンバー情報用）
  const { data: dashboardData } = useSWR("/api/member/dashboard", fetcher);

  // 問い合わせ一覧取得
  const apiUrl =
    filterStatus === "all"
      ? "/api/member/inquiries"
      : `/api/member/inquiries?status=${filterStatus}`;

  const { data, error, isLoading } = useSWR<InquiriesResponse>(apiUrl, fetcher);

  // ローカル検索フィルター
  const filteredInquiries = data?.inquiries.filter(
    (inquiry) =>
      inquiry.inquirerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.inquirerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    all: data?.inquiries.length || 0,
    new: data?.inquiries.filter((i) => i.status === "NEW").length || 0,
    inProgress:
      data?.inquiries.filter((i) => i.status === "IN_PROGRESS").length || 0,
    resolved:
      data?.inquiries.filter((i) => i.status === "RESOLVED").length || 0,
    closed: data?.inquiries.filter((i) => i.status === "CLOSED").length || 0,
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
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
  if (!user || user.userType !== "member") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50">
      {/* サイドバー */}
      <MemberSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        memberName={dashboardData?.member.name || user?.email || "メンバー"}
        companyName={dashboardData?.company.name || ""}
        memberRole={dashboardData?.member.role || "GENERAL"}
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
                問い合わせ管理
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {dashboardData?.member.name || user?.email}
              </span>
            </div>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <main className="p-4 lg:p-8">
          <div className="mb-8">
            {/* ステータス統計カード */}
            {!isLoading && !error && data && (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">全体</p>
                  <p className="text-2xl font-black text-gray-900">
                    {stats.all}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl shadow-lg p-4 border border-blue-100">
                  <p className="text-xs text-blue-600 mb-1">新規</p>
                  <p className="text-2xl font-black text-blue-900">
                    {stats.new}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-xl shadow-lg p-4 border border-orange-100">
                  <p className="text-xs text-orange-600 mb-1">対応中</p>
                  <p className="text-2xl font-black text-orange-900">
                    {stats.inProgress}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl shadow-lg p-4 border border-green-100">
                  <p className="text-xs text-green-600 mb-1">解決済み</p>
                  <p className="text-2xl font-black text-green-900">
                    {stats.resolved}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl shadow-lg p-4 border border-gray-100">
                  <p className="text-xs text-gray-600 mb-1">クローズ</p>
                  <p className="text-2xl font-black text-gray-900">
                    {stats.closed}
                  </p>
                </div>
              </div>
            )}

            {/* アクションバー */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* 検索バー */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="名前、メールアドレス、メッセージで検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  />
                </div>

                {/* フィルター */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                  >
                    <Filter className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-700">
                      {filterStatus === "all"
                        ? "すべて"
                        : STATUS_CONFIG[
                            filterStatus as keyof typeof STATUS_CONFIG
                          ].label}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                  {showFilterDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10">
                      <button
                        onClick={() => {
                          setFilterStatus("all");
                          setShowFilterDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                      >
                        すべて ({stats.all})
                      </button>
                      <button
                        onClick={() => {
                          setFilterStatus("NEW");
                          setShowFilterDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                      >
                        新規 ({stats.new})
                      </button>
                      <button
                        onClick={() => {
                          setFilterStatus("IN_PROGRESS");
                          setShowFilterDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                      >
                        対応中 ({stats.inProgress})
                      </button>
                      <button
                        onClick={() => {
                          setFilterStatus("RESOLVED");
                          setShowFilterDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                      >
                        解決済み ({stats.resolved})
                      </button>
                      <button
                        onClick={() => {
                          setFilterStatus("CLOSED");
                          setShowFilterDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                      >
                        クローズ ({stats.closed})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

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
              {/* 問い合わせ一覧 */}
              {filteredInquiries && filteredInquiries.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {searchQuery
                      ? "検索条件に一致する問い合わせが見つかりませんでした"
                      : "まだ問い合わせがありません"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInquiries?.map((inquiry) => {
                    const statusConfig =
                      STATUS_CONFIG[
                        inquiry.status as keyof typeof STATUS_CONFIG
                      ];
                    const StatusIcon = statusConfig.icon;

                    return (
                      <Link
                        key={inquiry.id}
                        href={`/member/inquiries/${inquiry.id}`}
                        className="block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        {/* ヘッダー */}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-black text-gray-900">
                                  {inquiry.inquirerName}
                                </h3>
                                <span
                                  className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} border`}
                                >
                                  <StatusIcon className="h-3 w-3" />
                                  {statusConfig.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-4 w-4" />
                                  {inquiry.inquirerEmail}
                                </span>
                                {inquiry.inquirerPhone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-4 w-4" />
                                    {inquiry.inquirerPhone}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(inquiry.createdAt)}
                                </span>
                              </div>
                              {inquiry.responses.length > 0 && (
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-sm border border-green-200">
                                  <MessageSquare className="h-4 w-4" />
                                  <span className="font-medium">
                                    返信 {inquiry.responses.length}件
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
                              <Eye className="h-5 w-5" />
                            </div>
                          </div>

                          {/* メッセージプレビュー */}
                          <p className="text-gray-700 line-clamp-2">
                            {inquiry.message}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
