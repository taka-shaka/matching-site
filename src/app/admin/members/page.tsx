"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  Search,
  Filter,
  ChevronDown,
  Mail,
  CheckCircle,
  XCircle,
  Calendar,
  Eye,
  Ban,
  Building2,
  Users,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

// モック管理者データ
const MOCK_ADMIN = {
  name: "管理者 太郎",
  email: "admin@matching-site.jp",
  role: "SUPER_ADMIN" as const,
};

// モックメンバーデータ (Prismaスキーマに準拠)
const MOCK_MEMBERS = [
  {
    id: 1,
    authId: "auth_member_001",
    email: "tanaka@nagoya-home.co.jp",
    name: "田中一郎",
    role: "ADMIN" as const,
    companyId: 1,
    companyName: "株式会社ナゴヤホーム",
    isActive: true,
    lastLoginAt: "2024-03-15T10:30:00",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    authId: "auth_member_002",
    email: "suzuki@nagoya-home.co.jp",
    name: "鈴木花子",
    role: "GENERAL" as const,
    companyId: 1,
    companyName: "株式会社ナゴヤホーム",
    isActive: true,
    lastLoginAt: "2024-03-14T15:20:00",
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    authId: "auth_member_003",
    email: "sato@osaka-build.jp",
    name: "佐藤次郎",
    role: "ADMIN" as const,
    companyId: 2,
    companyName: "大阪ビルダーズ株式会社",
    isActive: true,
    lastLoginAt: "2024-03-15T09:15:00",
    createdAt: "2024-01-25",
  },
  {
    id: 4,
    authId: "auth_member_004",
    email: "takahashi@osaka-build.jp",
    name: "高橋美咲",
    role: "GENERAL" as const,
    companyId: 2,
    companyName: "大阪ビルダーズ株式会社",
    isActive: true,
    lastLoginAt: "2024-03-13T14:45:00",
    createdAt: "2024-02-01",
  },
  {
    id: 5,
    authId: "auth_member_005",
    email: "watanabe@kyoto-kobo.com",
    name: "渡辺健太",
    role: "ADMIN" as const,
    companyId: 3,
    companyName: "京都工房",
    isActive: false,
    lastLoginAt: "2024-02-20T11:00:00",
    createdAt: "2024-01-10",
  },
  {
    id: 6,
    authId: "auth_member_006",
    email: "kobayashi@kyoto-kobo.com",
    name: "小林真理子",
    role: "GENERAL" as const,
    companyId: 3,
    companyName: "京都工房",
    isActive: true,
    lastLoginAt: "2024-03-14T16:30:00",
    createdAt: "2024-02-05",
  },
  {
    id: 7,
    authId: "auth_member_007",
    email: "yamamoto@kobe-house.co.jp",
    name: "山本大輔",
    role: "ADMIN" as const,
    companyId: 4,
    companyName: "神戸ハウジング",
    isActive: true,
    lastLoginAt: "2024-03-15T08:45:00",
    createdAt: "2024-02-10",
  },
  {
    id: 8,
    authId: "auth_member_008",
    email: "nakamura@kobe-house.co.jp",
    name: "中村あゆみ",
    role: "GENERAL" as const,
    companyId: 4,
    companyName: "神戸ハウジング",
    isActive: true,
    lastLoginAt: "2024-03-15T11:20:00",
    createdAt: "2024-02-15",
  },
];

// ロール設定
const ROLE_CONFIG = {
  ADMIN: {
    label: "管理者",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-200",
  },
  GENERAL: {
    label: "一般",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
  },
};

export default function AdminMembersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "ADMIN" | "GENERAL">(
    "all"
  );
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // 統計計算
  const stats = {
    total: MOCK_MEMBERS.length,
    active: MOCK_MEMBERS.filter((m) => m.isActive).length,
    inactive: MOCK_MEMBERS.filter((m) => !m.isActive).length,
    admin: MOCK_MEMBERS.filter((m) => m.role === "ADMIN").length,
    general: MOCK_MEMBERS.filter((m) => m.role === "GENERAL").length,
  };

  // フィルタリング処理
  const filteredMembers = MOCK_MEMBERS.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.companyName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === "all" || member.role === filterRole;

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && member.isActive) ||
      (filterStatus === "inactive" && !member.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  function formatDateTime(dateString: string) {
    return new Date(dateString).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handleToggleActive(memberId: number) {
    // TODO: 実際のアクティブ/非アクティブ切り替え処理はAPI実装時に追加
    alert(`メンバーID ${memberId} のアクティブステータスを切り替えました`);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* サイドバー */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        adminName={MOCK_ADMIN.name}
        adminRole={MOCK_ADMIN.role}
      />

      {/* メインコンテンツ */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                メンバー管理
              </h1>
              <p className="text-gray-600 mt-1">
                工務店メンバーの確認・管理ができます
              </p>
            </div>
          </div>

          {/* アクションバー */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* 検索バー */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="メンバー名、メール、工務店名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* ロールフィルター */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                >
                  <Filter className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-700">
                    {filterRole === "all"
                      ? "すべてのロール"
                      : ROLE_CONFIG[filterRole].label}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {showRoleDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10">
                    <button
                      onClick={() => {
                        setFilterRole("all");
                        setShowRoleDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                    >
                      すべて ({stats.total})
                    </button>
                    <button
                      onClick={() => {
                        setFilterRole("ADMIN");
                        setShowRoleDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                    >
                      管理者 ({stats.admin})
                    </button>
                    <button
                      onClick={() => {
                        setFilterRole("GENERAL");
                        setShowRoleDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                    >
                      一般 ({stats.general})
                    </button>
                  </div>
                )}
              </div>

              {/* ステータスフィルター */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                >
                  <Filter className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-700">
                    {filterStatus === "all"
                      ? "すべて"
                      : filterStatus === "active"
                        ? "アクティブ"
                        : "非アクティブ"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {showStatusDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10">
                    <button
                      onClick={() => {
                        setFilterStatus("all");
                        setShowStatusDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                    >
                      すべて ({stats.total})
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus("active");
                        setShowStatusDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                    >
                      アクティブ ({stats.active})
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus("inactive");
                        setShowStatusDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                    >
                      非アクティブ ({stats.inactive})
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">全メンバー</p>
            <p className="text-3xl font-black text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">アクティブ</p>
            <p className="text-3xl font-black text-gray-900">{stats.active}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">非アクティブ</p>
            <p className="text-3xl font-black text-gray-900">
              {stats.inactive}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">管理者</p>
            <p className="text-3xl font-black text-gray-900">{stats.admin}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">一般</p>
            <p className="text-3xl font-black text-gray-900">{stats.general}</p>
          </div>
        </div>

        {/* メンバー一覧 */}
        {filteredMembers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              {searchQuery
                ? "検索条件に一致するメンバーが見つかりませんでした"
                : "まだメンバーが登録されていません"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMembers.map((member) => {
              const roleConfig = ROLE_CONFIG[member.role];

              return (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-black text-gray-900">
                            {member.name}
                          </h3>
                          <span
                            className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full ${roleConfig.bgColor} ${roleConfig.color} ${roleConfig.borderColor} border`}
                          >
                            {roleConfig.label}
                          </span>
                          <span
                            className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full ${
                              member.isActive
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                            }`}
                          >
                            {member.isActive ? (
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
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {member.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {member.companyName}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600">
                            最終ログイン:{" "}
                            <span className="text-gray-900">
                              {member.lastLoginAt
                                ? formatDateTime(member.lastLoginAt)
                                : "未ログイン"}
                            </span>
                          </span>
                          <span className="text-gray-600">
                            登録日:{" "}
                            <span className="text-gray-900">
                              {member.createdAt}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* アクション */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/companies/${member.companyId}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition border border-blue-200"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">所属工務店を見る</span>
                      </Link>
                      <button
                        onClick={() => handleToggleActive(member.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition border ${
                          member.isActive
                            ? "text-orange-600 hover:bg-orange-50 border-orange-200"
                            : "text-green-600 hover:bg-green-50 border-green-200"
                        }`}
                      >
                        {member.isActive ? (
                          <>
                            <Ban className="h-4 w-4" />
                            <span className="font-medium">
                              非アクティブにする
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-medium">
                              アクティブにする
                            </span>
                          </>
                        )}
                      </button>
                    </div>
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
