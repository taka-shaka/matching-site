"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import {
  Menu,
  Search,
  MessageSquare,
  Building2,
  Calendar,
  Eye,
  CheckCircle,
  Circle,
  Clock,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import CustomerSidebar from "@/components/customer/CustomerSidebar";
import { useAuth } from "@/lib/auth-provider";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface InquiryResponse {
  id: number;
  sender: string;
  senderName: string;
  message: string;
  createdAt: string;
}

interface Company {
  id: number;
  name: string;
  prefecture: string;
  city: string;
  logoUrl: string | null;
}

interface Inquiry {
  id: number;
  inquirerName: string;
  inquirerEmail: string;
  inquirerPhone: string | null;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  respondedAt: string | null;
  company: Company;
  responses: InquiryResponse[];
}

interface InquiriesResponse {
  inquiries: Inquiry[];
}

interface CustomerProfile {
  customer: {
    id: number;
    email: string;
    lastName: string | null;
    firstName: string | null;
    phoneNumber: string | null;
  };
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

export default function CustomerInquiriesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<InquiryStatus>("all");

  // 認証・役割チェック
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.userType !== "customer") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  // 問い合わせ一覧取得
  const { data, error, isLoading } = useSWR<InquiriesResponse>(
    "/api/customer/inquiries",
    fetcher
  );

  // 顧客プロフィール取得
  const { data: profileData } = useSWR<CustomerProfile>(
    "/api/customer/profile",
    fetcher
  );

  // フィルタリングロジック
  const filteredInquiries =
    data?.inquiries.filter((inquiry) => {
      const matchesSearch =
        inquiry.company.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || inquiry.status === filterStatus;
      return matchesSearch && matchesStatus;
    }) || [];

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
  if (!user || user.userType !== "customer") {
    return null;
  }

  // 氏名の表示用
  const displayName = profileData?.customer
    ? `${profileData.customer.lastName || ""} ${profileData.customer.firstName || ""}`.trim() ||
      user?.email ||
      "ゲスト"
    : user?.email || "ゲスト";

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-red-50 to-pink-50">
      {/* サイドバー */}
      <CustomerSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        customerName={displayName}
        customerEmail={user?.email || ""}
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
                問い合わせ履歴
              </h1>
            </div>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <main className="p-4 lg:p-8">
          {/* ヘッダー */}
          <div className="mb-8">
            <h2 className="text-xl font-black text-gray-900 mb-2">
              送信した問い合わせ
            </h2>
            <p className="text-gray-600">工務店とのやり取りを確認できます</p>
          </div>

          {/* 統計カード */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <button
              onClick={() => setFilterStatus("all")}
              className={`p-4 rounded-xl border-2 transition ${
                filterStatus === "all"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <p className="text-2xl font-black text-gray-900">{stats.all}</p>
              <p className="text-xs text-gray-600 mt-1">すべて</p>
            </button>

            <button
              onClick={() => setFilterStatus("NEW")}
              className={`p-4 rounded-xl border-2 transition ${
                filterStatus === "NEW"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <p className="text-2xl font-black text-blue-600">{stats.new}</p>
              <p className="text-xs text-gray-600 mt-1">新規</p>
            </button>

            <button
              onClick={() => setFilterStatus("IN_PROGRESS")}
              className={`p-4 rounded-xl border-2 transition ${
                filterStatus === "IN_PROGRESS"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <p className="text-2xl font-black text-orange-600">
                {stats.inProgress}
              </p>
              <p className="text-xs text-gray-600 mt-1">対応中</p>
            </button>

            <button
              onClick={() => setFilterStatus("RESOLVED")}
              className={`p-4 rounded-xl border-2 transition ${
                filterStatus === "RESOLVED"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <p className="text-2xl font-black text-green-600">
                {stats.resolved}
              </p>
              <p className="text-xs text-gray-600 mt-1">解決済み</p>
            </button>

            <button
              onClick={() => setFilterStatus("CLOSED")}
              className={`p-4 rounded-xl border-2 transition ${
                filterStatus === "CLOSED"
                  ? "border-gray-500 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <p className="text-2xl font-black text-gray-600">
                {stats.closed}
              </p>
              <p className="text-xs text-gray-600 mt-1">クローズ</p>
            </button>
          </div>

          {/* 検索バー */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="工務店名、メッセージで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
                問い合わせの取得に失敗しました
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
              >
                再読み込み
              </button>
            </div>
          )}

          {/* 問い合わせ一覧 */}
          {!isLoading && !error && (
            <>
              {filteredInquiries.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">
                    問い合わせが見つかりませんでした
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    検索条件を変更してみてください
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInquiries.map((inquiry) => {
                    const statusConfig =
                      STATUS_CONFIG[
                        inquiry.status as keyof typeof STATUS_CONFIG
                      ];
                    const StatusIcon = statusConfig.icon;

                    return (
                      <Link
                        key={inquiry.id}
                        href={`/customer/inquiries/${inquiry.id}`}
                        className="block bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Building2 className="h-5 w-5 text-gray-400" />
                              <h3 className="font-black text-gray-900 text-lg">
                                {inquiry.company.name}
                              </h3>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span>
                                {inquiry.company.prefecture}{" "}
                                {inquiry.company.city}
                              </span>
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

                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {inquiry.message}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>送信日: {formatDate(inquiry.createdAt)}</span>
                          </div>
                          {inquiry.respondedAt && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span>返信済み</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            問い合わせID: #{inquiry.id}
                          </span>
                          <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                            詳細を見る
                            <Eye className="h-4 w-4" />
                          </div>
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
