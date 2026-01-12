"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import {
  Menu,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  MessageSquare,
  Send,
  Save,
  CheckCircle,
  Circle,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/lib/auth-provider";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface InquiryResponseItem {
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
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  internalNotes: string | null;
  createdAt: string;
  respondedAt: string | null;
  responses: InquiryResponseItem[];
}

interface InquiryResponse {
  inquiry: Inquiry;
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
    icon: XCircle,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
};

export default function AdminGeneralInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
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

  // 問い合わせ詳細取得
  const { data, error, isLoading } = useSWR<InquiryResponse>(
    `/api/admin/general-inquiries/${id}`,
    fetcher
  );

  // フォーム状態
  const [status, setStatus] = useState<string>("");
  const [internalNotes, setInternalNotes] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // データ取得後にフォームを初期化
  if (data?.inquiry && !isInitialized) {
    setStatus(data.inquiry.status);
    setInternalNotes(data.inquiry.internalNotes || "");
    setIsInitialized(true);
  }

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

  async function handleStatusChange(newStatus: string) {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/general-inquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("ステータスの更新に失敗しました");
      }

      setStatus(newStatus);
      mutate(`/api/admin/general-inquiries/${id}`);
      setSuccessMessage("ステータスを更新しました");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "ステータスの更新に失敗しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSaveNotes() {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/general-inquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ internalNotes }),
      });

      if (!response.ok) {
        throw new Error("内部メモの保存に失敗しました");
      }

      mutate(`/api/admin/general-inquiries/${id}`);
      setSuccessMessage("内部メモを保存しました");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "内部メモの保存に失敗しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/general-inquiries/${id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: replyMessage }),
      });

      if (!response.ok) {
        throw new Error("返信の送信に失敗しました");
      }

      mutate(`/api/admin/general-inquiries/${id}`);
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
            <div className="flex flex-1 items-center gap-4">
              <Link
                href="/admin/general-inquiries"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-black text-gray-900">
                一般問い合わせ詳細
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
                問い合わせが見つかりませんでした
              </p>
              <Link
                href="/admin/general-inquiries"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition inline-block"
              >
                問い合わせ一覧に戻る
              </Link>
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

              {/* ステータス変更 */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  ステータス
                </label>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => handleStatusChange(key)}
                        disabled={isSubmitting}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition disabled:opacity-50 ${
                          status === key
                            ? `${config.bgColor} border-current ${config.color}`
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-bold">
                          {config.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
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
                      受信日時: {formatDate(data.inquiry.createdAt)}
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
                              response.sender === "ADMIN"
                                ? "bg-purple-50 border border-purple-100"
                                : "bg-green-50 border border-green-100"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`text-sm font-bold ${
                                  response.sender === "ADMIN"
                                    ? "text-purple-700"
                                    : "text-green-700"
                                }`}
                              >
                                {response.senderName}
                                {response.sender === "ADMIN" && " (管理者)"}
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4 resize-none"
                        rows={6}
                        placeholder="問い合わせ者への返信メッセージを入力してください..."
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting || !replyMessage.trim()}
                        className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50"
                      >
                        <Send className="h-5 w-5" />
                        {isSubmitting ? "送信中..." : "返信を送信"}
                      </button>
                    </form>
                  </div>

                  {/* 内部メモ */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-orange-600" />
                      内部メモ（管理者専用）
                    </h2>
                    <p className="text-sm text-gray-600 mb-3">
                      ※このメモは問い合わせ者には表示されません
                    </p>
                    <textarea
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4 resize-none"
                      rows={4}
                      placeholder="管理者用のメモを入力..."
                    />
                    <button
                      onClick={handleSaveNotes}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50"
                    >
                      <Save className="h-5 w-5" />
                      {isSubmitting ? "保存中..." : "メモを保存"}
                    </button>
                  </div>
                </div>

                {/* サイドカラム */}
                <div className="space-y-6">
                  {/* 問い合わせ者情報 */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      問い合わせ者情報
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">お名前</p>
                        <p className="text-sm font-bold text-gray-900">
                          {data.inquiry.inquirerName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          メールアドレス
                        </p>
                        <a
                          href={`mailto:${data.inquiry.inquirerEmail}`}
                          className="text-sm text-blue-600 hover:text-blue-700 break-all"
                        >
                          {data.inquiry.inquirerEmail}
                        </a>
                      </div>
                      {data.inquiry.inquirerPhone && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            電話番号
                          </p>
                          <a
                            href={`tel:${data.inquiry.inquirerPhone}`}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            {data.inquiry.inquirerPhone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 対応のヒント */}
                  <div className="bg-linear-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-purple-900 mb-2">
                          対応のヒント
                        </h4>
                        <ul className="text-xs text-purple-800 space-y-1">
                          <li>• 24時間以内の返信を心がけましょう</li>
                          <li>• 丁寧で分かりやすい回答を心がけましょう</li>
                          <li>• 内部メモで対応履歴を記録しましょう</li>
                        </ul>
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
