"use client";

import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { MapPin, Star, Award, Building2, Loader2 } from "lucide-react";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Tag {
  id: number;
  name: string;
}

interface CompanyTag {
  id: number;
  tag: Tag;
}

interface Company {
  id: number;
  name: string;
  prefecture: string;
  city: string;
  logoUrl: string | null;
  mainImageUrl: string | null;
  tags: CompanyTag[];
  _count: {
    cases: number;
  };
}

interface CompaniesResponse {
  companies: Company[];
  pagination: {
    total: number;
  };
}

export function Companies() {
  // 最新の工務店8件を取得
  const { data, error, isLoading } = useSWR<CompaniesResponse>(
    "/api/public/companies?limit=8&sort=latest",
    fetcher
  );

  return (
    <section
      id="companies"
      className="py-20 sm:py-32 bg-linear-to-b from-orange-50 to-white relative overflow-hidden"
    >
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -right-20 w-80 h-80 bg-red-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -left-20 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* 下部の波線デザイン - Companies section から Process section への遷移 */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 sm:h-24 text-white"
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
                Companies
              </span>
              <div className="h-1 w-8 bg-linear-to-r from-orange-500 to-red-500 rounded-full"></div>
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            信頼できる
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-orange-600">
              工務店
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            厳選された優良工務店が、あなたの家づくりをサポートします
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
            <p className="text-gray-500">工務店の読み込みに失敗しました</p>
          </div>
        )}

        {/* データ表示 */}
        {!isLoading && !error && data && (
          <>
            {/* 工務店カード */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {data.companies.map((company) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.id}`}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* ヘッダー部分（カラーブロック） */}
                  <div className="h-48 relative overflow-hidden">
                    {/* 背景画像またはグラデーション */}
                    {company.mainImageUrl ? (
                      <>
                        <Image
                          src={company.mainImageUrl}
                          alt={company.name}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover"
                        />
                        {/* テキスト視認性向上のためのグラデーションオーバーレイ */}
                        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/60"></div>
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-linear-to-br from-red-500 to-orange-500"></div>
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                        <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-2xl"></div>
                      </>
                    )}

                    {/* ロゴアイコン */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="w-20 h-20 bg-white/90 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                        {company.logoUrl ? (
                          <Image
                            src={company.logoUrl}
                            alt={company.name}
                            fill
                            sizes="80px"
                            className="object-cover rounded-2xl"
                          />
                        ) : (
                          <Building2 className="w-10 h-10 text-red-500" />
                        )}
                      </div>
                    </div>

                    {/* 評価バッジ */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg z-10">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-bold text-gray-700">
                        4.8
                      </span>
                    </div>
                  </div>

                  {/* コンテンツ */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {company.name}
                    </h3>

                    {/* メタ情報 */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="truncate">
                          {company.prefecture} {company.city}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="w-4 h-4 text-orange-500 shrink-0" />
                        <span>{company._count.cases}件の実績</span>
                      </div>
                    </div>

                    {/* タグ */}
                    <div className="flex flex-wrap gap-2">
                      {company.tags.slice(0, 2).map((ct) => (
                        <span
                          key={ct.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-red-50 to-orange-50 text-red-700 border border-red-100"
                        >
                          {ct.tag.name}
                        </span>
                      ))}
                      {company.tags.length > 2 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{company.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* もっと見るボタン */}
            <div className="text-center">
              <Link href="/companies">
                <button className="px-10 py-4 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  工務店一覧を見る
                </button>
              </Link>
            </div>

            {/* 統計情報 */}
            <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white rounded-2xl shadow-md">
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-600 to-orange-600 mb-2">
                  {data.pagination.total}+
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  登録工務店
                </div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-md">
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-600 to-orange-600 mb-2">
                  500+
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  施工実績
                </div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-md">
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-600 to-orange-600 mb-2">
                  98%
                </div>
                <div className="text-sm text-gray-600 font-medium">満足度</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-md">
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-600 to-orange-600 mb-2">
                  24h
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  平均返信時間
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
