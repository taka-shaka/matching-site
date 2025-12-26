// src/app/member/inquiries/[id]/page.tsx
// メンバー（工務店）問い合わせ詳細・返信ページ（UI実装 - モックデータ使用）

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";
import MemberSidebar from "@/components/member/MemberSidebar";

// モックデータ
const MOCK_MEMBER = {
  id: 1,
  name: "山田太郎",
  email: "yamada@nagoya-home.co.jp",
  role: "ADMIN",
  company: {
    id: 1,
    name: "株式会社ナゴヤホーム",
    prefecture: "愛知県",
    city: "名古屋市中区",
    logoUrl: "https://placehold.co/120x120/f97316/white?text=NH",
  },
};

// 問い合わせ詳細モックデータ
const MOCK_INQUIRY_DETAILS: Record<string, any> = {
  "1": {
    id: 1,
    inquirerName: "鈴木花子",
    inquirerEmail: "hanako.suzuki@example.com",
    inquirerPhone: "090-1234-5678",
    customerId: 5,
    message:
      "自然素材にこだわった平屋の施工事例を拝見しました。同じようなコンセプトで建築を検討しており、詳細なお話を伺いたいです。予算は3500万円程度を考えています。ぜひ一度ご相談させていただければと思います。",
    status: "NEW",
    constructionCase: {
      id: 1,
      title: "自然素材にこだわった平屋の家",
    },
    createdAt: "2024-12-20T10:30:00",
    respondedAt: null,
    internalNotes: "",
    responses: [],
  },
  "2": {
    id: 2,
    inquirerName: "田中一郎",
    inquirerEmail: "ichiro.tanaka@example.com",
    inquirerPhone: "080-9876-5432",
    customerId: 6,
    message:
      "二世帯住宅を検討しています。モダンデザインの施工事例のような雰囲気が理想です。見学は可能でしょうか？",
    status: "IN_PROGRESS",
    constructionCase: {
      id: 2,
      title: "モダンデザインの二世帯住宅",
    },
    createdAt: "2024-12-18T14:15:00",
    respondedAt: "2024-12-19T10:00:00",
    internalNotes: "見学希望あり。来週末で調整中。",
    responses: [
      {
        id: 1,
        sender: "member",
        senderName: "山田太郎",
        message:
          "お問い合わせありがとうございます。モデルハウスの見学は随時受け付けております。来週末のご都合はいかがでしょうか？",
        createdAt: "2024-12-19T10:00:00",
      },
      {
        id: 2,
        sender: "customer",
        senderName: "田中一郎",
        message: "ありがとうございます。来週土曜日の午前中は都合がよいです。",
        createdAt: "2024-12-19T15:30:00",
      },
    ],
  },
  "3": {
    id: 3,
    inquirerName: "佐藤美咲",
    inquirerEmail: "misaki.sato@example.com",
    inquirerPhone: "070-5555-1234",
    customerId: 7,
    message:
      "開放的なリビングが魅力の施工事例について質問があります。吹き抜けの断熱性や冷暖房効率について詳しく教えていただけますか？",
    status: "RESOLVED",
    constructionCase: {
      id: 3,
      title: "開放的なリビングが魅力の家",
    },
    createdAt: "2024-12-15T09:45:00",
    respondedAt: "2024-12-16T11:30:00",
    internalNotes: "断熱性の資料送付済み。",
    responses: [
      {
        id: 1,
        sender: "member",
        senderName: "山田太郎",
        message:
          "お問い合わせいただきありがとうございます。吹き抜けの断熱性についてですが、当社では高性能断熱材を使用しており、冷暖房効率も良好です。詳しい資料をメールでお送りいたします。",
        createdAt: "2024-12-16T11:30:00",
      },
      {
        id: 2,
        sender: "customer",
        senderName: "佐藤美咲",
        message:
          "詳しい説明ありがとうございました。資料を確認させていただきます。",
        createdAt: "2024-12-16T14:00:00",
      },
    ],
  },
};

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

export default function MemberInquiryDetailPage() {
  const params = useParams();
  const inquiryId = params.id as string;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const inquiry = MOCK_INQUIRY_DETAILS[inquiryId];

  // フォーム状態
  const [status, setStatus] = useState(inquiry?.status || "NEW");
  const [internalNotes, setInternalNotes] = useState(
    inquiry?.internalNotes || ""
  );
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">
            問い合わせが見つかりませんでした
          </p>
          <Link
            href="/member/inquiries"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            問い合わせ一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
  const StatusIcon = statusConfig.icon;

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

  function handleStatusChange(newStatus: string) {
    setStatus(newStatus);
    setSuccessMessage("ステータスを更新しました");
    setTimeout(() => setSuccessMessage(""), 3000);
  }

  function handleSaveNotes() {
    setIsSubmitting(true);
    // TODO: API実装時に実際の保存処理を追加
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage("内部メモを保存しました");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  }

  function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setIsSubmitting(true);
    // TODO: API実装時に実際の返信送信処理を追加
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage("返信を送信しました");
      setReplyMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* サイドバー */}
      <MemberSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        memberName={MOCK_MEMBER.name}
        memberRole={MOCK_MEMBER.role}
        companyName={MOCK_MEMBER.company.name}
        companyPrefecture={MOCK_MEMBER.company.prefecture}
        companyCity={MOCK_MEMBER.company.city}
      />

      {/* メインコンテンツ */}
      <div className="lg:pl-64">
        <main className="p-4 lg:p-8 overflow-y-auto">
          {/* ヘッダー */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link
                href="/member/inquiries"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex-1">
                <h1 className="text-3xl font-black text-gray-900">
                  問い合わせ詳細
                </h1>
                <p className="text-gray-600 mt-1">ID: #{inquiry.id}</p>
              </div>
            </div>
          </div>

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
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition ${
                      status === key
                        ? `${config.bgColor} border-current ${config.color}`
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-bold">{config.label}</span>
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
                  <MessageSquare className="h-5 w-5 text-red-600" />
                  問い合わせ内容
                </h2>
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {inquiry.message}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  受信日時: {formatDate(inquiry.createdAt)}
                </div>
              </div>

              {/* やり取り履歴 */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-lg font-black text-gray-900 mb-4">
                  やり取り履歴
                </h2>
                {inquiry.responses && inquiry.responses.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {inquiry.responses.map((response: any) => (
                      <div
                        key={response.id}
                        className={`p-4 rounded-xl ${
                          response.sender === "member"
                            ? "bg-red-50 border border-red-100"
                            : "bg-blue-50 border border-blue-100"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-sm font-bold ${
                              response.sender === "member"
                                ? "text-red-700"
                                : "text-blue-700"
                            }`}
                          >
                            {response.senderName}
                            {response.sender === "member" && " (自社)"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(response.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                    rows={6}
                    placeholder="顧客への返信メッセージを入力してください..."
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !replyMessage.trim()}
                    className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50"
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
                  内部メモ（社内共有用）
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  ※このメモは顧客には表示されません
                </p>
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
                  rows={4}
                  placeholder="社内共有用のメモを入力..."
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  {isSubmitting ? "保存中..." : "メモを保存"}
                </button>
              </div>
            </div>

            {/* サイドカラム */}
            <div className="space-y-6">
              {/* 顧客情報 */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-red-600" />
                  顧客情報
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">お名前</p>
                    <p className="text-sm font-bold text-gray-900">
                      {inquiry.inquirerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      メールアドレス
                    </p>
                    <a
                      href={`mailto:${inquiry.inquirerEmail}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {inquiry.inquirerEmail}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      電話番号
                    </p>
                    <a
                      href={`tel:${inquiry.inquirerPhone}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {inquiry.inquirerPhone}
                    </a>
                  </div>
                </div>
              </div>

              {/* 関連施工事例 */}
              {inquiry.constructionCase && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-red-600" />
                    関連施工事例
                  </h3>
                  <Link
                    href={`/member/cases/${inquiry.constructionCase.id}/edit`}
                    className="block p-3 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl hover:shadow-md transition border border-red-100"
                  >
                    <p className="font-bold text-gray-900 text-sm mb-1">
                      {inquiry.constructionCase.title}
                    </p>
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      編集ページを開く →
                    </p>
                  </Link>
                </div>
              )}

              {/* アクションヒント */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-900 mb-2">
                      対応のヒント
                    </h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• 24時間以内の返信を心がけましょう</li>
                      <li>• 具体的な日程や金額を提示しましょう</li>
                      <li>• 内部メモで進捗を共有しましょう</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
