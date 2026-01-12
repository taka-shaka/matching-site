// src/app/member/cases/new/page.tsx
// メンバー（工務店）施工事例新規作成ページ

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  X,
  Menu,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-provider";
import TempImageUploader from "@/components/TempImageUploader";

interface MemberData {
  member: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  company: {
    id: number;
    name: string;
    prefecture: string;
    city: string;
    logoUrl: string | null;
  };
}

interface Tag {
  id: number;
  name: string;
  category: string;
}

const TAG_CATEGORIES: Record<string, string> = {
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

export default function NewCasePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // データ取得状態
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

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

  // メンバー情報とタグデータを取得
  useEffect(() => {
    async function fetchData() {
      if (!user || user.userType !== "member") return;

      try {
        // メンバー情報を取得
        const memberResponse = await fetch("/api/member/dashboard");
        if (memberResponse.ok) {
          const memberResult = await memberResponse.json();
          setMemberData(memberResult);
        }

        // タグ一覧を取得
        const tagsResponse = await fetch("/api/tags");
        if (tagsResponse.ok) {
          const tagsResult = await tagsResponse.json();
          setAvailableTags(tagsResult.tags || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchData();
  }, [user]);

  // フォームの状態
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [buildingArea, setBuildingArea] = useState("");
  const [budget, setBudget] = useState("");
  const [completionYear, setCompletionYear] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ローディング中は何も表示しない
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // 未認証またはメンバー以外の場合は何も表示しない（リダイレクト中）
  if (!user || user.userType !== "member") {
    return null;
  }

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

  function handleImageUpload(url: string) {
    setUploadedImageUrls([...uploadedImageUrls, url]);
  }

  function handleRemoveImage(index: number) {
    setUploadedImageUrls(uploadedImageUrls.filter((_, i) => i !== index));
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

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/member/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          prefecture,
          city,
          buildingArea: parseFloat(buildingArea),
          budget: parseInt(budget) * 10000, // 万円を円に変換
          completionYear: parseInt(completionYear),
          status: saveStatus,
          tagIds: selectedTags,
          imageUrls: uploadedImageUrls, // アップロード済みの画像URL配列
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create case");
      }

      const result = await response.json();
      alert(
        saveStatus === "DRAFT" ? "下書きとして保存しました" : "公開しました"
      );
      router.push(`/member/cases/${result.case.id}`);
    } catch (error) {
      console.error("Error creating case:", error);
      alert("施工事例の作成に失敗しました");
      setIsSubmitting(false);
    }
  }

  // データ読み込み中の表示
  if (isLoadingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 via-green-50 to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-linear-to-br from-blue-50 via-green-50 to-teal-50">
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
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
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
            <div className="bg-linear-to-br from-blue-50 to-green-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs text-gray-500 mb-1">所属工務店</p>
              <p className="text-sm font-bold text-gray-900 truncate">
                {memberData?.company.name || "読み込み中..."}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {memberData?.company.prefecture} {memberData?.company.city}
              </p>
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
              className="flex items-center gap-3 px-4 py-3 bg-linear-to-r from-blue-500 to-green-500 text-white rounded-xl shadow-lg"
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
              <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold shadow">
                {memberData?.member.name.charAt(0) || "M"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {memberData?.member.name || "メンバー"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {memberData?.member.role || "MEMBER"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
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
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                施工事例の新規作成
              </h1>
              <p className="text-gray-600 mt-1">新しい施工事例を登録します</p>
            </div>
          </div>
        </div>

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
        <div className="space-y-6">
          {/* 基本情報 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-6">基本情報</h2>

            {/* タイトル */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                タイトル <span className="text-blue-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例：自然素材にこだわった平屋の家"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                  errors.title ? "border-blue-500" : "border-gray-300"
                }`}
              />
            </div>

            {/* 説明 */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                説明 <span className="text-blue-600">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="施工事例の詳細な説明を入力してください"
                rows={6}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none ${
                  errors.description ? "border-blue-500" : "border-gray-300"
                }`}
              />
            </div>

            {/* 所在地 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  都道府県 <span className="text-blue-600">*</span>
                </label>
                <select
                  value={prefecture}
                  onChange={(e) => setPrefecture(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                    errors.prefecture ? "border-blue-500" : "border-gray-300"
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

            {/* 延床面積・予算・完成年 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  延床面積 (㎡) <span className="text-blue-600">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={buildingArea}
                  onChange={(e) => setBuildingArea(e.target.value)}
                  placeholder="95.5"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                    errors.buildingArea ? "border-blue-500" : "border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  予算 (万円) <span className="text-blue-600">*</span>
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="3500"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                    errors.budget ? "border-blue-500" : "border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  完成年 <span className="text-blue-600">*</span>
                </label>
                <input
                  type="number"
                  value={completionYear}
                  onChange={(e) => setCompletionYear(e.target.value)}
                  placeholder="2024"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                    errors.completionYear
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* タグ選択 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-2">
              タグ <span className="text-blue-600">*</span>
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              施工事例の特徴を表すタグを選択してください（複数選択可）
            </p>

            {errors.tags && (
              <p className="text-sm text-blue-600 mb-4">{errors.tags}</p>
            )}

            {Object.entries(TAG_CATEGORIES).map(([category, label]) => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="text-sm font-bold text-gray-700 mb-3">
                  {label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {availableTags
                    .filter((tag: Tag) => tag.category === category)
                    .map((tag: Tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                          selectedTags.includes(tag.id)
                            ? "bg-blue-600 text-white shadow-lg"
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
              施工事例の写真を追加してください（最大10枚）
            </p>

            {/* アップロード済み画像一覧 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {uploadedImageUrls.map((imageUrl, index) => (
                <div key={index} className="relative h-32">
                  <Image
                    src={imageUrl}
                    alt={`画像 ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-lg z-10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded z-10">
                      メイン
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 新規画像アップロード */}
            {uploadedImageUrls.length < 10 && (
              <TempImageUploader
                onUploadComplete={handleImageUpload}
                label="画像を追加"
                description="クリックまたはドラッグ&ドロップで画像をアップロード"
              />
            )}

            {uploadedImageUrls.length >= 10 && (
              <div className="text-center text-sm text-gray-500 py-4">
                画像は最大10枚までアップロードできます
              </div>
            )}
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
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye className="h-5 w-5" />
                <span className="font-bold">
                  {isSubmitting ? "保存中..." : "公開する"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
