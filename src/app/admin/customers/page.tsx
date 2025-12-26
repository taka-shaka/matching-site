"use client";

import { useState } from "react";
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
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

// モック管理者データ
const MOCK_ADMIN = {
  name: "管理者 太郎",
  email: "admin@matching-site.jp",
  role: "SUPER_ADMIN" as const,
};

// モック顧客データ (Prismaスキーマに準拠)
const MOCK_CUSTOMERS = [
  {
    id: 1,
    authId: "auth_customer_001",
    email: "customer1@example.com",
    lastName: "山田",
    firstName: "太郎",
    phoneNumber: "090-1234-5678",
    isActive: true,
    lastLoginAt: "2024-03-15T14:30:00",
    createdAt: "2024-01-10",
    inquiryCount: 3,
  },
  {
    id: 2,
    authId: "auth_customer_002",
    email: "customer2@example.com",
    lastName: "佐藤",
    firstName: "花子",
    phoneNumber: "080-2345-6789",
    isActive: true,
    lastLoginAt: "2024-03-14T10:15:00",
    createdAt: "2024-01-15",
    inquiryCount: 2,
  },
  {
    id: 3,
    authId: "auth_customer_003",
    email: "customer3@example.com",
    lastName: "鈴木",
    firstName: "一郎",
    phoneNumber: "090-3456-7890",
    isActive: true,
    lastLoginAt: "2024-03-13T16:45:00",
    createdAt: "2024-01-20",
    inquiryCount: 5,
  },
  {
    id: 4,
    authId: "auth_customer_004",
    email: "customer4@example.com",
    lastName: "田中",
    firstName: "美咲",
    phoneNumber: "070-4567-8901",
    isActive: false,
    lastLoginAt: "2024-02-20T09:30:00",
    createdAt: "2024-01-25",
    inquiryCount: 1,
  },
  {
    id: 5,
    authId: "auth_customer_005",
    email: "customer5@example.com",
    lastName: "高橋",
    firstName: "健太",
    phoneNumber: "080-5678-9012",
    isActive: true,
    lastLoginAt: "2024-03-15T11:20:00",
    createdAt: "2024-02-01",
    inquiryCount: 4,
  },
  {
    id: 6,
    authId: "auth_customer_006",
    email: "customer6@example.com",
    lastName: "渡辺",
    firstName: "あゆみ",
    phoneNumber: "090-6789-0123",
    isActive: true,
    lastLoginAt: "2024-03-14T15:50:00",
    createdAt: "2024-02-05",
    inquiryCount: 2,
  },
  {
    id: 7,
    authId: "auth_customer_007",
    email: "customer7@example.com",
    lastName: "伊藤",
    firstName: "大輔",
    phoneNumber: "070-7890-1234",
    isActive: true,
    lastLoginAt: "2024-03-15T08:40:00",
    createdAt: "2024-02-10",
    inquiryCount: 1,
  },
  {
    id: 8,
    authId: "auth_customer_008",
    email: "customer8@example.com",
    lastName: "中村",
    firstName: "真理子",
    phoneNumber: "080-8901-2345",
    isActive: true,
    lastLoginAt: "2024-03-12T13:25:00",
    createdAt: "2024-02-15",
    inquiryCount: 3,
  },
];

export default function AdminCustomersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // 統計計算
  const stats = {
    total: MOCK_CUSTOMERS.length,
    active: MOCK_CUSTOMERS.filter((c) => c.isActive).length,
    inactive: MOCK_CUSTOMERS.filter((c) => !c.isActive).length,
    totalInquiries: MOCK_CUSTOMERS.reduce((sum, c) => sum + c.inquiryCount, 0),
  };

  // フィルタリング処理
  const filteredCustomers = MOCK_CUSTOMERS.filter((customer) => {
    const fullName = `${customer.lastName}${customer.firstName}`;
    const matchesSearch =
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.phoneNumber && customer.phoneNumber.includes(searchQuery));

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && customer.isActive) ||
      (filterStatus === "inactive" && !customer.isActive);

    return matchesSearch && matchesStatus;
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

  function handleToggleActive(customerId: number) {
    // TODO: 実際のアクティブ/非アクティブ切り替え処理はAPI実装時に追加
    alert(`顧客ID ${customerId} のアクティブステータスを切り替えました`);
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
              <h1 className="text-3xl font-black text-gray-900">顧客管理</h1>
              <p className="text-gray-600 mt-1">
                登録顧客の確認・管理ができます
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
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">全顧客</p>
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
            <p className="text-sm text-gray-600 mb-1">総問い合わせ数</p>
            <p className="text-3xl font-black text-gray-900">
              {stats.totalInquiries}
            </p>
          </div>
        </div>

        {/* 顧客一覧 */}
        {filteredCustomers.length === 0 ? (
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
            {filteredCustomers.map((customer) => (
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
                            {customer.createdAt}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <MessageSquare className="h-4 w-4" />
                          問い合わせ:{" "}
                          <span className="text-gray-900 font-bold">
                            {customer.inquiryCount}件
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* アクション */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(customer.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition border ${
                        customer.isActive
                          ? "text-orange-600 hover:bg-orange-50 border-orange-200"
                          : "text-green-600 hover:bg-green-50 border-green-200"
                      }`}
                    >
                      {customer.isActive ? (
                        <>
                          <Ban className="h-4 w-4" />
                          <span className="font-medium">
                            非アクティブにする
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">アクティブにする</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
