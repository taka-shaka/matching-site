"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Filter,
  MessageSquare,
  Building2,
  FileText,
  Calendar,
  Eye,
  CheckCircle,
  Circle,
  Clock,
  XCircle,
  ChevronDown,
} from "lucide-react";
import CustomerSidebar from "@/components/customer/CustomerSidebar";

// モックデータ
const MOCK_CUSTOMER = {
  id: 1,
  firstName: "花子",
  lastName: "山田",
  email: "hanako.yamada@example.com",
};

// 問い合わせモックデータ
const MOCK_INQUIRIES = [
  {
    id: 1,
    companyName: "株式会社ナゴヤホーム",
    companyId: 1,
    caseTitle: "自然素材にこだわった和モダンの家",
    caseId: 1,
    message:
      "自然素材にこだわった平屋の施工事例を拝見しました。同じようなコンセプトで建築を検討しており、詳細なお話を伺いたいです。予算は3500万円程度を考えています。",
    status: "NEW" as const,
    createdAt: "2024-12-20T10:30:00",
    respondedAt: null,
  },
  {
    id: 2,
    companyName: "株式会社豊田ハウジング",
    companyId: 2,
    caseTitle: "モダンデザインの二世帯住宅",
    caseId: 2,
    message:
      "二世帯住宅を検討しています。モダンデザインの施工事例のような雰囲気が理想です。見学は可能でしょうか？",
    status: "IN_PROGRESS" as const,
    createdAt: "2024-12-18T14:15:00",
    respondedAt: "2024-12-19T10:00:00",
  },
  {
    id: 3,
    companyName: "岐阜建設株式会社",
    companyId: 3,
    caseTitle: "開放的なリビングが魅力の家",
    caseId: 3,
    message:
      "開放的なリビングが魅力の施工事例について質問があります。吹き抜けの断熱性や冷暖房効率について詳しく教えていただけますか？",
    status: "RESOLVED" as const,
    createdAt: "2024-12-15T09:45:00",
    respondedAt: "2024-12-16T11:30:00",
  },
  {
    id: 4,
    companyName: "三重ホームズ株式会社",
    companyId: 4,
    caseTitle: null,
    caseId: null,
    message:
      "ZEH住宅の施工実績について詳しく知りたいです。補助金申請のサポートもしていただけますか？",
    status: "NEW" as const,
    createdAt: "2024-12-19T16:20:00",
    respondedAt: null,
  },
  {
    id: 5,
    companyName: "株式会社ナゴヤホーム",
    companyId: 1,
    caseTitle: null,
    caseId: null,
    message:
      "和モダンな平屋に興味があります。土地探しから相談可能でしょうか？名古屋市内で検討しています。",
    status: "IN_PROGRESS" as const,
    createdAt: "2024-12-17T11:00:00",
    respondedAt: "2024-12-17T15:30:00",
  },
  {
    id: 6,
    companyName: "株式会社豊田ハウジング",
    companyId: 2,
    caseTitle: null,
    caseId: null,
    message: "見積もりをお願いしたいのですが、いつ頃伺えますか？",
    status: "CLOSED" as const,
    createdAt: "2024-12-10T13:30:00",
    respondedAt: "2024-12-11T09:00:00",
  },
];

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<InquiryStatus>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // フィルタリングロジック
  const filteredInquiries = MOCK_INQUIRIES.filter((inquiry) => {
    const matchesSearch =
      inquiry.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inquiry.caseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || inquiry.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    all: MOCK_INQUIRIES.length,
    new: MOCK_INQUIRIES.filter((i) => i.status === "NEW").length,
    inProgress: MOCK_INQUIRIES.filter((i) => i.status === "IN_PROGRESS").length,
    resolved: MOCK_INQUIRIES.filter((i) => i.status === "RESOLVED").length,
    closed: MOCK_INQUIRIES.filter((i) => i.status === "CLOSED").length,
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
                placeholder="工務店名、施工事例、メッセージで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 問い合わせ一覧 */}
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
                  STATUS_CONFIG[inquiry.status as keyof typeof STATUS_CONFIG];
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
                            {inquiry.companyName}
                          </h3>
                        </div>
                        {inquiry.caseTitle && (
                          <div className="flex items-center gap-3 mb-2">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <p className="text-sm text-gray-600">
                              {inquiry.caseTitle}
                            </p>
                          </div>
                        )}
                      </div>
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bgColor} flex-shrink-0`}
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
        </main>
      </div>
    </div>
  );
}
