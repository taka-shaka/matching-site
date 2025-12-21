"use client";

import { Search, Users, FileText, Hammer, Key, Sparkles } from "lucide-react";

export function Process() {
  const steps = [
    {
      number: 1,
      icon: Search,
      title: "工務店を探す",
      description:
        "エリアや予算、デザインの好みなどから、あなたにぴったりの工務店を検索",
      color: "from-red-500 to-orange-500",
    },
    {
      number: 2,
      icon: Users,
      title: "相談・見学",
      description:
        "気になる工務店に問い合わせ。モデルハウス見学や個別相談で理想を共有",
      color: "from-orange-500 to-red-500",
    },
    {
      number: 3,
      icon: FileText,
      title: "プラン作成",
      description:
        "詳細な要望をヒアリング。間取りやデザインのプランを何度も打ち合わせ",
      color: "from-red-500 to-orange-500",
    },
    {
      number: 4,
      icon: Hammer,
      title: "着工・施工",
      description:
        "契約後、いよいよ工事スタート。定期的に進捗報告を受けながら完成を待つ",
      color: "from-orange-500 to-red-500",
    },
    {
      number: 5,
      icon: Key,
      title: "引き渡し",
      description:
        "完成した住まいをチェック。説明を受けてついに夢のマイホームへ",
      color: "from-red-500 to-orange-500",
    },
    {
      number: 6,
      icon: Sparkles,
      title: "アフターフォロー",
      description:
        "入居後も定期点検やメンテナンス。長く安心して暮らせるサポート体制",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section className="py-20 sm:py-32 bg-white relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-200 to-transparent"></div>
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* セクションタイトル */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <span className="text-sm font-bold text-red-600 tracking-widest uppercase">
                Process
              </span>
              <div className="h-1 w-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            家づくりの
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              流れ
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            6つのステップで、理想の住まいを実現します
          </p>
        </div>

        {/* プロセスタイムライン */}
        <div className="relative">
          {/* 接続線（デスクトップ） */}
          <div className="hidden xl:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-red-200 via-orange-200 to-red-200 rounded-full"></div>

          {/* 接続線（タブレット - 1行目） */}
          <div className="hidden lg:block xl:hidden absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-red-200 via-orange-200 to-red-200 rounded-full"></div>

          {/* 接続線（タブレット - 2行目） */}
          <div className="hidden lg:block xl:hidden absolute top-[calc(50%+20px)] left-0 right-0 h-1 bg-gradient-to-r from-red-200 via-orange-200 to-red-200 rounded-full"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* ステップカード */}
                <div className="relative bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-4 xl:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group h-full flex flex-col">
                  {/* 番号バッジ */}
                  <div className="absolute -top-4 xl:-top-5 left-1/2 -translate-x-1/2">
                    <div
                      className={`w-12 h-12 xl:w-14 xl:h-14 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}
                    >
                      <span className="text-xl xl:text-2xl font-black text-white">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* アイコン */}
                  <div className="mt-6 xl:mt-8 mb-3 xl:mb-4 flex justify-center">
                    <div className="w-14 h-14 xl:w-16 xl:h-16 bg-white rounded-2xl flex items-center justify-center shadow-md">
                      <step.icon className="w-7 h-7 xl:w-8 xl:h-8 text-red-500" />
                    </div>
                  </div>

                  {/* タイトル */}
                  <h3 className="text-base xl:text-lg font-bold text-gray-900 mb-2 xl:mb-3 text-center">
                    {step.title}
                  </h3>

                  {/* 説明 */}
                  <p className="text-gray-600 leading-relaxed text-center text-xs xl:text-sm flex-1">
                    {step.description}
                  </p>

                  {/* 装飾的なドット */}
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-400 rounded-full opacity-50"></div>
                  <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-50"></div>
                </div>

                {/* 接続線（モバイルのみ） */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-red-300 to-orange-300 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTAセクション */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            {/* 背景装飾 */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-6">
                まずは気軽に相談してみませんか？
              </h3>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                専門のアドバイザーが、あなたの家づくりをサポートします
              </p>
              <button className="px-10 py-4 bg-white text-red-600 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                無料相談を予約する
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
