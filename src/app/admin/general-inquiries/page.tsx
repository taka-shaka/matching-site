"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Menu,
  Search,
  Filter,
  ChevronDown,
  Mail,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  Circle,
  XCircle,
  Loader2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/lib/auth-provider";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface GeneralInquiryResponse {
  id: number;
  sender: string;
  senderName: string;
  message: string;
  createdAt: string;
}

interface GeneralInquiryItem {
  id: number;
  inquirerName: string;
  inquirerEmail: string;
  inquirerPhone: string | null;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  respondedAt: string | null;
  createdAt: string;
  responses: GeneralInquiryResponse[];
  _count: {
    responses: number;
  };
}

interface InquiriesResponse {
  inquiries: GeneralInquiryItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

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

export default function AdminGeneralInquiriesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  >("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
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

  // 一般問い合わせ一覧取得
  const apiUrl =
    filterStatus === "all"
      ? "/api/admin/general-inquiries"
      : `/api/admin/general-inquiries?status=${filterStatus}`;

  const { data, error, isLoading } = useSWR<InquiriesResponse>(
    apiUrl,
    fetcher,
    {
      onError: (err) => {
        console.error("API Error:", err);
      },
      onSuccess: (data) => {
        console.log("API Success:", data);
      },
    }
  );

  // ローカル検索フィルター（dataとinquiriesの存在をチェック）
  const filteredInquiries = (data?.inquiries || []).filter(
    (inquiry) =>
      inquiry.inquirerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.inquirerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 統計計算（dataとinquiriesの存在をチェック）
  const stats = {
    total: data?.pagination?.total || 0,
    new: (data?.inquiries || []).filter((i) => i.status === "NEW").length,
    inProgress: (data?.inquiries || []).filter(
      (i) => i.status === "IN_PROGRESS"
    ).length,
    resolved: (data?.inquiries || []).filter((i) => i.status === "RESOLVED")
      .length,
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
                一般問い合わせ管理
              </h1>
            </div>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <main className="p-4 lg:p-8">
          {/* 統計カード */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">全問い合わせ</p>
              <p className="text-3xl font-black text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">新規</p>
              <p className="text-3xl font-black text-blue-600">{stats.new}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">対応中</p>
              <p className="text-3xl font-black text-orange-600">
                {stats.inProgress}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">解決済み</p>
              <p className="text-3xl font-black text-green-600">
                {stats.resolved}
              </p>
            </div>
          </div>

          {/* アクションバー */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* 検索バー */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="名前、メール、メッセージで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
                      : STATUS_CONFIG[filterStatus].label}
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
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                    >
                      すべて ({stats.total})
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus("NEW");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                    >
                      新規 ({stats.new})
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus("IN_PROGRESS");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                    >
                      対応中 ({stats.inProgress})
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus("RESOLVED");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                    >
                      解決済み ({stats.resolved})
                    </button>
                  </div>
                )}
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
              {filteredInquiries && filteredInquiries.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    {searchQuery
                      ? "検索条件に一致する問い合わせが見つかりませんでした"
                      : "まだ一般問い合わせが届いていません"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredInquiries?.map((inquiry) => {
                    const statusConfig =
                      STATUS_CONFIG[
                        inquiry.status as keyof typeof STATUS_CONFIG
                      ];
                    const StatusIcon = statusConfig.icon;

                    return (
                      <div
                        key={inquiry.id}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-black text-gray-900">
                                  {inquiry.inquirerName}
                                </h3>
                                <div
                                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border`}
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
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-4 w-4" />
                                  {inquiry.inquirerEmail}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(inquiry.createdAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4" />
                                  {inquiry._count.responses}件の返信
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-4 mb-4">
                            <p className="text-gray-700 line-clamp-2">
                              {inquiry.message}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/general-inquiries/${inquiry.id}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition border border-blue-200"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="font-medium">詳細を見る</span>
                            </Link>
                          </div>
                        </div>
                      </div>
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
