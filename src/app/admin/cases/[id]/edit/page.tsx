// src/app/admin/cases/[id]/edit/page.tsx
// 管理者 施工事例編集ページ

"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  Menu,
  AlertCircle,
  Trash2,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-provider";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ImageUploader from "@/components/ImageUploader";

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

export default function AdminEditCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // データ取得状態
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  // フォームの状態
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [buildingArea, setBuildingArea] = useState("");
  const [budget, setBudget] = useState("");
  const [completionYear, setCompletionYear] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [images, setImages] = useState<
    Array<{ id: number; imageUrl: string; displayOrder: number }>
  >([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 認証・役割チェック
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/admin/login");
      } else if (user.userType !== "admin") {
        router.push("/");
      }
    }
  }, [user, authLoading, router]);

  // データ読み込み（API）
  useEffect(() => {
    async function fetchData() {
      if (!user || user.userType !== "admin") return;

      try {
        // タグ一覧を取得
        const tagsResponse = await fetch("/api/tags");
        if (tagsResponse.ok) {
          const tagsResult = await tagsResponse.json();
          setAvailableTags(tagsResult.tags || []);
        }

        // 施工事例データを取得（管理者用API）
        const caseResponse = await fetch(`/api/admin/cases/${id}`);
        if (caseResponse.ok) {
          const caseResult = await caseResponse.json();
          const caseData = caseResult.case;

          setTitle(caseData.title);
          setDescription(caseData.description);
          setPrefecture(caseData.prefecture);
          setCity(caseData.city);
          setBuildingArea(
            caseData.buildingArea ? String(caseData.buildingArea) : ""
          );
          setBudget(caseData.budget ? String(caseData.budget / 10000) : ""); // 円から万円に変換
          setCompletionYear(
            caseData.completionYear ? String(caseData.completionYear) : ""
          );

          // タグIDを抽出
          if (caseData.tags && caseData.tags.length > 0) {
            const tagIds = caseData.tags.map(
              (t: { tag: { id: number } }) => t.tag.id
            );
            setSelectedTags(tagIds);
          }

          // 画像データを保存
          if (caseData.images && caseData.images.length > 0) {
            setImages(caseData.images);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user, id]);

  function toggleTag(tagId: number) {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((i) => i !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  }

  async function handleImageUpdate() {
    // 画像が更新されたら再取得
    try {
      const caseResponse = await fetch(`/api/admin/cases/${id}`);
      if (caseResponse.ok) {
        const caseResult = await caseResponse.json();
        if (caseResult.case.images && caseResult.case.images.length > 0) {
          setImages(caseResult.case.images);
        } else {
          setImages([]);
        }
      }
    } catch (error) {
      console.error("Error refreshing images:", error);
    }
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
      const response = await fetch(`/api/admin/cases/${id}`, {
        method: "PATCH",
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
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update case");
      }

      alert(
        saveStatus === "DRAFT"
          ? "下書きとして保存しました"
          : "変更を公開しました"
      );
      router.push("/admin/cases");
    } catch (error) {
      console.error("Error updating case:", error);
      alert(
        error instanceof Error ? error.message : "施工事例の更新に失敗しました"
      );
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      const response = await fetch(`/api/admin/cases/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete case");
      }

      alert("施工事例を削除しました");
      router.push("/admin/cases");
    } catch (error) {
      console.error("Error deleting case:", error);
      alert(
        error instanceof Error ? error.message : "施工事例の削除に失敗しました"
      );
    }
  }

  // 認証ローディング中
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // 未認証または管理者以外の場合
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
            <div className="flex flex-1 items-center gap-3">
              <Link
                href="/admin/cases"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-black text-gray-900">
                施工事例の編集
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200"
              >
                <Trash2 className="h-5 w-5" />
                <span className="font-medium hidden sm:inline">削除</span>
              </button>
            </div>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <main className="p-4 lg:p-8">
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
          <div className="space-y-6 max-w-5xl">
            {/* 基本情報 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-black text-gray-900 mb-6">
                基本情報
              </h2>

              {/* タイトル */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例：自然素材にこだわった平屋の家"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              {/* 説明 */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  説明 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="施工事例の詳細な説明を入力してください"
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              {/* 所在地 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    都道府県 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={prefecture}
                    onChange={(e) => setPrefecture(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
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
                    市区町村 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="例：名古屋市中区"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
              </div>

              {/* 延床面積・予算・完成年 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    延床面積 (㎡) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={buildingArea}
                    onChange={(e) => setBuildingArea(e.target.value)}
                    placeholder="95.5"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.buildingArea ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    予算 (万円) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="3500"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.budget ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    完成年 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={completionYear}
                    onChange={(e) => setCompletionYear(e.target.value)}
                    placeholder="2024"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.completionYear
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* タグ選択 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-black text-gray-900 mb-2">
                タグ <span className="text-red-500">*</span>
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

            {/* 画像アップロード */}
            <ImageUploader
              caseId={parseInt(id)}
              images={images}
              onUpdate={handleImageUpdate}
            />

            {/* アクションボタン */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
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
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>

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
