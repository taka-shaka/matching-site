"use client";

import Link from "next/link";
import { useState } from "react";
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
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

// モック管理者データ
const MOCK_ADMIN = {
  name: "管理者 太郎",
  email: "admin@matching-site.jp",
  role: "SUPER_ADMIN" as const,
};

// タグカテゴリー (Prismaスキーマに準拠)
const TAG_CATEGORIES = {
  HOUSE_TYPE: "住宅タイプ",
  PRICE_RANGE: "価格帯",
  STRUCTURE: "構造",
  ATMOSPHERE: "雰囲気",
  PREFERENCE: "こだわり",
};

// モックタグデータ (Prismaスキーマに準拠)
const MOCK_TAGS = [
  {
    id: 1,
    name: "二階建て",
    category: "HOUSE_TYPE" as const,
    displayOrder: 1,
    usageCount: 15,
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "平屋",
    category: "HOUSE_TYPE" as const,
    displayOrder: 2,
    usageCount: 8,
    createdAt: "2024-01-01",
  },
  {
    id: 3,
    name: "三階建て",
    category: "HOUSE_TYPE" as const,
    displayOrder: 3,
    usageCount: 5,
    createdAt: "2024-01-01",
  },
  {
    id: 4,
    name: "2000万円台",
    category: "PRICE_RANGE" as const,
    displayOrder: 1,
    usageCount: 12,
    createdAt: "2024-01-01",
  },
  {
    id: 5,
    name: "3000万円台",
    category: "PRICE_RANGE" as const,
    displayOrder: 2,
    usageCount: 18,
    createdAt: "2024-01-01",
  },
  {
    id: 6,
    name: "4000万円台",
    category: "PRICE_RANGE" as const,
    displayOrder: 3,
    usageCount: 10,
    createdAt: "2024-01-01",
  },
  {
    id: 7,
    name: "木造",
    category: "STRUCTURE" as const,
    displayOrder: 1,
    usageCount: 20,
    createdAt: "2024-01-01",
  },
  {
    id: 8,
    name: "鉄骨造",
    category: "STRUCTURE" as const,
    displayOrder: 2,
    usageCount: 7,
    createdAt: "2024-01-01",
  },
  {
    id: 9,
    name: "RC造",
    category: "STRUCTURE" as const,
    displayOrder: 3,
    usageCount: 3,
    createdAt: "2024-01-01",
  },
  {
    id: 10,
    name: "ナチュラル",
    category: "ATMOSPHERE" as const,
    displayOrder: 1,
    usageCount: 14,
    createdAt: "2024-01-01",
  },
  {
    id: 11,
    name: "モダン",
    category: "ATMOSPHERE" as const,
    displayOrder: 2,
    usageCount: 16,
    createdAt: "2024-01-01",
  },
  {
    id: 12,
    name: "和風",
    category: "ATMOSPHERE" as const,
    displayOrder: 3,
    usageCount: 9,
    createdAt: "2024-01-01",
  },
  {
    id: 13,
    name: "高断熱・高気密",
    category: "PREFERENCE" as const,
    displayOrder: 1,
    usageCount: 22,
    createdAt: "2024-01-01",
  },
  {
    id: 14,
    name: "自然素材",
    category: "PREFERENCE" as const,
    displayOrder: 2,
    usageCount: 11,
    createdAt: "2024-01-01",
  },
  {
    id: 15,
    name: "吹き抜け",
    category: "PREFERENCE" as const,
    displayOrder: 3,
    usageCount: 13,
    createdAt: "2024-01-01",
  },
];

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
};

export default function AdminTagsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<
    "all" | keyof typeof TAG_CATEGORIES
  >("all");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagCategory, setNewTagCategory] =
    useState<keyof typeof TAG_CATEGORIES>("HOUSE_TYPE");

  // 統計計算
  const stats = {
    total: MOCK_TAGS.length,
    byCategory: Object.keys(TAG_CATEGORIES).reduce(
      (acc, cat) => {
        acc[cat] = MOCK_TAGS.filter((t) => t.category === cat).length;
        return acc;
      },
      {} as Record<string, number>
    ),
    totalUsage: MOCK_TAGS.reduce((sum, t) => sum + t.usageCount, 0),
  };

  // フィルタリング処理
  const filteredTags = MOCK_TAGS.filter((tag) => {
    const matchesSearch = tag.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || tag.category === filterCategory;

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // カテゴリーでソート、その後displayOrderでソート
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.displayOrder - b.displayOrder;
  });

  // カテゴリーごとにグループ化
  const groupedTags = filteredTags.reduce(
    (acc, tag) => {
      if (!acc[tag.category]) {
        acc[tag.category] = [];
      }
      acc[tag.category].push(tag);
      return acc;
    },
    {} as Record<string, typeof MOCK_TAGS>
  );

  function handleAddTag() {
    // TODO: 実際のタグ追加処理はAPI実装時に追加
    alert(`新しいタグ「${newTagName}」を追加しました`);
    setShowAddModal(false);
    setNewTagName("");
  }

  function handleEditTag(tagId: number) {
    // TODO: 実際のタグ編集処理はAPI実装時に追加
    alert(`タグID ${tagId} を編集しました`);
    setShowEditModal(false);
    setSelectedTag(null);
  }

  function handleDeleteTag(tagId: number) {
    // TODO: 実際のタグ削除処理はAPI実装時に追加
    alert(`タグID ${tagId} を削除しました`);
    setShowDeleteConfirm(false);
    setSelectedTag(null);
  }

  function handleMoveUp(tagId: number) {
    // TODO: 実際の表示順変更処理はAPI実装時に追加
    alert(`タグID ${tagId} の表示順を上げました`);
  }

  function handleMoveDown(tagId: number) {
    // TODO: 実際の表示順変更処理はAPI実装時に追加
    alert(`タグID ${tagId} の表示順を下げました`);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* サイドバー */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        adminName={MOCK_ADMIN.name}
        adminRole={MOCK_ADMIN.role}
      />

      {/* メインコンテンツ */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-black text-gray-900">タグ管理</h1>
                <p className="text-gray-600 mt-1">
                  施工事例や工務店に付与するタグを管理します
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition"
            >
              <Plus className="h-5 w-5" />
              <span className="font-bold">新規タグ追加</span>
            </button>
          </div>

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
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">全タグ</p>
            <p className="text-2xl font-black text-gray-900">{stats.total}</p>
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
            {Object.entries(groupedTags).map(([category, tags]) => {
              const categoryKey = category as keyof typeof TAG_CATEGORIES;
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
                    {tags.map((tag, index) => (
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
                                  onClick={() => handleMoveUp(tag.id)}
                                  className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                  title="上に移動"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </button>
                              )}
                              {index < tags.length - 1 && (
                                <button
                                  onClick={() => handleMoveDown(tag.id)}
                                  className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                  title="下に移動"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                setSelectedTag(tag.id);
                                setShowEditModal(true);
                              }}
                              className="flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                              <Edit2 className="h-4 w-4" />
                              <span className="font-medium">編集</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTag(tag.id);
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
      </main>

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
                disabled={!newTagName.trim()}
                className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              >
                追加
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewTagName("");
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold"
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
                  defaultValue={
                    MOCK_TAGS.find((t) => t.id === selectedTag)?.name
                  }
                  placeholder="例: モダン"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => handleEditTag(selectedTag)}
                className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition font-bold"
              >
                保存
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedTag(null);
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold"
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
                  タグ「
                  {MOCK_TAGS.find((t) => t.id === selectedTag)?.name}
                  」を削除します。この操作は取り消せません。
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDeleteTag(selectedTag)}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold"
              >
                削除
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedTag(null);
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold"
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
