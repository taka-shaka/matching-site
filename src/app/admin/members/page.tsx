// src/app/admin/members/page.tsx
// 管理者 メンバー管理一覧ページ

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import {
  Menu,
  Search,
  Filter,
  ChevronDown,
  Mail,
  CheckCircle,
  XCircle,
  Ban,
  Building2,
  Users,
  Loader2,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/lib/auth-provider";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Company {
  id: number;
  name: string;
  prefecture: string;
  city: string;
}

interface Member {
  id: number;
  authId: string;
  email: string;
  name: string;
  role: "ADMIN" | "GENERAL";
  companyId: number;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  company: Company;
}

interface MembersResponse {
  members: Member[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

type RoleFilter = "all" | "ADMIN" | "GENERAL";
type StatusFilter = "all" | "active" | "inactive";

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
  const [filterRole, setFilterRole] = useState<RoleFilter>("all");
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
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

  // メンバー一覧取得
  const apiUrl = (() => {
    const params = new URLSearchParams();
    if (filterRole !== "all") params.append("role", filterRole);
    if (filterStatus === "active") params.append("isActive", "true");
    if (filterStatus === "inactive") params.append("isActive", "false");
    const queryString = params.toString();
    return queryString
      ? `/api/admin/members?${queryString}`
      : "/api/admin/members";
  })();

  const { data, error, isLoading, mutate } = useSWR<MembersResponse>(
    apiUrl,
    fetcher
  );

  // ローカル検索フィルター
  const filteredMembers = data?.members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 統計計算
  const stats = {
    total: data?.pagination.total || 0,
    active: data?.members.filter((m) => m.isActive).length || 0,
    inactive: data?.members.filter((m) => !m.isActive).length || 0,
    admin: data?.members.filter((m) => m.role === "ADMIN").length || 0,
    general: data?.members.filter((m) => m.role === "GENERAL").length || 0,
  };

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

  // ステータストグル処理
  async function handleToggleStatus(memberId: number, currentStatus: boolean) {
    if (togglingId) return;

    const confirmMessage = currentStatus
      ? "このメンバーを非アクティブにしますか？"
      : "このメンバーをアクティブにしますか？";

    if (!confirm(confirmMessage)) return;

    setTogglingId(memberId);

    try {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "ステータスの更新に失敗しました");
      }

      // データを再取得
      await mutate();
      alert("ステータスを更新しました");
    } catch (error) {
      console.error("Failed to toggle status:", error);
      alert(
        error instanceof Error
          ? error.message
          : "ステータスの更新に失敗しました"
      );
    } finally {
      setTogglingId(null);
    }
  }

  // 削除処理
  async function handleDelete(memberId: number, memberName: string) {
    if (deletingId) return;

    if (
      !confirm(
        `メンバー「${memberName}」を削除しますか？\n\nこの操作は取り消せません。関連する施工事例も削除されます。`
      )
    ) {
      return;
    }

    setDeletingId(memberId);

    try {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "メンバーの削除に失敗しました");
      }

      // データを再取得
      await mutate();
      alert("メンバーを削除しました");
    } catch (error) {
      console.error("Failed to delete member:", error);
      alert(
        error instanceof Error ? error.message : "メンバーの削除に失敗しました"
      );
    } finally {
      setDeletingId(null);
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
                メンバー管理
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/members/new"
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">新規登録</span>
              </Link>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <main className="p-4 lg:p-8">
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
              {/* 統計カード */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">全メンバー</p>
                  <p className="text-3xl font-black text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">アクティブ</p>
                  <p className="text-3xl font-black text-gray-900">
                    {stats.active}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">非アクティブ</p>
                  <p className="text-3xl font-black text-gray-900">
                    {stats.inactive}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">管理者</p>
                  <p className="text-3xl font-black text-gray-900">
                    {stats.admin}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">一般</p>
                  <p className="text-3xl font-black text-gray-900">
                    {stats.general}
                  </p>
                </div>
              </div>

              {/* メンバー一覧 */}
              {filteredMembers && filteredMembers.length === 0 ? (
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
                  {filteredMembers?.map((member) => {
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
                                  {member.company.name}
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
                                    {formatDate(member.createdAt)}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* アクション */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/admin/companies/${member.companyId}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition border border-blue-200"
                            >
                              <Building2 className="h-4 w-4" />
                              <span className="font-medium">
                                所属工務店を見る
                              </span>
                            </Link>
                            <button
                              onClick={() =>
                                handleToggleStatus(member.id, member.isActive)
                              }
                              disabled={togglingId === member.id}
                              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition border ${
                                togglingId === member.id
                                  ? "opacity-50 cursor-not-allowed"
                                  : member.isActive
                                    ? "text-orange-600 border-orange-200 hover:bg-orange-50"
                                    : "text-green-600 border-green-200 hover:bg-green-50"
                              }`}
                            >
                              {togglingId === member.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span className="font-medium">処理中...</span>
                                </>
                              ) : member.isActive ? (
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
                            <button
                              onClick={() =>
                                router.push(`/admin/members/${member.id}/edit`)
                              }
                              className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition border border-purple-200"
                            >
                              <Edit2 className="h-4 w-4" />
                              <span className="font-medium">編集</span>
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(member.id, member.name)
                              }
                              disabled={deletingId === member.id}
                              className={`flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200 ${
                                deletingId === member.id
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {deletingId === member.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span className="font-medium">削除中...</span>
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4" />
                                  <span className="font-medium">削除</span>
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
