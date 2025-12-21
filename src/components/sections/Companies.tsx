"use client";

import { MapPin, Star, Award } from "lucide-react";

export function Companies() {
  const companies = [
    {
      id: 1,
      name: "ナゴヤホーム",
      location: "愛知県名古屋市中区",
      tags: ["注文住宅", "リフォーム", "ナチュラル"],
      rating: 4.8,
      cases: 127,
      gradient: "from-red-500 to-orange-500",
    },
    {
      id: 2,
      name: "東海ハウジング",
      location: "愛知県名古屋市東区",
      tags: ["自然素材", "リノベーション", "北欧風"],
      rating: 4.9,
      cases: 89,
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: 3,
      name: "三河建設",
      location: "愛知県豊田市",
      tags: ["デザイン住宅", "省エネ", "モダン"],
      rating: 4.7,
      cases: 156,
      gradient: "from-red-500 to-orange-500",
    },
    {
      id: 4,
      name: "尾張工務店",
      location: "愛知県一宮市",
      tags: ["和風", "伝統工法", "自然素材"],
      rating: 4.9,
      cases: 203,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section
      id="companies"
      className="py-20 sm:py-32 bg-gradient-to-b from-orange-50 to-white relative overflow-hidden"
    >
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -right-20 w-80 h-80 bg-red-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -left-20 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* セクションタイトル */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <span className="text-sm font-bold text-red-600 tracking-widest uppercase">
                Companies
              </span>
              <div className="h-1 w-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            信頼できる
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              工務店
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            厳選された優良工務店が、あなたの家づくりをサポートします
          </p>
        </div>

        {/* 工務店カード */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {companies.map((company) => (
            <div
              key={company.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              {/* ヘッダー部分（カラーブロック） */}
              <div
                className={`h-48 bg-gradient-to-br ${company.gradient} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-2xl"></div>

                {/* ロゴアイコン */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/90 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-orange-500">
                      {company.name.substring(0, 2)}
                    </span>
                  </div>
                </div>

                {/* 評価バッジ */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-bold text-gray-700">
                    {company.rating}
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
                    <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="truncate">{company.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span>{company.cases}件の実績</span>
                  </div>
                </div>

                {/* タグ */}
                <div className="flex flex-wrap gap-2">
                  {company.tags.slice(0, 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border border-red-100"
                    >
                      {tag}
                    </span>
                  ))}
                  {company.tags.length > 2 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      +{company.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* もっと見るボタン */}
        <div className="text-center">
          <button className="px-10 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            工務店一覧を見る
          </button>
        </div>

        {/* 統計情報 */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { number: "150+", label: "登録工務店" },
            { number: "500+", label: "施工実績" },
            { number: "98%", label: "満足度" },
            { number: "24h", label: "平均返信時間" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-6 bg-white rounded-2xl shadow-md"
            >
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
