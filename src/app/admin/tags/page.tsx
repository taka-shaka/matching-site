// src/app/admin/tags/page.tsx
// 管理者 タグ管理ページ

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import {
  Menu,
  Search,
  Filter,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  Tag as TagIcon,
  ChevronUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/lib/auth-provider";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// タグカテゴリー
const TAG_CATEGORIES = {
  HOUSE_TYPE: "住宅タイプ",
  PRICE_RANGE: "価格帯",
  STRUCTURE: "構造",
  ATMOSPHERE: "雰囲気",
  PREFERENCE: "こだわり",
} as const;

// カテゴリー別の色設定
const CATEGORY_COLORS = {
  HOUSE_TYPE: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  PRICE_RANGE: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  STRUCTURE: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  ATMOSPHERE: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  PREFERENCE: {
    bg: "bg-pink-100",
    text: "text-pink-700",
    border: "border-pink-200",
  },
} as const;

interface Tag {
  id: number;
  name: string;
  category: keyof typeof TAG_CATEGORIES;
  displayOrder: number;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface TagsResponse {
  tags: Tag[];
}

type CategoryFilter = "all" | keyof typeof TAG_CATEGORIES;

export default function AdminTagsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<CategoryFilter>("all");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagCategory, setNewTagCategory] =
    useState<keyof typeof TAG_CATEGORIES>("HOUSE_TYPE");
  const [editTagName, setEditTagName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

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

  // タグ一覧取得
  const apiUrl = (() => {
    const params = new URLSearchParams();
    if (filterCategory !== "all") params.append("category", filterCategory);
    const queryString = params.toString();
    return queryString ? `/api/tags?${queryString}` : "/api/tags";
  })();

  const { data, error, isLoading } = useSWR<TagsResponse>(apiUrl, fetcher);

  // ローカル検索フィルター
  const filteredTags = data?.tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // カテゴリーごとにグループ化
  const groupedTags =
    filteredTags?.reduce(
      (acc, tag) => {
        if (!acc[tag.category]) {
          acc[tag.category] = [];
        }
        acc[tag.category].push(tag);
        return acc;
      },
      {} as Record<keyof typeof TAG_CATEGORIES, Tag[]>
    ) || {};

  // 統計計算
  const stats = {
    total: data?.tags.length || 0,
    byCategory: Object.keys(TAG_CATEGORIES).reduce(
      (acc, cat) => {
        acc[cat] = data?.tags.filter((t) => t.category === cat).length || 0;
        return acc;
      },
      {} as Record<string, number>
    ),
  };

  async function handleAddTag() {
    if (!newTagName.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTagName.trim(),
          category: newTagCategory,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "タグの追加に失敗しました");
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("タグを追加しました");
      setShowAddModal(false);
      setNewTagName("");
      mutate(apiUrl);
    } catch (err) {
      setErrorMessage("タグの追加に失敗しました");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 3000);
    }
  }

  async function handleEditTag() {
    if (!selectedTag || !editTagName.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/tags/${selectedTag.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editTagName.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "タグの更新に失敗しました");
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("タグを更新しました");
      setShowEditModal(false);
      setSelectedTag(null);
      setEditTagName("");
      mutate(apiUrl);
    } catch (err) {
      setErrorMessage("タグの更新に失敗しました");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 3000);
    }
  }

  async function handleDeleteTag() {
    if (!selectedTag) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/tags/${selectedTag.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "タグの削除に失敗しました");
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("タグを削除しました");
      setShowDeleteConfirm(false);
      setSelectedTag(null);
      mutate(apiUrl);
    } catch (err) {
      setErrorMessage("タグの削除に失敗しました");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 3000);
    }
  }

  async function handleMoveUp(tag: Tag, categoryTags: Tag[]) {
    const currentIndex = categoryTags.findIndex((t) => t.id === tag.id);
    if (currentIndex <= 0) return;

    const newDisplayOrder = categoryTags[currentIndex - 1].displayOrder;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/tags/${tag.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayOrder: newDisplayOrder }),
      });

      if (!response.ok) {
        const result = await response.json();
        setErrorMessage(result.error || "表示順の変更に失敗しました");
        return;
      }

      mutate(apiUrl);
    } catch (err) {
      setErrorMessage("表示順の変更に失敗しました");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  }

  async function handleMoveDown(tag: Tag, categoryTags: Tag[]) {
    const currentIndex = categoryTags.findIndex((t) => t.id === tag.id);
    if (currentIndex < 0 || currentIndex >= categoryTags.length - 1) return;

    const newDisplayOrder = categoryTags[currentIndex + 1].displayOrder;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/tags/${tag.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayOrder: newDisplayOrder }),
      });

      if (!response.ok) {
        const result = await response.json();
        setErrorMessage(result.error || "表示順の変更に失敗しました");
        return;
      }

      mutate(apiUrl);
    } catch (err) {
      setErrorMessage("表示順の変更に失敗しました");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setErrorMessage(""), 3000);
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
            <div className="flex flex-1 items-center">
              <h1 className="text-2xl font-black text-gray-900">タグ管理</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">新規タグ追加</span>
              </button>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <main className="p-4 lg:p-8">
          {/* アクションバー */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* 検索バー */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="タグ名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* カテゴリーフィルター */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                >
                  <Filter className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-700">
                    {filterCategory === "all"
                      ? "すべてのカテゴリー"
                      : TAG_CATEGORIES[filterCategory]}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10">
                    <button
                      onClick={() => {
                        setFilterCategory("all");
                        setShowCategoryDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                    >
                      すべて ({stats.total})
                    </button>
                    {Object.entries(TAG_CATEGORIES).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setFilterCategory(key as keyof typeof TAG_CATEGORIES);
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                      >
                        {label} ({stats.byCategory[key]})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* メッセージ */}
          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
              <p className="font-medium">{errorMessage}</p>
            </div>
          )}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl">
              <p className="font-medium">{successMessage}</p>
            </div>
          )}

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
              {/* 統計カード */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">全タグ</p>
                  <p className="text-2xl font-black text-gray-900">
                    {stats.total}
                  </p>
                </div>
                {Object.entries(TAG_CATEGORIES).map(([key, label]) => (
                  <div
                    key={key}
                    className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200"
                  >
                    <p className="text-xs text-gray-600 mb-1">{label}</p>
                    <p className="text-2xl font-black text-gray-900">
                      {stats.byCategory[key]}
                    </p>
                  </div>
                ))}
              </div>

              {/* タグ一覧 (カテゴリーごとにグループ化) */}
              {Object.keys(groupedTags).length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
                  <TagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    {searchQuery
                      ? "検索条件に一致するタグが見つかりませんでした"
                      : "まだタグが登録されていません"}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {(
                    Object.entries(groupedTags) as [
                      keyof typeof TAG_CATEGORIES,
                      Tag[],
                    ][]
                  ).map(([category, tags]) => {
                    const categoryKey = category;
                    const colors = CATEGORY_COLORS[categoryKey];

                    return (
                      <div
                        key={category}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                      >
                        {/* カテゴリーヘッダー */}
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-900">
                              {TAG_CATEGORIES[categoryKey]}
                            </h2>
                            <span className="text-sm text-gray-600">
                              {tags.length}個のタグ
                            </span>
                          </div>
                        </div>

                        {/* タグリスト */}
                        <div className="divide-y divide-gray-200">
                          {tags.map((tag: Tag, index: number) => (
                            <div
                              key={tag.id}
                              className="px-6 py-4 hover:bg-gray-50 transition"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                  <span
                                    className={`px-4 py-2 text-sm font-bold rounded-full ${colors.bg} ${colors.text} ${colors.border} border`}
                                  >
                                    {tag.name}
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    使用数:{" "}
                                    <span className="font-bold text-gray-900">
                                      {tag.usageCount}
                                    </span>
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    表示順:{" "}
                                    <span className="font-bold text-gray-900">
                                      {tag.displayOrder}
                                    </span>
                                  </span>
                                </div>

                                {/* アクション */}
                                <div className="flex items-center gap-2">
                                  {/* 表示順変更 */}
                                  <div className="flex flex-col gap-1">
                                    {index > 0 && (
                                      <button
                                        onClick={() => handleMoveUp(tag, tags)}
                                        disabled={isSubmitting}
                                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition disabled:opacity-50"
                                        title="上に移動"
                                      >
                                        <ChevronUp className="h-4 w-4" />
                                      </button>
                                    )}
                                    {index < tags.length - 1 && (
                                      <button
                                        onClick={() =>
                                          handleMoveDown(tag, tags)
                                        }
                                        disabled={isSubmitting}
                                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition disabled:opacity-50"
                                        title="下に移動"
                                      >
                                        <ChevronDown className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => {
                                      setSelectedTag(tag);
                                      setEditTagName(tag.name);
                                      setShowEditModal(true);
                                    }}
                                    className="flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                    <span className="font-medium">編集</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedTag(tag);
                                      setShowDeleteConfirm(true);
                                    }}
                                    className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="font-medium">削除</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* 新規タグ追加モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-black text-gray-900 mb-4">
              新規タグ追加
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  タグ名 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="例: モダン"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  カテゴリー <span className="text-red-600">*</span>
                </label>
                <select
                  value={newTagCategory}
                  onChange={(e) =>
                    setNewTagCategory(
                      e.target.value as keyof typeof TAG_CATEGORIES
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  {Object.entries(TAG_CATEGORIES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleAddTag}
                disabled={!newTagName.trim() || isSubmitting}
                className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              >
                {isSubmitting ? "追加中..." : "追加"}
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewTagName("");
                }}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold disabled:opacity-50"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* タグ編集モーダル */}
      {showEditModal && selectedTag && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-black text-gray-900 mb-4">
              タグを編集
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  タグ名 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={editTagName}
                  onChange={(e) => setEditTagName(e.target.value)}
                  placeholder="例: モダン"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleEditTag}
                disabled={!editTagName.trim() || isSubmitting}
                className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "保存中..." : "保存"}
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedTag(null);
                  setEditTagName("");
                }}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold disabled:opacity-50"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 削除確認モーダル */}
      {showDeleteConfirm && selectedTag && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  タグを削除しますか?
                </h3>
                <p className="text-sm text-gray-600">
                  タグ「{selectedTag.name}
                  」を削除します。この操作は取り消せません。
                  {selectedTag.usageCount > 0 && (
                    <span className="block mt-2 text-red-600 font-medium">
                      このタグは現在{selectedTag.usageCount}
                      件使用されているため削除できません。
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteTag}
                disabled={selectedTag.usageCount > 0 || isSubmitting}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "削除中..." : "削除"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedTag(null);
                }}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold disabled:opacity-50"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
