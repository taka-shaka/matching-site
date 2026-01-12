// src/app/inquiry/page.tsx
// 問い合わせフォームページ（非ログインユーザー・ログインユーザー対応）

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Send,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Mail,
  Phone,
  User,
  MessageSquare,
  Building2,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { useAuth } from "@/lib/auth-provider";

interface Company {
  id: number;
  name: string;
  prefecture: string;
  city: string;
  logoUrl: string | null;
}

// SearchParamsを使用するコンポーネントを分離
function InquiryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const companyId = searchParams.get("companyId");

  const [company, setCompany] = useState<Company | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [customerData, setCustomerData] = useState<{
    name: string;
    email: string;
    phoneNumber: string;
  } | null>(null);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);

  // 工務店への問い合わせの場合、ログイン必須
  useEffect(() => {
    if (!authLoading && companyId && !user) {
      // 現在のURL(問い合わせページ)をredirectパラメータとして保存
      const currentPath = `/inquiry?companyId=${companyId}`;
      router.push(`/signup?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [authLoading, companyId, user, router]);

  const [formData, setFormData] = useState({
    inquirerName: "",
    inquirerEmail: "",
    inquirerPhone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // 工務店情報を取得
  useEffect(() => {
    if (!companyId) {
      setIsLoadingCompany(false);
      return;
    }

    async function fetchCompany() {
      try {
        const res = await fetch(`/api/public/companies/${companyId}`);
        if (res.ok) {
          const data = await res.json();
          setCompany(data.company);
        }
      } catch (error) {
        console.error("工務店情報の取得に失敗:", error);
      } finally {
        setIsLoadingCompany(false);
      }
    }

    fetchCompany();
  }, [companyId]);

  // 工務店への問い合わせの場合、ログインユーザーの顧客情報を取得
  useEffect(() => {
    if (companyId && user) {
      setIsLoadingCustomer(true);
      fetch("/api/customer/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.customer) {
            const fullName =
              data.customer.lastName && data.customer.firstName
                ? `${data.customer.lastName} ${data.customer.firstName}`
                : data.customer.lastName || data.customer.firstName || "";

            setCustomerData({
              name: fullName,
              email: data.customer.email,
              phoneNumber: data.customer.phoneNumber || "",
            });

            setFormData((prev) => ({
              ...prev,
              inquirerName: fullName,
              inquirerEmail: data.customer.email,
              inquirerPhone: data.customer.phoneNumber || "",
            }));
          }
        })
        .catch((error) => {
          console.error("顧客情報の取得に失敗:", error);
        })
        .finally(() => {
          setIsLoadingCustomer(false);
        });
    } else if (!companyId && user?.email) {
      // 一般問い合わせの場合はメールアドレスのみ自動入力
      setFormData((prev) => ({
        ...prev,
        inquirerEmail: user.email || "",
      }));
    }
  }, [companyId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          companyId: companyId ? parseInt(companyId) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "問い合わせの送信に失敗しました");
      }

      setIsSuccess(true);

      // 3秒後にリダイレクト
      setTimeout(() => {
        if (user) {
          router.push("/customer/inquiries");
        } else {
          router.push("/");
        }
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "問い合わせの送信に失敗しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 工務店への問い合わせで認証チェック中
  if (authLoading && companyId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              送信完了しました
            </h2>
            <p className="text-gray-600 mb-6">
              問い合わせを受け付けました。担当者から折り返しご連絡いたします。
            </p>
            <Link
              href={user ? "/customer/inquiries" : "/"}
              className="inline-block px-6 py-3 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-full font-bold hover:shadow-lg transition-all duration-300"
            >
              {user ? "問い合わせ一覧へ" : "トップページへ"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-[60px]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 戻るボタン */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>戻る</span>
          </button>

          {/* ページタイトル */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              {companyId ? "工務店へのお問い合わせ" : "お問い合わせ"}
            </h1>
            <p className="text-gray-600">
              {companyId
                ? "担当者より折り返しご連絡いたします。"
                : "お気軽にお問い合わせください。担当者より折り返しご連絡いたします。"}
            </p>
          </div>

          {/* 工務店情報 */}
          {isLoadingCompany ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            </div>
          ) : (
            company && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-linear-to-br from-red-400 to-orange-400 rounded-xl flex items-center justify-center shrink-0">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">お問い合わせ先</p>
                    <h2 className="text-xl font-bold text-gray-900">
                      {company.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {company.prefecture} {company.city}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}

          {/* フォーム */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* お名前 */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  お名前
                  {!companyId && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required={!companyId}
                    value={formData.inquirerName}
                    onChange={(e) =>
                      setFormData({ ...formData, inquirerName: e.target.value })
                    }
                    disabled={!!companyId && !!customerData}
                    className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      companyId && customerData
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    placeholder="山田 太郎"
                  />
                </div>
              </div>

              {/* メールアドレス */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  メールアドレス
                  {!companyId && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required={!companyId}
                    value={formData.inquirerEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        inquirerEmail: e.target.value,
                      })
                    }
                    disabled={!!companyId && !!customerData}
                    className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      companyId && customerData
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              {/* 電話番号 */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  電話番号{!companyId && "（任意）"}
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.inquirerPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        inquirerPhone: e.target.value,
                      })
                    }
                    disabled={!!companyId && !!customerData}
                    className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      companyId && customerData
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    placeholder="090-1234-5678"
                  />
                </div>
              </div>

              {/* お問い合わせ内容 */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  お問い合わせ内容 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    placeholder="お問い合わせ内容をご記入ください..."
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  できるだけ詳しくご記入いただけますと、スムーズに対応できます。
                </p>
              </div>

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>送信中...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>送信する</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// メインのページコンポーネント（Suspenseでラップ）
export default function InquiryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      }
    >
      <InquiryForm />
    </Suspense>
  );
}
