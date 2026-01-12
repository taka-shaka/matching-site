// src/app/admin/companies/new/page.tsx
// 管理者 工務店新規登録ページ

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Menu,
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  Lock,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/lib/auth-provider";

// 都道府県リスト
const PREFECTURES = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];

interface FormData {
  // 工務店情報
  name: string;
  description: string;
  prefecture: string;
  city: string;
  address: string;
  phoneNumber: string;
  email: string;
  websiteUrl: string;
  isPublished: boolean;

  // 管理者メンバー情報
  memberName: string;
  memberEmail: string;
  memberPassword: string;
}

export default function AdminCompanyNewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    prefecture: "",
    city: "",
    address: "",
    phoneNumber: "",
    email: "",
    websiteUrl: "",
    isPublished: false,
    memberName: "",
    memberEmail: "",
    memberPassword: "",
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "工務店の登録に失敗しました");
      }

      // 成功したら一覧ページへ
      router.push("/admin/companies");
      router.refresh();
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err instanceof Error ? err.message : "登録処理中にエラーが発生しました"
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
            <div className="flex flex-1 items-center gap-3">
              <Link
                href="/admin/companies"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-black text-gray-900">
                工務店新規登録
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

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 工務店基本情報 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                工務店基本情報
              </h2>

              <div className="space-y-4">
                {/* 工務店名 */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    工務店名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="株式会社〇〇工務店"
                  />
                </div>

                {/* 説明 */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    説明
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="工務店の特徴や強みを入力してください"
                  />
                </div>

                {/* 都道府県・市区町村 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="prefecture"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      都道府県 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        id="prefecture"
                        required
                        value={formData.prefecture}
                        onChange={(e) =>
                          handleChange("prefecture", e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white"
                      >
                        <option value="">選択してください</option>
                        {PREFECTURES.map((pref) => (
                          <option key={pref} value={pref}>
                            {pref}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      市区町村 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="名古屋市中区"
                    />
                  </div>
                </div>

                {/* 住所 */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    住所 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="〇〇1-2-3"
                  />
                </div>

                {/* 電話番号・メールアドレス */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      電話番号 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="phoneNumber"
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          handleChange("phoneNumber", e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="052-123-4567"
                      />
                    </div>
                  </div>

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
                        placeholder="info@company.co.jp"
                      />
                    </div>
                  </div>
                </div>

                {/* ウェブサイトURL */}
                <div>
                  <label
                    htmlFor="websiteUrl"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    ウェブサイトURL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="websiteUrl"
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) =>
                        handleChange("websiteUrl", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="https://www.example.com"
                    />
                  </div>
                </div>

                {/* 公開状態 */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) =>
                        handleChange("isPublished", e.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      登録後すぐに公開する
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* 管理者メンバー情報 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                管理者メンバー情報
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                工務店の管理者となるメンバーアカウントを作成します
              </p>

              <div className="space-y-4">
                {/* メンバー名 */}
                <div>
                  <label
                    htmlFor="memberName"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    メンバー名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="memberName"
                    type="text"
                    required
                    value={formData.memberName}
                    onChange={(e) => handleChange("memberName", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="山田 太郎"
                  />
                </div>

                {/* メンバーメールアドレス */}
                <div>
                  <label
                    htmlFor="memberEmail"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    メンバーメールアドレス{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="memberEmail"
                      type="email"
                      required
                      value={formData.memberEmail}
                      onChange={(e) =>
                        handleChange("memberEmail", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="member@company.co.jp"
                    />
                  </div>
                </div>

                {/* メンバーパスワード */}
                <div>
                  <label
                    htmlFor="memberPassword"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    メンバーパスワード <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="memberPassword"
                      type="password"
                      required
                      minLength={8}
                      value={formData.memberPassword}
                      onChange={(e) =>
                        handleChange("memberPassword", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="8文字以上"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    8文字以上で設定してください
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
                    登録中...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    登録する
                  </>
                )}
              </button>

              <Link
                href="/admin/companies"
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
