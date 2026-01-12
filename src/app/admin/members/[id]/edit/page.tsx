// src/app/admin/members/[id]/edit/page.tsx
// 管理者 メンバー編集ページ

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import {
  User,
  Menu,
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Mail,
  Building2,
  Shield,
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

interface CompaniesResponse {
  companies: Company[];
}

interface Member {
  id: number;
  authId: string;
  email: string;
  name: string;
  role: "ADMIN" | "GENERAL";
  companyId: number;
  isActive: boolean;
  company: Company;
}

interface MemberResponse {
  member: Member;
}

interface FormData {
  name: string;
  email: string;
  role: "ADMIN" | "GENERAL";
  companyId: string;
  isActive: boolean;
}

export default function AdminMemberEditPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "GENERAL",
    companyId: "",
    isActive: true,
  });

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

  // メンバー詳細取得
  const { data: memberData, error: memberError } = useSWR<MemberResponse>(
    memberId ? `/api/admin/members/${memberId}` : null,
    fetcher
  );

  // 工務店一覧取得
  const { data: companiesData } = useSWR<CompaniesResponse>(
    "/api/admin/companies?limit=1000",
    fetcher
  );

  // メンバーデータをフォームに反映
  useEffect(() => {
    if (memberData?.member) {
      const member = memberData.member;
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
        companyId: member.companyId.toString(),
        isActive: member.isActive,
      });
    }
  }, [memberData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          companyId: parseInt(formData.companyId),
          isActive: formData.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "メンバーの更新に失敗しました");
      }

      setSuccessMessage("メンバー情報を更新しました");

      // 2秒後に一覧ページへ遷移
      setTimeout(() => {
        router.push("/admin/members");
        router.refresh();
      }, 2000);
    } catch (err) {
      console.error("Update error:", err);
      setError(
        err instanceof Error ? err.message : "更新処理中にエラーが発生しました"
      );
      setIsLoading(false);
    }
  }

  function handleChange(field: keyof FormData, value: string | boolean) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // ローディング中の処理
  if (loading || !memberData) {
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

  // メンバー取得エラー
  if (memberError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          adminName={user?.email || "管理者"}
          adminRole="ADMIN"
        />
        <div className="lg:pl-64">
          <div className="sticky top-0 z-10 flex h-16 shrink-0 bg-white border-b border-gray-200">
            <button
              type="button"
              className="px-4 text-gray-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <main className="p-4 lg:p-8">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium mb-4">
                メンバー情報の取得に失敗しました
              </p>
              <Link
                href="/admin/members"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
              >
                メンバー一覧に戻る
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const member = memberData.member;

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
            <div className="flex flex-1 items-center gap-3">
              <Link
                href="/admin/members"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-black text-gray-900">
                メンバー編集
              </h1>
            </div>
            <div className="flex items-center gap-3"></div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <main className="p-4 lg:p-8">
          {/* エラー表示 */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* 成功メッセージ */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-green-600 shrink-0" />
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            </div>
          )}

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            {/* メンバー基本情報 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                メンバー基本情報
              </h2>

              <div className="space-y-4">
                {/* メンバー名 */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    メンバー名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="山田 太郎"
                  />
                </div>

                {/* メールアドレス */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="member@company.co.jp"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    メールアドレスを変更するとSupabase
                    Authのメールアドレスも更新されます
                  </p>
                </div>

                {/* 所属工務店 */}
                <div>
                  <label
                    htmlFor="companyId"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    所属工務店 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      id="companyId"
                      required
                      value={formData.companyId}
                      onChange={(e) =>
                        handleChange("companyId", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white"
                    >
                      <option value="">選択してください</option>
                      {companiesData?.companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name} ({company.prefecture} {company.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 役割 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    役割 <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition">
                      <input
                        type="radio"
                        name="role"
                        value="ADMIN"
                        checked={formData.role === "ADMIN"}
                        onChange={(e) => handleChange("role", e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">管理者</p>
                        <p className="text-sm text-gray-600">
                          工務店情報の編集、施工事例の管理、メンバー管理が可能
                        </p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition">
                      <input
                        type="radio"
                        name="role"
                        value="GENERAL"
                        checked={formData.role === "GENERAL"}
                        onChange={(e) => handleChange("role", e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">一般</p>
                        <p className="text-sm text-gray-600">
                          施工事例の投稿・編集、お問い合わせ対応が可能
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* ステータス */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    ステータス <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition">
                      <input
                        type="radio"
                        name="isActive"
                        value="true"
                        checked={formData.isActive === true}
                        onChange={() => handleChange("isActive", true)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">アクティブ</p>
                        <p className="text-sm text-gray-600">
                          ログイン可能で、すべての機能を利用できます
                        </p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition">
                      <input
                        type="radio"
                        name="isActive"
                        value="false"
                        checked={formData.isActive === false}
                        onChange={() => handleChange("isActive", false)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">非アクティブ</p>
                        <p className="text-sm text-gray-600">
                          ログインできず、機能の利用が制限されます
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 情報表示 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-bold mb-1">認証情報について</p>
                  <p>
                    パスワードの変更はこのページでは行えません。パスワードをリセットする必要がある場合は、別途パスワードリセット機能をご利用ください。
                  </p>
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    更新中...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    更新する
                  </>
                )}
              </button>

              <Link
                href="/admin/members"
                className="px-8 py-4 bg-white text-gray-700 rounded-xl font-bold border-2 border-gray-300 hover:bg-gray-50 transition"
              >
                キャンセル
              </Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
