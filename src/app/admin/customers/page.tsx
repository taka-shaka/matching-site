// src/app/admin/customers/page.tsx
// 管理者 顧客管理一覧ページ

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Menu,
  Search,
  Filter,
  ChevronDown,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  MessageSquare,
  Ban,
  UserCircle,
  Loader2,
  AlertCircle,
  Trash2,
  Eye,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/lib/auth-provider";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Inquiry {
  id: number;
  status: string;
  createdAt: string;
  company: {
    id: number;
    name: string;
  };
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
  _count: {
    inquiries: number;
  };
  inquiries: Inquiry[];
}

interface CustomersResponse {
  customers: Customer[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

type StatusFilter = "all" | "active" | "inactive";

export default function AdminCustomersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
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

  // 顧客一覧取得
  const apiUrl = (() => {
    const params = new URLSearchParams();
    if (filterStatus === "active") params.append("isActive", "true");
    if (filterStatus === "inactive") params.append("isActive", "false");
    const queryString = params.toString();
    return queryString
      ? `/api/admin/customers?${queryString}`
      : "/api/admin/customers";
  })();

  const { data, error, isLoading, mutate } = useSWR<CustomersResponse>(
    apiUrl,
    fetcher
  );

  // ステータストグル処理
  async function handleToggleStatus(
    customerId: number,
    customerName: string,
    currentStatus: boolean
  ) {
    if (togglingId) return;

    const confirmMessage = currentStatus
      ? `顧客「${customerName}」を非アクティブにしますか？`
      : `顧客「${customerName}」をアクティブにしますか？`;

    if (!confirm(confirmMessage)) return;

    setTogglingId(customerId);

    try {
      const response = await fetch(`/api/admin/customers/${customerId}`, {
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
  async function handleDelete(customerId: number, customerName: string) {
    if (deletingId) return;

    if (
      !confirm(
        `顧客「${customerName}」を削除しますか？\n\nこの操作は取り消せません。関連する問い合わせ履歴も削除され、認証アカウントも削除されます。`
      )
    ) {
      return;
    }

    setDeletingId(customerId);

    try {
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "顧客の削除に失敗しました");
      }

      // データを再取得
      await mutate();
      alert("顧客を削除しました");
    } catch (error) {
      console.error("Failed to delete customer:", error);
      alert(
        error instanceof Error ? error.message : "顧客の削除に失敗しました"
      );
    } finally {
      setDeletingId(null);
    }
  }

  // ローカル検索フィルター
  const filteredCustomers = data?.customers.filter((customer) => {
    const fullName = `${customer.lastName}${customer.firstName}`;
    return (
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.phoneNumber && customer.phoneNumber.includes(searchQuery))
    );
  });

  // 統計計算
  const stats = {
    total: data?.pagination.total || 0,
    active: data?.customers.filter((c) => c.isActive).length || 0,
    inactive: data?.customers.filter((c) => !c.isActive).length || 0,
    totalInquiries:
      data?.customers.reduce((sum, c) => sum + c._count.inquiries, 0) || 0,
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
              <h1 className="text-2xl font-black text-gray-900">顧客管理</h1>
            </div>
            <div className="flex items-center gap-3"></div>
          </div>
        </div>

        <main className="p-4 lg:p-8">
          {/* アクションバー */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* 検索バー */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="顧客名、メール、電話番号で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
                      : filterStatus === "active"
                        ? "アクティブ"
                        : "非アクティブ"}
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
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                    >
                      すべて ({stats.total})
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus("active");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                    >
                      アクティブ ({stats.active})
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus("inactive");
                        setShowFilterDropdown(false);
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">全顧客</p>
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
                  <p className="text-sm text-gray-600 mb-1">総問い合わせ数</p>
                  <p className="text-3xl font-black text-gray-900">
                    {stats.totalInquiries}
                  </p>
                </div>
              </div>

              {/* 顧客一覧 */}
              {filteredCustomers && filteredCustomers.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
                  <UserCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    {searchQuery
                      ? "検索条件に一致する顧客が見つかりませんでした"
                      : "まだ顧客が登録されていません"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCustomers?.map((customer) => (
                    <div
                      key={customer.id}
                      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-black text-gray-900">
                                {customer.lastName} {customer.firstName}
                              </h3>
                              <span
                                className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full ${
                                  customer.isActive
                                    ? "bg-green-100 text-green-700 border border-green-200"
                                    : "bg-gray-100 text-gray-700 border border-gray-200"
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
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {customer.email}
                              </span>
                              {customer.phoneNumber && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  {customer.phoneNumber}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-600">
                                最終ログイン:{" "}
                                <span className="text-gray-900">
                                  {customer.lastLoginAt
                                    ? formatDateTime(customer.lastLoginAt)
                                    : "未ログイン"}
                                </span>
                              </span>
                              <span className="text-gray-600">
                                登録日:{" "}
                                <span className="text-gray-900">
                                  {formatDate(customer.createdAt)}
                                </span>
                              </span>
                              <span className="flex items-center gap-1 text-gray-600">
                                <MessageSquare className="h-4 w-4" />
                                問い合わせ:{" "}
                                <span className="text-gray-900 font-bold">
                                  {customer._count.inquiries}件
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* アクション */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              router.push(`/admin/customers/${customer.id}`)
                            }
                            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition border border-blue-200"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="font-medium">詳細を見る</span>
                          </button>
                          <button
                            onClick={() =>
                              handleToggleStatus(
                                customer.id,
                                `${customer.lastName} ${customer.firstName}`,
                                customer.isActive
                              )
                            }
                            disabled={togglingId === customer.id}
                            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition border ${
                              togglingId === customer.id
                                ? "opacity-50 cursor-not-allowed"
                                : customer.isActive
                                  ? "text-orange-600 border-orange-200 hover:bg-orange-50"
                                  : "text-green-600 border-green-200 hover:bg-green-50"
                            }`}
                          >
                            {togglingId === customer.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="font-medium">処理中...</span>
                              </>
                            ) : customer.isActive ? (
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
                              handleDelete(
                                customer.id,
                                `${customer.lastName} ${customer.firstName}`
                              )
                            }
                            disabled={deletingId === customer.id}
                            className={`flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200 ${
                              deletingId === customer.id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {deletingId === customer.id ? (
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
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
