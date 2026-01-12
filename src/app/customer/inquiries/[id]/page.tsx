"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import {
  Menu,
  ArrowLeft,
  Building2,
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  Clock,
  Circle,
  XCircle,
  MapPin,
  Loader2,
  AlertCircle,
  Send,
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
  address: string;
  prefecture: string;
  city: string;
  phoneNumber: string;
  email: string;
  websiteUrl: string | null;
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

interface InquiryDetailResponse {
  inquiry: Inquiry;
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

export default function CustomerInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

  // 問い合わせ詳細取得
  const { data, error, isLoading } = useSWR<InquiryDetailResponse>(
    `/api/customer/inquiries/${id}`,
    fetcher
  );

  // 顧客プロフィール取得
  const { data: profileData } = useSWR<CustomerProfile>(
    "/api/customer/profile",
    fetcher
  );

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

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/customer/inquiries/${id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: replyMessage }),
      });

      if (!response.ok) {
        throw new Error("返信の送信に失敗しました");
      }

      mutate(`/api/customer/inquiries/${id}`);
      setSuccessMessage("返信を送信しました");
      setReplyMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "返信の送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="flex flex-1 items-center gap-4">
              <Link
                href="/customer/inquiries"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-black text-gray-900">
                問い合わせ詳細
              </h1>
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
                問い合わせの取得に失敗しました
              </p>
              <button
                onClick={() => router.push("/customer/inquiries")}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
              >
                問い合わせ一覧に戻る
              </button>
            </div>
          )}

          {/* データ表示 */}
          {!isLoading && !error && data && (
            <>
              {/* 成功メッセージ */}
              {successMessage && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-medium text-green-800">
                    {successMessage}
                  </p>
                </div>
              )}

              {/* ステータスバッジ */}
              <div className="mb-6">
                {(() => {
                  const statusConfig =
                    STATUS_CONFIG[
                      data.inquiry.status as keyof typeof STATUS_CONFIG
                    ];
                  const StatusIcon = statusConfig.icon;
                  return (
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bgColor}`}
                    >
                      <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                      <span
                        className={`text-sm font-bold ${statusConfig.color}`}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* メインカラム */}
                <div className="lg:col-span-2 space-y-6">
                  {/* 問い合わせ内容 */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      問い合わせ内容
                    </h2>
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {data.inquiry.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      送信日時: {formatDate(data.inquiry.createdAt)}
                    </div>
                  </div>

                  {/* やり取り履歴 */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-lg font-black text-gray-900 mb-4">
                      やり取り履歴
                    </h2>
                    {data.inquiry.responses &&
                    data.inquiry.responses.length > 0 ? (
                      <div className="space-y-4 mb-6">
                        {data.inquiry.responses.map((response) => (
                          <div
                            key={response.id}
                            className={`p-4 rounded-xl ${
                              response.sender === "COMPANY"
                                ? "bg-blue-50 border border-blue-100"
                                : "bg-green-50 border border-green-100"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`text-sm font-bold ${
                                  response.sender === "COMPANY"
                                    ? "text-blue-700"
                                    : "text-green-700"
                                }`}
                              >
                                {response.senderName}
                                {response.sender === "CUSTOMER" && " (あなた)"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(response.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">
                              {response.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 mb-6">
                        <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">まだ返信がありません</p>
                        <p className="text-sm text-gray-400 mt-1">
                          工務店からの返信をお待ちください
                        </p>
                      </div>
                    )}

                    {/* 返信フォーム */}
                    <form onSubmit={handleSendReply}>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        返信メッセージ
                      </label>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4 resize-none"
                        rows={6}
                        placeholder="工務店への返信メッセージを入力してください..."
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting || !replyMessage.trim()}
                        className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50"
                      >
                        <Send className="h-5 w-5" />
                        {isSubmitting ? "送信中..." : "返信を送信"}
                      </button>
                    </form>
                  </div>
                </div>

                {/* サイドカラム */}
                <div className="space-y-6">
                  {/* 工務店情報 */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      工務店情報
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">会社名</p>
                        <Link
                          href={`/companies/${data.inquiry.company.id}`}
                          className="font-bold text-gray-900 hover:text-blue-600 transition"
                        >
                          {data.inquiry.company.name}
                        </Link>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          住所
                        </p>
                        <p className="text-sm text-gray-700">
                          {data.inquiry.company.address}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          電話番号
                        </p>
                        <a
                          href={`tel:${data.inquiry.company.phoneNumber}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {data.inquiry.company.phoneNumber}
                        </a>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          メール
                        </p>
                        <a
                          href={`mailto:${data.inquiry.company.email}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {data.inquiry.company.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
