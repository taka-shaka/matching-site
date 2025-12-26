// src/app/admin/companies/[id]/page.tsx
// 管理者 工務店詳細・編集ページ（UI実装 - モックデータ使用）

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  ArrowLeft,
  Save,
  CheckCircle,
  XCircle,
  Upload,
  Trash2,
  AlertCircle,
  Building2,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

// モックデータ
const MOCK_ADMIN = {
  id: 1,
  name: "管理者 太郎",
  email: "admin@matching-site.jp",
  role: "SUPER_ADMIN",
};

// 工務店詳細モックデータ
const MOCK_COMPANY_DATA: Record<string, any> = {
  "1": {
    id: 1,
    name: "株式会社ナゴヤホーム",
    description:
      "愛知県を中心に、お客様の理想の住まいづくりをサポートしています。自然素材を活かした快適な住空間の提案を得意としており、創業以来30年の実績があります。",
    address: "愛知県名古屋市中区錦3-15-15",
    prefecture: "愛知県",
    city: "名古屋市中区",
    phoneNumber: "052-123-4567",
    email: "info@nagoya-home.co.jp",
    websiteUrl: "https://nagoya-home.co.jp",
    logoUrl: "https://placehold.co/400x400/f97316/white?text=Logo",
    isPublished: true,
    createdAt: "2024-01-15",
  },
  "2": {
    id: 2,
    name: "株式会社豊田ハウジング",
    description:
      "豊田市を拠点に、高品質な注文住宅を提供しています。お客様一人ひとりのライフスタイルに合わせた設計と、確かな技術力が強みです。",
    address: "愛知県豊田市若宮町1-1-1",
    prefecture: "愛知県",
    city: "豊田市",
    phoneNumber: "0565-987-6543",
    email: "contact@toyota-housing.co.jp",
    websiteUrl: "https://toyota-housing.co.jp",
    logoUrl: "https://placehold.co/400x400/ea580c/white?text=Logo",
    isPublished: true,
    createdAt: "2023-11-20",
  },
};

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

export default function CompanyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // フォーム状態
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // データ読み込み（モック）
  useEffect(() => {
    setTimeout(() => {
      const companyData = MOCK_COMPANY_DATA[params.id];
      if (companyData) {
        setName(companyData.name);
        setDescription(companyData.description);
        setAddress(companyData.address);
        setPrefecture(companyData.prefecture);
        setCity(companyData.city);
        setPhoneNumber(companyData.phoneNumber);
        setEmail(companyData.email);
        setWebsiteUrl(companyData.websiteUrl || "");
        setLogoUrl(companyData.logoUrl || "");
        setIsPublished(companyData.isPublished);
      }
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "会社名は必須です";
    if (!address.trim()) newErrors.address = "住所は必須です";
    if (!prefecture) newErrors.prefecture = "都道府県は必須です";
    if (!city.trim()) newErrors.city = "市区町村は必須です";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "電話番号は必須です";
    if (!email.trim()) newErrors.email = "メールアドレスは必須です";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");

    // TODO: 実際の保存処理はAPI実装時に追加
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage("工務店情報を更新しました");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  }

  async function handleDelete() {
    // TODO: 実際の削除処理はAPI実装時に追加
    setTimeout(() => {
      alert("工務店を削除しました");
      router.push("/admin/companies");
    }, 500);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* サイドバー */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        adminName={MOCK_ADMIN.name}
        adminRole={MOCK_ADMIN.role as "SUPER_ADMIN" | "ADMIN"}
      />

      {/* メインコンテンツ */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link
              href="/admin/companies"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-gray-900">
                工務店詳細・編集
              </h1>
              <p className="text-gray-600 mt-1">
                工務店情報の確認・編集ができます
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200"
            >
              <Trash2 className="h-5 w-5" />
              <span className="font-medium hidden sm:inline">削除</span>
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="font-medium text-green-900">{successMessage}</p>
            </div>
          </div>
        )}

        {Object.keys(errors).length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-red-900 mb-2">
                  入力内容に問題があります
                </p>
                <ul className="text-sm text-red-800 space-y-1">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 公開ステータス */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-black text-gray-900 mb-4">
              公開ステータス
            </h2>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsPublished(true)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${isPublished ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                <CheckCircle className="h-5 w-5" />
                <span className="font-bold">公開</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPublished(false)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${!isPublished ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                <XCircle className="h-5 w-5" />
                <span className="font-bold">非公開</span>
              </button>
            </div>
          </div>

          {/* 基本情報 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-black text-gray-900 mb-6">基本情報</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  会社名 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.name ? "border-red-500" : "border-gray-300"}`}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  会社説明
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    都道府県 <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={prefecture}
                    onChange={(e) => setPrefecture(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.prefecture ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">選択してください</option>
                    {PREFECTURES.map((pref) => (
                      <option key={pref} value={pref}>
                        {pref}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    市区町村 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.city ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  住所 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.address ? "border-red-500" : "border-gray-300"}`}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    電話番号 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.phoneNumber ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    メールアドレス <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  ウェブサイトURL
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* ロゴ画像 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-black text-gray-900 mb-6">ロゴ画像</h2>
            {logoUrl ? (
              <div className="flex items-center gap-6">
                <img
                  src={logoUrl}
                  alt="ロゴ"
                  className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-3">現在のロゴ</p>
                  <button
                    type="button"
                    onClick={() =>
                      setLogoUrl(
                        "https://placehold.co/400x400/f97316/white?text=New+Logo"
                      )
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="font-medium">ロゴを変更（モック）</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <button
                  type="button"
                  onClick={() =>
                    setLogoUrl(
                      "https://placehold.co/400x400/f97316/white?text=Logo"
                    )
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  ロゴをアップロード（モック）
                </button>
              </div>
            )}
          </div>

          {/* 保存ボタン */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              <span className="font-bold">
                {isSubmitting ? "保存中..." : "変更を保存"}
              </span>
            </button>
          </div>
        </form>
      </main>

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  工務店を削除しますか?
                </h3>
                <p className="text-gray-600 text-sm">
                  この操作は取り消せません。関連するメンバー、施工事例、問い合わせもすべて削除されます。
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
