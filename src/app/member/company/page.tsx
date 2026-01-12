// src/app/member/company/page.tsx
// メンバー（工務店）自社情報管理ページ

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import {
  Save,
  Upload,
  Menu,
  AlertCircle,
  Phone,
  Mail,
  Globe,
  MapPin,
  Camera,
  X,
  Loader2,
} from "lucide-react";
import MemberSidebar from "@/components/member/MemberSidebar";
import { useAuth } from "@/lib/auth-provider";
import TempImageUploader from "@/components/TempImageUploader";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Tag {
  id: number;
  name: string;
  category: string;
}

interface CompanyTag {
  id: number;
  tag: Tag;
}

interface Company {
  id: number;
  name: string;
  description: string | null;
  address: string;
  prefecture: string;
  city: string;
  phoneNumber: string;
  email: string;
  websiteUrl: string | null;
  logoUrl: string | null;
  mainImageUrl: string | null;
  establishedYear: number | null;
  employeeCount: number | null;
  businessHours: string | null;
  isPublished: boolean;
  tags: CompanyTag[];
  _count: {
    cases: number;
    members: number;
    inquiries: number;
  };
}

interface CompanyResponse {
  company: Company;
}

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

export default function CompanyPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  // 認証・役割チェック
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/member/login");
      } else if (user.userType !== "member") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  // ダッシュボードデータ取得（メンバー情報用）
  const { data: dashboardData } = useSWR("/api/member/dashboard", fetcher);

  // 会社情報取得
  const { data, error, isLoading } = useSWR<CompanyResponse>(
    "/api/member/company",
    fetcher
  );

  // フォームの状態
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [businessHours, setBusinessHours] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // データ取得後にフォームを初期化
  if (data?.company && !isInitialized) {
    setName(data.company.name);
    setDescription(data.company.description || "");
    setAddress(data.company.address);
    setPrefecture(data.company.prefecture);
    setCity(data.company.city);
    setPhoneNumber(data.company.phoneNumber);
    setEmail(data.company.email);
    setWebsiteUrl(data.company.websiteUrl || "");
    setLogoUrl(data.company.logoUrl || "");
    setMainImageUrl(data.company.mainImageUrl || "");
    setEstablishedYear(
      data.company.establishedYear ? String(data.company.establishedYear) : ""
    );
    setEmployeeCount(
      data.company.employeeCount ? String(data.company.employeeCount) : ""
    );
    setBusinessHours(data.company.businessHours || "");
    setIsInitialized(true);
  }

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "会社名は必須です";
    if (!description.trim()) newErrors.description = "会社説明は必須です";
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
    setErrors({});

    try {
      const response = await fetch("/api/member/company", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          address: address.trim(),
          prefecture,
          city: city.trim(),
          phoneNumber: phoneNumber.trim(),
          email: email.trim(),
          websiteUrl: websiteUrl.trim() || null,
          logoUrl: logoUrl.trim() || null,
          mainImageUrl: mainImageUrl.trim() || null,
          establishedYear: establishedYear ? parseInt(establishedYear) : null,
          employeeCount: employeeCount ? parseInt(employeeCount) : null,
          businessHours: businessHours.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "会社情報の更新に失敗しました");
      }

      // SWRキャッシュを更新
      mutate("/api/member/company");

      setSuccessMessage("会社情報を保存しました");
      window.scrollTo({ top: 0, behavior: "smooth" });

      // 3秒後にメッセージを消す
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : "保存に失敗しました",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
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
  if (!user || user.userType !== "member") {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-green-50 to-teal-50">
      {/* サイドバー */}
      <MemberSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        memberName={dashboardData?.member.name || user?.email || "メンバー"}
        companyName={dashboardData?.company.name || data?.company.name || ""}
        memberRole={dashboardData?.member.role || "GENERAL"}
      />

      {/* メインコンテンツ */}
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
                自社情報管理
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {dashboardData?.member.name || user?.email}
              </span>
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
              <AlertCircle className="h-16 w-16 text-blue-500 mx-auto mb-4" />
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
                <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="font-medium text-green-900">
                      {successMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* エラーメッセージ */}
              {Object.keys(errors).length > 0 && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold text-blue-900 mb-2">
                        入力内容に問題があります
                      </p>
                      <ul className="text-sm text-blue-800 space-y-1">
                        {Object.values(errors).map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* フォーム */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 基本情報 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-xl font-black text-gray-900 mb-6">
                    基本情報
                  </h2>

                  {/* 会社名 */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      会社名 <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="例：株式会社ナゴヤホーム"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                        errors.name ? "border-blue-500" : "border-gray-300"
                      }`}
                    />
                  </div>

                  {/* 会社説明 */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      会社説明 <span className="text-blue-600">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="会社の特徴や強みを入力してください"
                      rows={6}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none ${
                        errors.description
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>

                  {/* 創業年・従業員数 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        創業年
                      </label>
                      <input
                        type="number"
                        value={establishedYear}
                        onChange={(e) => setEstablishedYear(e.target.value)}
                        placeholder="1994"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        従業員数
                      </label>
                      <input
                        type="number"
                        value={employeeCount}
                        onChange={(e) => setEmployeeCount(e.target.value)}
                        placeholder="25"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* 連絡先情報 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-xl font-black text-gray-900 mb-6">
                    連絡先情報
                  </h2>

                  {/* 住所 */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      住所 <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="例：愛知県名古屋市中区錦3-15-15"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                        errors.address ? "border-blue-500" : "border-gray-300"
                      }`}
                    />
                  </div>

                  {/* 都道府県・市区町村 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        都道府県 <span className="text-blue-600">*</span>
                      </label>
                      <select
                        value={prefecture}
                        onChange={(e) => setPrefecture(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                          errors.prefecture
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
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
                        市区町村 <span className="text-blue-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="例：名古屋市中区"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                          errors.city ? "border-blue-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                  </div>

                  {/* 電話番号・メール */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <Phone className="inline h-4 w-4 mr-1" />
                        電話番号 <span className="text-blue-600">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="052-123-4567"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                          errors.phoneNumber
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <Mail className="inline h-4 w-4 mr-1" />
                        メールアドレス <span className="text-blue-600">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="info@nagoya-home.co.jp"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                          errors.email ? "border-blue-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                  </div>

                  {/* ウェブサイト・営業時間 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <Globe className="inline h-4 w-4 mr-1" />
                        ウェブサイトURL
                      </label>
                      <input
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://nagoya-home.co.jp"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        営業時間
                      </label>
                      <input
                        type="text"
                        value={businessHours}
                        onChange={(e) => setBusinessHours(e.target.value)}
                        placeholder="9:00 - 18:00（定休日：水曜日）"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* 画像 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-xl font-black text-gray-900 mb-6">
                    <Camera className="inline h-6 w-6 mr-2" />
                    画像
                  </h2>

                  {/* ロゴ */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      会社ロゴ
                    </label>
                    {logoUrl ? (
                      <div className="flex items-center gap-6">
                        <img
                          src={logoUrl}
                          alt="会社ロゴ"
                          className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-3">
                            推奨サイズ: 400 x 400px (正方形)
                          </p>
                          <button
                            type="button"
                            onClick={() => setLogoUrl("")}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                          >
                            <X className="h-4 w-4" />
                            <span className="font-medium">ロゴを削除</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <TempImageUploader
                        onUploadComplete={(url) => setLogoUrl(url)}
                        label="ロゴをアップロード"
                        description="推奨サイズ: 400 x 400px (正方形)"
                      />
                    )}
                  </div>

                  {/* メイン画像 */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      メイン画像
                    </label>
                    {mainImageUrl ? (
                      <div className="relative">
                        <img
                          src={mainImageUrl}
                          alt="メイン画像"
                          className="w-full h-64 object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => setMainImageUrl("")}
                          className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <TempImageUploader
                        onUploadComplete={(url) => setMainImageUrl(url)}
                        label="メイン画像をアップロード"
                        description="推奨サイズ: 1200 x 600px"
                      />
                    )}
                  </div>
                </div>

                {/* 保存ボタン */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-5 w-5" />
                    <span className="font-bold">
                      {isSubmitting ? "保存中..." : "変更を保存"}
                    </span>
                  </button>
                </div>
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
