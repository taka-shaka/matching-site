// src/app/cases/[id]/page.tsx
// 施工事例詳細ページ（API連携版）

"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import {
  MapPin,
  TrendingUp,
  Calendar,
  Building2,
  Phone,
  Mail,
  Globe,
  ChevronLeft,
  Share2,
  Loader2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { formatBudget } from "@/lib/format";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Tag {
  id: number;
  name: string;
  category: string;
}

interface CaseTag {
  id: number;
  caseId: number;
  tagId: number;
  createdAt: string;
  tag: Tag;
}

interface Company {
  id: number;
  name: string;
  description: string;
  address: string;
  prefecture: string;
  city: string;
  phoneNumber: string;
  email: string;
  websiteUrl: string | null;
  logoUrl: string | null;
}

interface Author {
  id: number;
  name: string;
}

interface CaseImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
}

interface ConstructionCase {
  id: number;
  companyId: number;
  authorId: number;
  title: string;
  description: string;
  prefecture: string;
  city: string;
  buildingArea: number | null;
  budget: number | null;
  completionYear: number | null;
  mainImageUrl: string | null;
  status: string;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  company: Company;
  tags: CaseTag[];
  author: Author;
  images?: CaseImage[];
}

interface CaseDetailResponse {
  case: ConstructionCase;
}

interface RelatedCase {
  id: number;
  title: string;
  prefecture: string;
  city: string;
  budget: number | null;
  mainImageUrl: string | null;
  company: {
    name: string;
  };
}

export default function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [selectedImage, setSelectedImage] = useState(0);

  // 施工事例詳細データ取得
  const { data, error, isLoading } = useSWR<CaseDetailResponse>(
    `/api/public/cases/${id}`,
    fetcher
  );

  // 関連施工事例データ取得（同じ工務店の他の事例）
  const { data: relatedData } = useSWR(
    data?.case
      ? `/api/public/cases?companyId=${data.case.companyId}&limit=3`
      : null,
    fetcher
  );

  // ダミー画像の定義
  const dummyImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* メインコンテンツ */}
      <main className="pt-[60px]">
        {/* ローディング状態 */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-16 h-16 text-red-500 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">読み込み中...</p>
          </div>
        )}

        {/* エラー状態 */}
        {error && (
          <div className="flex flex-col items-center justify-center py-32">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-gray-600 text-lg mb-4">
              施工事例の取得に失敗しました
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              再読み込み
            </button>
          </div>
        )}

        {/* データ表示 */}
        {!isLoading &&
          !error &&
          data &&
          data.case &&
          (() => {
            // 実際にアップロードされた画像を使用、なければダミー画像
            const images =
              data.case.images && data.case.images.length > 0
                ? data.case.images
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((img) => img.imageUrl)
                : data.case.mainImageUrl
                  ? [data.case.mainImageUrl, ...dummyImages.slice(1)]
                  : dummyImages;

            // 関連事例（現在の事例を除外）
            const relatedCases: RelatedCase[] =
              relatedData?.cases?.filter(
                (c: ConstructionCase) => c.id !== parseInt(id)
              ) || [];

            return (
              <>
                {/* パンくずリスト */}
                <div className="bg-white border-b">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Link href="/" className="hover:text-red-600 transition">
                        ホーム
                      </Link>
                      <span>/</span>
                      <Link
                        href="/cases"
                        className="hover:text-red-600 transition"
                      >
                        施工事例
                      </Link>
                      <span>/</span>
                      <span className="text-gray-900 font-medium truncate">
                        {data.case.title}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* メインコンテンツ */}
                    <div className="lg:col-span-2">
                      {/* 戻るボタン */}
                      <Link
                        href="/cases"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition mb-6"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        <span>施工事例一覧に戻る</span>
                      </Link>

                      {/* タイトルエリア */}
                      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                          {data.case.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 mb-6">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-5 h-5 text-red-500" />
                            <span>
                              {data.case.prefecture} {data.case.city}
                            </span>
                          </div>
                          {data.case.completionYear && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-5 h-5 text-orange-500" />
                              <span>{data.case.completionYear}年竣工</span>
                            </div>
                          )}
                          {data.case.budget && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <TrendingUp className="w-5 h-5 text-green-500" />
                              <span>{formatBudget(data.case.budget)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-600">
                            <Eye className="w-5 h-5 text-blue-500" />
                            <span>{data.case.viewCount}回閲覧</span>
                          </div>
                        </div>

                        {/* タグ */}
                        <div className="flex flex-wrap gap-2">
                          {data.case.tags.map((ct) => (
                            <span
                              key={ct.id}
                              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-linear-to-r from-red-50 to-orange-50 text-red-700 border border-red-100"
                            >
                              {ct.tag.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 画像ギャラリー */}
                      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <div className="h-1 w-6 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
                          写真ギャラリー
                        </h2>

                        {/* メイン画像 */}
                        <div className="relative aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-4">
                          {images[selectedImage] ? (
                            <Image
                              src={images[selectedImage]}
                              alt={`${data.case.title} - 画像${selectedImage + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                              priority
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-red-400 to-orange-400">
                              <div className="w-32 h-32 bg-white/90 rounded-3xl flex items-center justify-center">
                                <svg
                                  className="w-20 h-20 text-red-500"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* サムネイル */}
                        <div className="grid grid-cols-4 gap-4">
                          {images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedImage(idx)}
                              className={`relative aspect-video bg-gray-200 rounded-lg overflow-hidden transition-all ${
                                selectedImage === idx
                                  ? "ring-4 ring-red-500 scale-95"
                                  : "hover:scale-105"
                              }`}
                            >
                              {img ? (
                                <Image
                                  src={img}
                                  alt={`サムネイル${idx + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 25vw, 200px"
                                />
                              ) : (
                                <div className="w-full h-full bg-linear-to-br from-red-300 to-orange-300"></div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 物件詳細 */}
                      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <div className="h-1 w-6 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
                          物件詳細
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">
                              都道府県
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              {data.case.prefecture}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">
                              市区町村
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              {data.case.city}
                            </div>
                          </div>
                          {data.case.buildingArea && (
                            <div>
                              <div className="text-sm text-gray-500 mb-1">
                                延床面積
                              </div>
                              <div className="text-lg font-bold text-gray-900">
                                {data.case.buildingArea}㎡
                              </div>
                            </div>
                          )}
                          {data.case.budget && (
                            <div>
                              <div className="text-sm text-gray-500 mb-1">
                                建築費用
                              </div>
                              <div className="text-lg font-bold text-gray-900">
                                {formatBudget(data.case.budget)}
                              </div>
                            </div>
                          )}
                          {data.case.completionYear && (
                            <div>
                              <div className="text-sm text-gray-500 mb-1">
                                竣工年
                              </div>
                              <div className="text-lg font-bold text-gray-900">
                                {data.case.completionYear}年
                              </div>
                            </div>
                          )}
                          <div>
                            <div className="text-sm text-gray-500 mb-1">
                              閲覧数
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              {data.case.viewCount}回
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 説明 */}
                      <div className="bg-white rounded-3xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <div className="h-1 w-6 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
                          物件の説明
                        </h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {data.case.description}
                        </p>
                      </div>
                    </div>

                    {/* サイドバー */}
                    <div className="lg:col-span-1">
                      {/* 工務店情報 */}
                      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 sticky top-24">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          この事例を手がけた工務店
                        </h3>

                        <Link
                          href={`/companies/${data.case.company.id}`}
                          className="block group"
                        >
                          {/* 工務店ロゴ/アイコン */}
                          <div className="relative w-20 h-20 bg-linear-to-br from-red-400 to-orange-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            {data.case.company.logoUrl ? (
                              <Image
                                src={data.case.company.logoUrl}
                                alt={data.case.company.name}
                                fill
                                className="object-cover rounded-2xl"
                                sizes="80px"
                              />
                            ) : (
                              <Building2 className="w-10 h-10 text-white" />
                            )}
                          </div>

                          <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition">
                            {data.case.company.name}
                          </h4>
                        </Link>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {data.case.company.description}
                        </p>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span>{data.case.company.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                            <span>{data.case.company.phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                            <span className="truncate">
                              {data.case.company.email}
                            </span>
                          </div>
                          {data.case.company.websiteUrl && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Globe className="w-4 h-4 text-green-500 shrink-0" />
                              <a
                                href={data.case.company.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate"
                              >
                                公式サイト
                              </a>
                            </div>
                          )}
                        </div>

                        <Link
                          href={`/companies/${data.case.company.id}`}
                          className="block w-full px-6 py-3 bg-linear-to-r from-red-500 to-orange-500 text-white text-center rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 mb-3"
                        >
                          工務店の詳細を見る
                        </Link>

                        <Link
                          href={`/inquiry?companyId=${data.case.company.id}`}
                          className="block w-full px-6 py-3 text-red-600 bg-white border-2 border-red-200 text-center rounded-full font-bold hover:bg-red-50 transition-all duration-300"
                        >
                          この工務店に問い合わせ
                        </Link>
                      </div>

                      {/* シェアボタン */}
                      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          この事例をシェア
                        </h3>
                        <button className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
                          <Share2 className="w-5 h-5" />
                          <span>シェアする</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 関連する施工事例 */}
                  {relatedCases.length > 0 && (
                    <div className="mt-16">
                      <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <div className="h-1 w-8 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
                        この工務店の他の事例
                      </h2>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedCases.slice(0, 3).map((relatedCase) => (
                          <Link
                            key={relatedCase.id}
                            href={`/cases/${relatedCase.id}`}
                            className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                          >
                            <div className="relative aspect-video bg-gray-200 overflow-hidden">
                              {relatedCase.mainImageUrl ? (
                                <Image
                                  src={relatedCase.mainImageUrl}
                                  alt={relatedCase.title}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="w-full h-full bg-linear-to-br from-red-400 to-orange-400 flex items-center justify-center">
                                  <div className="w-20 h-20 bg-white/90 rounded-2xl flex items-center justify-center">
                                    <svg
                                      className="w-12 h-12 text-red-500"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="p-6">
                              <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition">
                                {relatedCase.title}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                                <span>
                                  {relatedCase.prefecture} {relatedCase.city}
                                </span>
                              </div>
                              {relatedCase.budget && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                  <TrendingUp className="w-4 h-4 text-orange-500 shrink-0" />
                                  <span>
                                    {formatBudget(relatedCase.budget)}
                                  </span>
                                </div>
                              )}
                              <div className="pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500">
                                  {relatedCase.company.name}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
      </main>

      <Footer />
    </div>
  );
}
