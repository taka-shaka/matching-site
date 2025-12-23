// src/app/member/inquiries/page.tsx
// メンバー（工務店）問い合わせ管理ページ（UI実装 - モックデータ使用）

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Home,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Filter,
  ChevronDown,
  Menu,
  X,
  Mail,
  Phone,
  Calendar,
  Eye,
  CheckCircle,
  Circle,
  Clock,
  XCircle,
} from "lucide-react";

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

// 問い合わせモックデータ（Prismaスキーマに準拠）
const MOCK_INQUIRIES = [
  {
    id: 1,
    inquirerName: "鈴木花子",
    inquirerEmail: "hanako.suzuki@example.com",
    inquirerPhone: "090-1234-5678",
    message:
      "自然素材にこだわった平屋の施工事例を拝見しました。同じようなコンセプトで建築を検討しており、詳細なお話を伺いたいです。予算は3500万円程度を考えています。",
    status: "NEW" as const,
    constructionCase: {
      id: 1,
      title: "自然素材にこだわった平屋の家",
    },
    createdAt: "2024-12-20T10:30:00",
  },
  {
    id: 2,
    inquirerName: "田中一郎",
    inquirerEmail: "ichiro.tanaka@example.com",
    inquirerPhone: "080-9876-5432",
    message:
      "二世帯住宅を検討しています。モダンデザインの施工事例のような雰囲気が理想です。見学は可能でしょうか？",
    status: "IN_PROGRESS" as const,
    constructionCase: {
      id: 2,
      title: "モダンデザインの二世帯住宅",
    },
    createdAt: "2024-12-18T14:15:00",
  },
  {
    id: 3,
    inquirerName: "佐藤美咲",
    inquirerEmail: "misaki.sato@example.com",
    inquirerPhone: "070-5555-1234",
    message:
      "開放的なリビングが魅力の施工事例について質問があります。吹き抜けの断熱性や冷暖房効率について詳しく教えていただけますか？",
    status: "RESOLVED" as const,
    constructionCase: {
      id: 3,
      title: "開放的なリビングが魅力の家",
    },
    createdAt: "2024-12-15T09:45:00",
  },
  {
    id: 4,
    inquirerName: "高橋健太",
    inquirerEmail: "kenta.takahashi@example.com",
    inquirerPhone: null,
    message:
      "ZEH住宅の施工実績について詳しく知りたいです。補助金申請のサポートもしていただけますか？",
    status: "NEW" as const,
    constructionCase: null,
    createdAt: "2024-12-19T16:20:00",
  },
  {
    id: 5,
    inquirerName: "山本さくら",
    inquirerEmail: "sakura.yamamoto@example.com",
    inquirerPhone: "090-7777-8888",
    message:
      "和モダンな平屋に興味があります。土地探しから相談可能でしょうか？名古屋市内で検討しています。",
    status: "IN_PROGRESS" as const,
    constructionCase: null,
    createdAt: "2024-12-17T11:00:00",
  },
  {
    id: 6,
    inquirerName: "伊藤太郎",
    inquirerEmail: "taro.ito@example.com",
    inquirerPhone: "080-1111-2222",
    message: "見積もりをお願いしたいのですが、いつ頃伺えますか？",
    status: "CLOSED" as const,
    constructionCase: null,
    createdAt: "2024-12-10T13:30:00",
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

export default function InquiriesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<InquiryStatus>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<number | null>(null);

  function handleLogout() {
    window.location.href = "/member/login";
  }

  // フィルタリングロジック
  const filteredInquiries = MOCK_INQUIRIES.filter((inquiry) => {
    const matchesSearch =
      inquiry.inquirerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.inquirerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  function handleStatusChange(inquiryId: number, newStatus: string) {
    // TODO: 実際のステータス更新処理はAPI実装時に追加
    alert(
      `問い合わせID ${inquiryId} のステータスを「${STATUS_CONFIG[newStatus as keyof typeof STATUS_CONFIG].label}」に更新しました`
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* サイドバー */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* ヘッダー */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-gray-900">
                    メンバー管理
                  </h1>
                  <p className="text-xs text-gray-500">工務店ダッシュボード</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* 会社情報カード */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center gap-3 mb-3">
                {MOCK_MEMBER.company.logoUrl && (
                  <img
                    src={MOCK_MEMBER.company.logoUrl}
                    alt={MOCK_MEMBER.company.name}
                    className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {MOCK_MEMBER.company.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {MOCK_MEMBER.company.prefecture} {MOCK_MEMBER.company.city}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ナビゲーション */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <Link
              href="/member"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-100 transition"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">ダッシュボード</span>
            </Link>
            <Link
              href="/member/cases"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-100 transition"
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">施工事例管理</span>
            </Link>
            <Link
              href="/member/inquiries"
              className="flex items-center gap-3 px-4 py-3 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-xl shadow-lg"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">問い合わせ</span>
            </Link>
            <Link
              href="/member/company"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-100 transition"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">自社情報</span>
            </Link>
          </nav>

          {/* ユーザー情報とログアウト */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-linear-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold shadow">
                {MOCK_MEMBER.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {MOCK_MEMBER.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {MOCK_MEMBER.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="h-4 w-4" />
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      </aside>

      {/* オーバーレイ（モバイル） */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* メインコンテンツ */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                問い合わせ管理
              </h1>
              <p className="text-gray-600 mt-1">
                お客様からの問い合わせを確認・管理できます
              </p>
            </div>
          </div>

          {/* ステータス統計カード */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">全体</p>
              <p className="text-2xl font-black text-gray-900">{stats.all}</p>
            </div>
            <div className="bg-blue-50 rounded-xl shadow-lg p-4 border border-blue-100">
              <p className="text-xs text-blue-600 mb-1">新規</p>
              <p className="text-2xl font-black text-blue-900">{stats.new}</p>
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

        {/* 問い合わせ一覧 */}
        {filteredInquiries.length === 0 ? (
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
            {filteredInquiries.map((inquiry) => {
              const statusConfig =
                STATUS_CONFIG[inquiry.status as keyof typeof STATUS_CONFIG];
              const StatusIcon = statusConfig.icon;
              const isExpanded = selectedInquiry === inquiry.id;

              return (
                <div
                  key={inquiry.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
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
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
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
                        {inquiry.constructionCase && (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">
                              施工事例: {inquiry.constructionCase.title}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          setSelectedInquiry(isExpanded ? null : inquiry.id)
                        }
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>

                    {/* メッセージプレビュー */}
                    <p
                      className={`text-gray-700 ${
                        isExpanded ? "" : "line-clamp-2"
                      }`}
                    >
                      {inquiry.message}
                    </p>

                    {/* 展開時の追加コンテンツ */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">
                          ステータスを変更
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(STATUS_CONFIG).map(
                            ([status, config]) => (
                              <button
                                key={status}
                                onClick={() =>
                                  handleStatusChange(inquiry.id, status)
                                }
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
                                  inquiry.status === status
                                    ? `${config.bgColor} ${config.color} ${config.borderColor} border-2`
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                <config.icon className="h-4 w-4" />
                                {config.label}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
