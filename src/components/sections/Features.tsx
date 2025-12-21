"use client";

import { Search, MessageCircle, FileText, CheckCircle } from "lucide-react";

export function Features() {
  const features = [
    {
      number: "01",
      icon: Search,
      title: "探す",
      subtitle: "SEARCH",
      description:
        "豊富な検索条件から、あなたにぴったりの工務店を見つけられます。エリア、予算、得意分野など、こだわりの条件で絞り込み。",
      color: "from-red-500 to-orange-500",
      bgColor: "from-red-50 to-orange-50",
      iconBg: "bg-gradient-to-br from-red-500 to-orange-500",
    },
    {
      number: "02",
      icon: FileText,
      title: "比較する",
      subtitle: "COMPARE",
      description:
        "複数の工務店の施工事例や特徴を並べて比較。実績、デザイン、価格帯など、多角的に検討できます。",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      iconBg: "bg-gradient-to-br from-orange-500 to-red-500",
    },
    {
      number: "03",
      icon: MessageCircle,
      title: "相談する",
      subtitle: "CONTACT",
      description:
        "気になる工務店に直接お問い合わせ。資料請求や見学予約も簡単に。専門スタッフが丁寧に対応します。",
      color: "from-red-500 to-orange-500",
      bgColor: "from-red-50 to-orange-50",
      iconBg: "bg-gradient-to-br from-red-500 to-orange-500",
    },
    {
      number: "04",
      icon: CheckCircle,
      title: "実現する",
      subtitle: "REALIZE",
      description:
        "理想の工務店と出会い、夢のマイホームを実現。プランニングから完成まで、ずっとサポートします。",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      iconBg: "bg-gradient-to-br from-orange-500 to-red-500",
    },
  ];

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-white to-orange-50 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* セクションタイトル */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <span className="text-sm font-bold text-red-600 tracking-widest uppercase">
                Feature
              </span>
              <div className="h-1 w-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            4つのステップで
            <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              理想の家づくり
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            シンプルで分かりやすいプロセスで、あなたの夢を実現します
          </p>
        </div>

        {/* 特徴グリッド */}
        <div className="space-y-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-8 lg:gap-12`}
            >
              {/* イラストエリア */}
              <div className="flex-1 w-full">
                <div
                  className={`relative bg-gradient-to-br ${feature.bgColor} rounded-3xl p-12 shadow-xl h-80 flex items-center justify-center overflow-hidden`}
                >
                  {/* 装飾的な円 */}
                  <div className="absolute top-10 right-10 w-32 h-32 bg-white/30 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>

                  {/* アイコン */}
                  <div className="relative">
                    <div
                      className={`w-40 h-40 ${feature.iconBg} rounded-3xl flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-transform duration-300`}
                    >
                      <feature.icon
                        className="w-24 h-24 text-white"
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* 番号バッジ */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                      <span
                        className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br ${feature.color}`}
                      >
                        {feature.number}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* テキストエリア */}
              <div className="flex-1 w-full text-center lg:text-left">
                <div className="mb-4">
                  <span
                    className={`text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r ${feature.color} tracking-widest uppercase`}
                  >
                    {feature.subtitle}
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">
                  {feature.title}
                </h3>

                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  {feature.description}
                </p>

                <button
                  className={`px-8 py-4 bg-gradient-to-r ${feature.color} text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                >
                  詳しく見る
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
