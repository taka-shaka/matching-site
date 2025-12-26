// src/app/member/company/page.tsx
// メンバー（工務店）自社情報管理ページ（UI実装 - モックデータ使用）

"use client";

import { useState } from "react";
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
} from "lucide-react";
import MemberSidebar from "@/components/member/MemberSidebar";

// モックデータ
const MOCK_MEMBER = {
  id: 1,
  name: "山田太郎",
  email: "yamada@nagoya-home.co.jp",
  role: "ADMIN",
  company: {
    id: 1,
    name: "株式会社ナゴヤホーム",
    prefecture: "愛知県",
    city: "名古屋市中区",
    logoUrl: "https://placehold.co/120x120/f97316/white?text=NH",
  },
};

// 会社情報モックデータ（Prismaスキーマに準拠）
const MOCK_COMPANY_DATA = {
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
  mainImageUrl: "https://placehold.co/1200x600/ea580c/white?text=Company+Image",
  establishedYear: 1994,
  employeeCount: 25,
  businessHours: "9:00 - 18:00（定休日：水曜日）",
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

export default function CompanyPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // フォームの状態
  const [name, setName] = useState(MOCK_COMPANY_DATA.name);
  const [description, setDescription] = useState(MOCK_COMPANY_DATA.description);
  const [address, setAddress] = useState(MOCK_COMPANY_DATA.address);
  const [prefecture, setPrefecture] = useState(MOCK_COMPANY_DATA.prefecture);
  const [city, setCity] = useState(MOCK_COMPANY_DATA.city);
  const [phoneNumber, setPhoneNumber] = useState(MOCK_COMPANY_DATA.phoneNumber);
  const [email, setEmail] = useState(MOCK_COMPANY_DATA.email);
  const [websiteUrl, setWebsiteUrl] = useState(MOCK_COMPANY_DATA.websiteUrl);
  const [logoUrl, setLogoUrl] = useState(MOCK_COMPANY_DATA.logoUrl);
  const [mainImageUrl, setMainImageUrl] = useState(
    MOCK_COMPANY_DATA.mainImageUrl
  );
  const [establishedYear, setEstablishedYear] = useState(
    String(MOCK_COMPANY_DATA.establishedYear)
  );
  const [employeeCount, setEmployeeCount] = useState(
    String(MOCK_COMPANY_DATA.employeeCount)
  );
  const [businessHours, setBusinessHours] = useState(
    MOCK_COMPANY_DATA.businessHours
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

    // TODO: 実際の保存処理はAPI実装時に追加
    // 現在はUI実装のみ - モック保存
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage("会社情報を保存しました");
      window.scrollTo({ top: 0, behavior: "smooth" });

      // 3秒後にメッセージを消す
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* サイドバー */}
      <MemberSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        memberName={MOCK_MEMBER.name}
        memberRole={MOCK_MEMBER.role}
        companyName={MOCK_MEMBER.company.name}
        companyPrefecture={MOCK_MEMBER.company.prefecture}
        companyCity={MOCK_MEMBER.company.city}
      />

      {/* メインコンテンツ */}
      <div className="lg:pl-64">
        <main className="p-4 lg:p-8 overflow-y-auto">
          {/* ヘッダー */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  自社情報管理
                </h1>
                <p className="text-gray-600 mt-1">
                  工務店の基本情報を編集・管理できます
                </p>
              </div>
            </div>
          </div>

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
                <p className="font-medium text-green-900">{successMessage}</p>
              </div>
            </div>
          )}

          {/* エラーメッセージ */}
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
                  会社名 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例：株式会社ナゴヤホーム"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              {/* 会社説明 */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  会社説明 <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="会社の特徴や強みを入力してください"
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none ${
                    errors.description ? "border-red-500" : "border-gray-300"
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
                  住所 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="例：愛知県名古屋市中区錦3-15-15"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              {/* 都道府県・市区町村 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    都道府県 <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={prefecture}
                    onChange={(e) => setPrefecture(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                      errors.prefecture ? "border-red-500" : "border-gray-300"
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
                    市区町村 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="例：名古屋市中区"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
              </div>

              {/* 電話番号・メール */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    電話番号 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="052-123-4567"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                      errors.phoneNumber ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    メールアドレス <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@nagoya-home.co.jp"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                      errors.email ? "border-red-500" : "border-gray-300"
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
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  会社ロゴ
                </label>
                <div className="flex items-center gap-6">
                  {logoUrl && (
                    <img
                      src={logoUrl}
                      alt="会社ロゴ"
                      className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-3">
                      推奨サイズ: 400 x 400px (正方形)
                    </p>
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
              </div>

              {/* メイン画像 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
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
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-500 transition">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      クリックまたはドラッグ&ドロップで画像をアップロード
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      推奨サイズ: 1200 x 600px
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setMainImageUrl(
                          "https://placehold.co/1200x600/f97316/white?text=Company+Image"
                        )
                      }
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                    >
                      画像を選択（モック）
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 保存ボタン */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" />
                <span className="font-bold">
                  {isSubmitting ? "保存中..." : "変更を保存"}
                </span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
