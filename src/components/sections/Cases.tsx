"use client";

import { MapPin, TrendingUp, Calendar } from "lucide-react";

export function Cases() {
  const cases = [
    {
      id: 1,
      title: "ナチュラルテイストの平屋",
      location: "愛知県名古屋市",
      budget: "3000万円台",
      year: 2024,
      tags: ["平屋", "ナチュラル", "注文住宅"],
      gradient: "from-red-400 to-orange-400",
    },
    {
      id: 2,
      title: "モダンスタイルの二世帯住宅",
      location: "愛知県名古屋市",
      budget: "4000万円台",
      year: 2024,
      tags: ["二世帯住宅", "シンプルモダン", "3階建て以上"],
      gradient: "from-orange-400 to-red-400",
    },
    {
      id: 3,
      title: "北欧風デザインのこだわりの家",
      location: "愛知県名古屋市",
      budget: "3000万円台",
      year: 2024,
      tags: ["北欧風", "ナチュラル", "注文住宅"],
      gradient: "from-red-400 to-orange-400",
    },
    {
      id: 4,
      title: "ガレージ付きアメリカンスタイル",
      location: "愛知県名古屋市",
      budget: "5000万円台",
      year: 2023,
      tags: ["ガレージハウス", "アメリカンスタイル"],
      gradient: "from-orange-400 to-red-400",
    },
  ];

  return (
    <section
      id="cases"
      className="py-20 sm:py-32 bg-white relative overflow-hidden"
    >
      {/* 背景装飾 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-200 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-orange-200 to-transparent"></div>
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
              <div className="h-1 w-8 bg-linear-to-rrom-orange-500 to-red-500 rounded-full"></div>
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

        {/* 事例グリッド */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cases.map((case_) => (
            <div
              key={case_.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              {/* カラーブロック（画像の代わり） */}
              <div
                className={`h-48 bg-linear-to-br ${case_.gradient} relative overflow-hidden`}
              >
                {/* 装飾要素 */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>

                {/* アイコン */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/90 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-12 h-12 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                    </svg>
                  </div>
                </div>

                {/* 年度バッジ */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-red-500" />
                    <span className="text-xs font-bold text-gray-700">
                      {case_.year}
                    </span>
                  </div>
                </div>
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
                    <span className="truncate">{case_.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>{case_.budget}</span>
                  </div>
                </div>

                {/* タグ */}
                <div className="flex flex-wrap gap-2">
                  {case_.tags.slice(0, 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-red-50 to-orange-50 text-red-700 border border-red-100"
                    >
                      {tag}
                    </span>
                  ))}
                  {case_.tags.length > 2 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      +{case_.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* もっと見るボタン */}
        <div className="text-center">
          <button className="px-10 py-4 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            施工事例をもっと見る
          </button>
        </div>
      </div>
    </section>
  );
}
