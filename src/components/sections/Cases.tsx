"use client";

import Link from "next/link";
import useSWR from "swr";
import { MapPin, TrendingUp, Calendar, Home, Loader2 } from "lucide-react";
import { formatBudget } from "@/lib/format";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Tag {
  id: number;
  name: string;
}

interface CaseTag {
  id: number;
  tag: Tag;
}

interface ConstructionCase {
  id: number;
  title: string;
  prefecture: string;
  city: string;
  budget: number | null;
  completionYear: number | null;
  mainImageUrl: string | null;
  tags: CaseTag[];
}

interface CasesResponse {
  cases: ConstructionCase[];
}

export function Cases() {
  // 最新の施工事例8件を取得
  const { data, error, isLoading } = useSWR<CasesResponse>(
    "/api/public/cases?limit=8&sort=latest",
    fetcher
  );

  return (
    <section
      id="cases"
      className="py-20 sm:py-32 bg-white relative overflow-hidden"
    >
      {/* 下部の波線デザイン - Cases section (white) から Companies section (orange-50) への遷移 */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 sm:h-24 text-orange-50"
          viewBox="0 0 1440 120"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* セクションタイトル */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
              <span className="text-sm font-bold text-red-600 tracking-widest uppercase">
                Construction Cases
              </span>
              <div className="h-1 w-8 bg-linear-to-r from-orange-500 to-red-500 rounded-full"></div>
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-orange-600">
              施工事例
            </span>
            をチェック
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            実際に建てられた住まいの数々。あなたの理想のイメージを見つけてください。
          </p>
        </div>

        {/* ローディング状態 */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          </div>
        )}

        {/* エラー状態 */}
        {error && (
          <div className="text-center py-20">
            <p className="text-gray-500">施工事例の読み込みに失敗しました</p>
          </div>
        )}

        {/* データ表示 */}
        {!isLoading && !error && data && data.cases && data.cases.length > 0 && (
          <>
            {/* 事例グリッド */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {data.cases.map((case_) => (
                <Link
                  key={case_.id}
                  href={`/cases/${case_.id}`}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* カラーブロック（画像の代わり） */}
                  <div className="h-48 bg-linear-to-br from-red-400 to-orange-400 relative overflow-hidden">
                    {case_.mainImageUrl ? (
                      <img
                        src={case_.mainImageUrl}
                        alt={case_.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        {/* 装飾要素 */}
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                        <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>

                        {/* アイコン */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 bg-white/90 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                            <Home className="w-12 h-12 text-red-500" />
                          </div>
                        </div>
                      </>
                    )}

                    {/* 年度バッジ */}
                    {case_.completionYear && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-red-500" />
                          <span className="text-xs font-bold text-gray-700">
                            {case_.completionYear}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* コンテンツ */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {case_.title}
                    </h3>

                    {/* メタ情報 */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="truncate">
                          {case_.prefecture} {case_.city}
                        </span>
                      </div>

                      {case_.budget && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <TrendingUp className="w-4 h-4 text-orange-500 shrink-0" />
                          <span>{formatBudget(case_.budget)}</span>
                        </div>
                      )}
                    </div>

                    {/* タグ */}
                    <div className="flex flex-wrap gap-2">
                      {case_.tags.slice(0, 2).map((ct) => (
                        <span
                          key={ct.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-red-50 to-orange-50 text-red-700 border border-red-100"
                        >
                          {ct.tag.name}
                        </span>
                      ))}
                      {case_.tags.length > 2 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{case_.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* もっと見るボタン */}
            <div className="text-center">
              <Link href="/cases">
                <button className="px-10 py-4 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  施工事例をもっと見る
                </button>
              </Link>
            </div>
          </>
        )}

        {/* データが空の場合 */}
        {!isLoading && !error && data && (!data.cases || data.cases.length === 0) && (
          <div className="text-center py-20">
            <p className="text-gray-500">施工事例がまだ登録されていません</p>
          </div>
        )}
      </div>
    </section>
  );
}
