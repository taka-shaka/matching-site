// src/app/member/cases/[id]/edit/page.tsx
// メンバー（工務店）施工事例編集ページ（UI実装 - モックデータ使用）

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Home,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Menu,
  AlertCircle,
  Trash2,
} from "lucide-react";

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

// 既存の施工事例データ（モック）
const MOCK_CASE_DATA = {
  1: {
    id: 1,
    title: "自然素材にこだわった平屋の家",
    description:
      "木のぬくもりを感じられる、自然素材をふんだんに使った平屋住宅。無垢材のフローリングと珪藻土の壁が特徴です。",
    prefecture: "愛知県",
    city: "名古屋市中区",
    buildingArea: "95.5",
    budget: "3500",
    completionYear: "2024",
    mainImageUrl: "https://placehold.co/800x600/f97316/white?text=Case+1",
    status: "PUBLISHED" as const,
    selectedTags: [1, 7, 10],
    additionalImages: [
      "https://placehold.co/800x600/f97316/white?text=Add+1",
      "https://placehold.co/800x600/ea580c/white?text=Add+2",
    ],
  },
  2: {
    id: 2,
    title: "モダンデザインの二世帯住宅",
    description:
      "シンプルでモダンなデザインの二世帯住宅。各世帯のプライバシーを保ちながら、家族の絆を大切にする設計です。",
    prefecture: "愛知県",
    city: "名古屋市東区",
    buildingArea: "135.2",
    budget: "4800",
    completionYear: "2024",
    mainImageUrl: "https://placehold.co/800x600/ea580c/white?text=Case+2",
    status: "PUBLISHED" as const,
    selectedTags: [4, 8, 13],
    additionalImages: [],
  },
};

// 利用可能なタグ（Prismaスキーマに準拠）
const AVAILABLE_TAGS = [
  { id: 1, name: "平屋", category: "HOUSE_TYPE" },
  { id: 2, name: "2階建て", category: "HOUSE_TYPE" },
  { id: 3, name: "3階建て", category: "HOUSE_TYPE" },
  { id: 4, name: "二世帯", category: "HOUSE_TYPE" },
  { id: 5, name: "2000万円未満", category: "PRICE_RANGE" },
  { id: 6, name: "2000-3000万円", category: "PRICE_RANGE" },
  { id: 7, name: "3000-4000万円", category: "PRICE_RANGE" },
  { id: 8, name: "4000-5000万円", category: "PRICE_RANGE" },
  { id: 9, name: "5000万円以上", category: "PRICE_RANGE" },
  { id: 10, name: "木造", category: "STRUCTURE" },
  { id: 11, name: "鉄骨", category: "STRUCTURE" },
  { id: 12, name: "RC造", category: "STRUCTURE" },
  { id: 13, name: "モダン", category: "ATMOSPHERE" },
  { id: 14, name: "和モダン", category: "ATMOSPHERE" },
  { id: 15, name: "ナチュラル", category: "ATMOSPHERE" },
  { id: 16, name: "北欧", category: "ATMOSPHERE" },
  { id: 17, name: "開放感", category: "PREFERENCE" },
  { id: 18, name: "省エネ", category: "PREFERENCE" },
  { id: 19, name: "バリアフリー", category: "PREFERENCE" },
  { id: 20, name: "収納充実", category: "PREFERENCE" },
];

const TAG_CATEGORIES = {
  HOUSE_TYPE: "住宅タイプ",
  PRICE_RANGE: "価格帯",
  STRUCTURE: "構造",
  ATMOSPHERE: "雰囲気",
  PREFERENCE: "こだわり",
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

export default function EditCasePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // フォームの状態
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [buildingArea, setBuildingArea] = useState("");
  const [budget, setBudget] = useState("");
  const [completionYear, setCompletionYear] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // データ読み込み（モック）
  useEffect(() => {
    // TODO: 実際のAPI呼び出しはAPI実装時に追加
    setTimeout(() => {
      const caseData = MOCK_CASE_DATA[params.id as keyof typeof MOCK_CASE_DATA];
      if (caseData) {
        setTitle(caseData.title);
        setDescription(caseData.description);
        setPrefecture(caseData.prefecture);
        setCity(caseData.city);
        setBuildingArea(caseData.buildingArea);
        setBudget(caseData.budget);
        setCompletionYear(caseData.completionYear);
        setMainImageUrl(caseData.mainImageUrl);
        setStatus(caseData.status);
        setSelectedTags(caseData.selectedTags);
        setAdditionalImages(caseData.additionalImages);
      }
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  function handleLogout() {
    window.location.href = "/member/login";
  }

  function toggleTag(tagId: number) {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  }

  function handleAddImage() {
    const newImageUrl = `https://placehold.co/800x600/f97316/white?text=Image+${additionalImages.length + 1}`;
    setAdditionalImages([...additionalImages, newImageUrl]);
  }

  function handleRemoveImage(index: number) {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  }

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "タイトルは必須です";
    if (!description.trim()) newErrors.description = "説明は必須です";
    if (!prefecture) newErrors.prefecture = "都道府県は必須です";
    if (!city.trim()) newErrors.city = "市区町村は必須です";
    if (!buildingArea) newErrors.buildingArea = "延床面積は必須です";
    if (!budget) newErrors.budget = "予算は必須です";
    if (!completionYear) newErrors.completionYear = "完成年は必須です";
    if (selectedTags.length === 0)
      newErrors.tags = "少なくとも1つのタグを選択してください";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(saveStatus: "DRAFT" | "PUBLISHED") {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setStatus(saveStatus);
    setIsSubmitting(true);

    // TODO: 実際の保存処理はAPI実装時に追加
    setTimeout(() => {
      alert(
        saveStatus === "DRAFT"
          ? "下書きとして保存しました"
          : "変更を公開しました"
      );
      router.push("/member/cases");
    }, 1000);
  }

  async function handleDelete() {
    // TODO: 実際の削除処理はAPI実装時に追加
    setTimeout(() => {
      alert("施工事例を削除しました");
      router.push("/member/cases");
    }, 500);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* サイドバー */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* ヘッダー */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-gray-900">
                    メンバー管理
                  </h1>
                  <p className="text-xs text-gray-500">工務店ダッシュボード</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* 会社情報カード */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center gap-3 mb-3">
                {MOCK_MEMBER.company.logoUrl && (
                  <img
                    src={MOCK_MEMBER.company.logoUrl}
                    alt={MOCK_MEMBER.company.name}
                    className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {MOCK_MEMBER.company.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {MOCK_MEMBER.company.prefecture} {MOCK_MEMBER.company.city}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ナビゲーション */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <Link
              href="/member"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-100 transition"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">ダッシュボード</span>
            </Link>
            <Link
              href="/member/cases"
              className="flex items-center gap-3 px-4 py-3 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-xl shadow-lg"
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">施工事例管理</span>
            </Link>
            <Link
              href="/member/inquiries"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-100 transition"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">問い合わせ</span>
            </Link>
            <Link
              href="/member/company"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-100 transition"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">自社情報</span>
            </Link>
          </nav>

          {/* ユーザー情報とログアウト */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-linear-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold shadow">
                {MOCK_MEMBER.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {MOCK_MEMBER.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {MOCK_MEMBER.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="h-4 w-4" />
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      </aside>

      {/* オーバーレイ（モバイル） */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* メインコンテンツ */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link
              href="/member/cases"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-gray-900">
                施工事例の編集
              </h1>
              <p className="text-gray-600 mt-1">施工事例の内容を編集します</p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="h-5 w-5" />
              <span className="font-medium hidden sm:inline">削除</span>
            </button>
          </div>
        </div>

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
        <div className="space-y-6">
          {/* 基本情報 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-6">基本情報</h2>

            {/* タイトル */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                タイトル <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例：自然素材にこだわった平屋の家"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            {/* 説明 */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                説明 <span className="text-red-600">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="施工事例の詳細な説明を入力してください"
                rows={6}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            {/* 所在地 */}
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

            {/* 延床面積・予算・完成年 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  延床面積 (㎡) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={buildingArea}
                  onChange={(e) => setBuildingArea(e.target.value)}
                  placeholder="95.5"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                    errors.buildingArea ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  予算 (万円) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="3500"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                    errors.budget ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  完成年 <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  value={completionYear}
                  onChange={(e) => setCompletionYear(e.target.value)}
                  placeholder="2024"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                    errors.completionYear ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* タグ選択 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-2">
              タグ <span className="text-red-600">*</span>
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              施工事例の特徴を表すタグを選択してください（複数選択可）
            </p>

            {errors.tags && (
              <p className="text-sm text-red-600 mb-4">{errors.tags}</p>
            )}

            {Object.entries(TAG_CATEGORIES).map(([category, label]) => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="text-sm font-bold text-gray-700 mb-3">
                  {label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.filter(
                    (tag) => tag.category === category
                  ).map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                        selectedTags.includes(tag.id)
                          ? "bg-red-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 画像 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-2">画像</h2>
            <p className="text-sm text-gray-600 mb-6">
              施工事例の写真を追加・変更してください
            </p>

            {/* メイン画像 */}
            <div className="mb-6">
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
                  <button
                    type="button"
                    onClick={() =>
                      setMainImageUrl(
                        "https://placehold.co/1200x800/f97316/white?text=Main+Image"
                      )
                    }
                    className="mt-4 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                  >
                    画像を選択（モック）
                  </button>
                </div>
              )}
            </div>

            {/* 追加画像 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                追加画像（最大10枚）
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {additionalImages.map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={imageUrl}
                      alt={`追加画像 ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {additionalImages.length < 10 && (
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-red-500 transition"
                  >
                    <Plus className="h-8 w-8 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => handleSubmit("DRAFT")}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" />
                <span className="font-bold">下書き保存</span>
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("PUBLISHED")}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye className="h-5 w-5" />
                <span className="font-bold">
                  {isSubmitting ? "保存中..." : "変更を公開"}
                </span>
              </button>
            </div>
          </div>
        </div>
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
                  施工事例を削除しますか?
                </h3>
                <p className="text-gray-600 text-sm">
                  この操作は取り消せません。本当に削除してもよろしいですか?
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
