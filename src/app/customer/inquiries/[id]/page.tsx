"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  ArrowLeft,
  Building2,
  FileText,
  Calendar,
  Mail,
  Phone,
  User,
  MessageSquare,
  CheckCircle,
  Clock,
  Circle,
  XCircle,
  MapPin,
} from "lucide-react";
import CustomerSidebar from "@/components/customer/CustomerSidebar";

// モックデータ
const MOCK_CUSTOMER = {
  id: 1,
  firstName: "花子",
  lastName: "山田",
  email: "hanako.yamada@example.com",
};

const MOCK_INQUIRY_DETAILS: Record<string, any> = {
  "1": {
    id: 1,
    inquirerName: "山田花子",
    inquirerEmail: "hanako.yamada@example.com",
    inquirerPhone: "090-1234-5678",
    companyId: 1,
    companyName: "株式会社ナゴヤホーム",
    companyEmail: "info@nagoya-home.co.jp",
    companyPhone: "052-123-4567",
    companyAddress: "愛知県名古屋市中区錦3-15-15",
    caseId: 1,
    caseTitle: "自然素材にこだわった和モダンの家",
    message:
      "自然素材にこだわった平屋の施工事例を拝見しました。同じようなコンセプトで建築を検討しており、詳細なお話を伺いたいです。予算は3500万円程度を考えています。ぜひ一度ご相談させていただければと思います。",
    status: "NEW",
    createdAt: "2024-12-20T10:30:00",
    respondedAt: null,
    internalNotes: null,
    responses: [],
  },
  "2": {
    id: 2,
    inquirerName: "山田花子",
    inquirerEmail: "hanako.yamada@example.com",
    inquirerPhone: "090-1234-5678",
    companyId: 2,
    companyName: "株式会社豊田ハウジング",
    companyEmail: "info@toyota-housing.co.jp",
    companyPhone: "0565-987-6543",
    companyAddress: "愛知県豊田市若宮町1-1",
    caseId: 2,
    caseTitle: "モダンデザインの二世帯住宅",
    message:
      "二世帯住宅を検討しています。モダンデザインの施工事例のような雰囲気が理想です。見学は可能でしょうか？",
    status: "IN_PROGRESS",
    createdAt: "2024-12-18T14:15:00",
    respondedAt: "2024-12-19T10:00:00",
    internalNotes: "見学希望あり",
    responses: [
      {
        id: 1,
        sender: "工務店",
        message:
          "お問い合わせありがとうございます。モデルハウスの見学は随時受け付けております。来週末のご都合はいかがでしょうか？",
        createdAt: "2024-12-19T10:00:00",
      },
    ],
  },
  "3": {
    id: 3,
    inquirerName: "山田花子",
    inquirerEmail: "hanako.yamada@example.com",
    inquirerPhone: "090-1234-5678",
    companyId: 3,
    companyName: "岐阜建設株式会社",
    companyEmail: "info@gifu-kensetsu.co.jp",
    companyPhone: "058-123-4567",
    companyAddress: "岐阜県岐阜市金町5-1",
    caseId: 3,
    caseTitle: "開放的なリビングが魅力の家",
    message:
      "開放的なリビングが魅力の施工事例について質問があります。吹き抜けの断熱性や冷暖房効率について詳しく教えていただけますか？",
    status: "RESOLVED",
    createdAt: "2024-12-15T09:45:00",
    respondedAt: "2024-12-16T11:30:00",
    internalNotes: "断熱性に関する質問",
    responses: [
      {
        id: 1,
        sender: "工務店",
        message:
          "お問い合わせいただきありがとうございます。吹き抜けの断熱性についてですが、当社では高性能断熱材を使用しており、冷暖房効率も良好です。詳しい資料をお送りいたします。",
        createdAt: "2024-12-16T11:30:00",
      },
      {
        id: 2,
        sender: "顧客",
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

export default function CustomerInquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const inquiryId = params.id as string;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const inquiry = MOCK_INQUIRY_DETAILS[inquiryId];

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">
            問い合わせが見つかりませんでした
          </p>
          <Link
            href="/customer/inquiries"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            問い合わせ一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig =
    STATUS_CONFIG[inquiry.status as keyof typeof STATUS_CONFIG];
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50">
      {/* サイドバー */}
      <CustomerSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        customerName={`${MOCK_CUSTOMER.lastName} ${MOCK_CUSTOMER.firstName}`}
        customerEmail={MOCK_CUSTOMER.email}
      />

      {/* メインコンテンツ */}
      <div className="lg:pl-64">
        {/* トップバー */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white border-b border-gray-200">
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
          {/* ステータスバッジ */}
          <div className="mb-6">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bgColor}`}
            >
              <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
              <span className={`text-sm font-bold ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
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
                    {inquiry.message}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  送信日時: {formatDate(inquiry.createdAt)}
                </div>
              </div>

              {/* やり取り履歴 */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-lg font-black text-gray-900 mb-4">
                  やり取り履歴
                </h2>
                {inquiry.responses && inquiry.responses.length > 0 ? (
                  <div className="space-y-4">
                    {inquiry.responses.map((response: any) => (
                      <div
                        key={response.id}
                        className={`p-4 rounded-xl ${
                          response.sender === "工務店"
                            ? "bg-blue-50 border border-blue-100"
                            : "bg-green-50 border border-green-100"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-sm font-bold ${
                              response.sender === "工務店"
                                ? "text-blue-700"
                                : "text-green-700"
                            }`}
                          >
                            {response.sender}
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
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">まだ返信がありません</p>
                    <p className="text-sm text-gray-400 mt-1">
                      工務店からの返信をお待ちください
                    </p>
                  </div>
                )}
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
                      href={`/companies/${inquiry.companyId}`}
                      className="font-bold text-gray-900 hover:text-blue-600 transition"
                    >
                      {inquiry.companyName}
                    </Link>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      住所
                    </p>
                    <p className="text-sm text-gray-700">
                      {inquiry.companyAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      電話番号
                    </p>
                    <p className="text-sm text-gray-700">
                      {inquiry.companyPhone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      メール
                    </p>
                    <p className="text-sm text-gray-700">
                      {inquiry.companyEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* 関連施工事例 */}
              {inquiry.caseId && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    関連施工事例
                  </h3>
                  <Link
                    href={`/cases/${inquiry.caseId}`}
                    className="block p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                  >
                    <p className="font-bold text-gray-900 text-sm mb-1">
                      {inquiry.caseTitle}
                    </p>
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      詳細を見る →
                    </p>
                  </Link>
                </div>
              )}

              {/* あなたの情報 */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  あなたの情報
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">お名前</p>
                    <p className="text-sm font-bold text-gray-900">
                      {inquiry.inquirerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">メールアドレス</p>
                    <p className="text-sm text-gray-700">
                      {inquiry.inquirerEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">電話番号</p>
                    <p className="text-sm text-gray-700">
                      {inquiry.inquirerPhone}
                    </p>
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
