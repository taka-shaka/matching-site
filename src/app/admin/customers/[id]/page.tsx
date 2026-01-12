// src/app/admin/customers/[id]/page.tsx
// 管理者 顧客詳細ページ

"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import {
  ArrowLeft,
  Menu,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  MessageSquare,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
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

interface Inquiry {
  id: number;
  inquirerName: string;
  inquirerEmail: string;
  inquirerPhone: string | null;
  message: string;
  status: string;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  company: {
    id: number;
    name: string;
  };
  responses: InquiryResponse[];
}

interface GeneralInquiry {
  id: number;
  inquirerName: string;
  inquirerEmail: string;
  inquirerPhone: string | null;
  message: string;
  status: string;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  responses: InquiryResponse[];
}

interface Customer {
  id: number;
  authId: string;
  email: string;
  lastName: string;
  firstName: string;
  phoneNumber: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  inquiries: Inquiry[];
  _count: {
    inquiries: number;
  };
}

interface CustomerDetailResponse {
  customer: Customer;
  generalInquiries: GeneralInquiry[];
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NEW: { label: "新規", color: "bg-blue-100 text-blue-700 border-blue-200" },
  IN_PROGRESS: {
    label: "対応中",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  RESOLVED: {
    label: "解決済み",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  CLOSED: {
    label: "完了",
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
};

export default function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 認証・役割チェック
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/admin/login");
      } else if (user.userType !== "admin") {
        router.push("/");
      }
    }
  }, [user, authLoading, router]);

  // 顧客詳細取得
  const { data, error, isLoading } = useSWR<CustomerDetailResponse>(
    `/api/admin/customers/${id}`,
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

  function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // ローディング中の処理
  if (authLoading || isLoading) {
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

  // エラー処理
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          adminName={user?.email || "管理者"}
          adminRole="ADMIN"
        />
        <div className="lg:ml-64">
          <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-black text-gray-900">顧客詳細</h1>
              </div>
            </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium mb-4">
                顧客情報の取得に失敗しました
              </p>
              <button
                onClick={() => router.push("/admin/customers")}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
              >
                顧客一覧に戻る
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const { customer, generalInquiries } = data;

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
      <div className="lg:ml-64">
        {/* ヘッダー */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <Link
                  href="/admin/customers"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="font-medium">顧客一覧に戻る</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* 顧客基本情報 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">
                    {customer.lastName} {customer.firstName}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full border ${
                      customer.isActive
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                  >
                    {customer.isActive ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        アクティブ
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        非アクティブ
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{customer.email}</span>
              </div>
              {customer.phoneNumber && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{customer.phoneNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  最終ログイン:{" "}
                  {customer.lastLoginAt
                    ? formatDateTime(customer.lastLoginAt)
                    : "未ログイン"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>登録日: {formatDate(customer.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* 統計 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">工務店への問い合わせ</p>
              <p className="text-3xl font-black text-gray-900">
                {customer.inquiries.length}件
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">管理者への問い合わせ</p>
              <p className="text-3xl font-black text-gray-900">
                {generalInquiries.length}件
              </p>
            </div>
          </div>

          {/* 工務店への問い合わせ履歴 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              工務店への問い合わせ履歴
            </h3>
            {customer.inquiries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                まだ問い合わせがありません
              </p>
            ) : (
              <div className="space-y-4">
                {customer.inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <Link
                            href={`/admin/companies/${inquiry.company.id}`}
                            className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            {inquiry.company.name}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(inquiry.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full border ${
                          STATUS_LABELS[inquiry.status]?.color ||
                          "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {STATUS_LABELS[inquiry.status]?.label || inquiry.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                      {inquiry.message}
                    </p>
                    {inquiry.responses.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <p className="text-sm font-bold text-gray-700 flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          返信履歴 ({inquiry.responses.length}件)
                        </p>
                        {inquiry.responses.map((response) => (
                          <div
                            key={response.id}
                            className="bg-white rounded p-2 text-sm"
                          >
                            <p className="font-bold text-gray-900 mb-1">
                              {response.senderName}
                            </p>
                            <p className="text-gray-700 whitespace-pre-wrap mb-1">
                              {response.message}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDateTime(response.createdAt)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 管理者への問い合わせ履歴 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-purple-600" />
              管理者への問い合わせ履歴
            </h3>
            {generalInquiries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                まだ問い合わせがありません
              </p>
            ) : (
              <div className="space-y-4">
                {generalInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm text-gray-600">
                            {formatDateTime(inquiry.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full border ${
                            STATUS_LABELS[inquiry.status]?.color ||
                            "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {STATUS_LABELS[inquiry.status]?.label ||
                            inquiry.status}
                        </span>
                        <Link
                          href={`/admin/general-inquiries/${inquiry.id}`}
                          className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-purple-600 bg-purple-50 border border-purple-200 rounded-full hover:bg-purple-100 transition"
                        >
                          詳細を見る
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                      {inquiry.message}
                    </p>
                    {inquiry.responses.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <p className="text-sm font-bold text-gray-700 flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          返信履歴 ({inquiry.responses.length}件)
                        </p>
                        {inquiry.responses.map((response) => (
                          <div
                            key={response.id}
                            className="bg-white rounded p-2 text-sm"
                          >
                            <p className="font-bold text-gray-900 mb-1">
                              {response.senderName}
                            </p>
                            <p className="text-gray-700 whitespace-pre-wrap mb-1">
                              {response.message}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDateTime(response.createdAt)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
