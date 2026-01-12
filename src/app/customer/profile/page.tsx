"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import {
  Menu,
  Save,
  User,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import CustomerSidebar from "@/components/customer/CustomerSidebar";
import { useAuth } from "@/lib/auth-provider";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Customer {
  id: number;
  email: string;
  lastName: string | null;
  firstName: string | null;
  phoneNumber: string | null;
}

interface ProfileResponse {
  customer: Customer;
}

export default function CustomerProfilePage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();

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

  // プロフィールデータ取得
  const { data, error, isLoading } = useSWR<ProfileResponse>(
    "/api/customer/profile",
    fetcher
  );

  // プロフィールフォーム
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // データ取得後にフォームを初期化
  useEffect(() => {
    if (data?.customer) {
      setLastName(data.customer.lastName || "");
      setFirstName(data.customer.firstName || "");
      setPhoneNumber(data.customer.phoneNumber || "");
    }
  }, [data]);

  // ローディング中
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // 未認証または顧客以外
  if (!user || user.userType !== "customer") {
    return null;
  }

  function validateProfileForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!lastName.trim()) newErrors.lastName = "姓は必須です";
    if (!firstName.trim()) newErrors.firstName = "名は必須です";
    if (phoneNumber && !/^[0-9-]+$/.test(phoneNumber)) {
      newErrors.phoneNumber = "電話番号の形式が正しくありません";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateProfileForm()) return;

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrors({});

    try {
      const res = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lastName,
          firstName,
          phoneNumber: phoneNumber || null,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.error || "プロフィールの更新に失敗しました"
        );
      }

      // SWRキャッシュを更新
      mutate("/api/customer/profile");
      mutate("/api/customer/dashboard");

      setSuccessMessage("プロフィールを更新しました");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrors({
        submit:
          err instanceof Error
            ? err.message
            : "プロフィールの更新に失敗しました",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const customerName =
    data?.customer.lastName && data?.customer.firstName
      ? `${data.customer.lastName} ${data.customer.firstName}`
      : user?.email || "ゲスト";

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-red-50 to-pink-50">
      {/* サイドバー */}
      <CustomerSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        customerName={customerName}
        customerEmail={data?.customer.email || user?.email || ""}
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
            <div className="flex flex-1 items-center">
              <h1 className="text-2xl font-black text-gray-900">
                プロフィール編集
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
              {/* 成功メッセージ */}
              {successMessage && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-medium text-green-800">
                    {successMessage}
                  </p>
                </div>
              )}

              {/* エラーメッセージ */}
              {errors.submit && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-sm font-medium text-red-800">
                    {errors.submit}
                  </p>
                </div>
              )}

              {/* プロフィール編集フォーム */}
              <div className="mb-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-linear-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900">
                      基本情報
                    </h2>
                  </div>

                  <form onSubmit={handleProfileSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* 姓 */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          姓 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.lastName
                              ? "border-red-300"
                              : "border-gray-300"
                          } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                          placeholder="山田"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.lastName}
                          </p>
                        )}
                      </div>

                      {/* 名 */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          名 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.firstName
                              ? "border-red-300"
                              : "border-gray-300"
                          } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                          placeholder="花子"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      {/* メールアドレス（読み取り専用） */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          <Mail className="inline h-4 w-4 mr-1" />
                          メールアドレス
                        </label>
                        <input
                          type="email"
                          value={data.customer.email}
                          disabled
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          ※メールアドレスは変更できません
                        </p>
                      </div>

                      {/* 電話番号 */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          <Phone className="inline h-4 w-4 mr-1" />
                          電話番号
                        </label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.phoneNumber
                              ? "border-red-300"
                              : "border-gray-300"
                          } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                          placeholder="090-1234-5678"
                        />
                        {errors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          保存中...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          変更を保存
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
