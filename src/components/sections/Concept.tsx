"use client";

import { Heart, Users, Home } from "lucide-react";

export function Concept() {
  return (
    <section className="py-20 sm:py-32 bg-white relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* セクションタイトル */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <span className="text-sm font-bold text-red-600 tracking-widest uppercase">
                Concept
              </span>
              <div className="h-1 w-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            住まいづくりは
            <br className="sm:hidden" />
            <span className="text-red-600">人生づくり</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            私たちは、お客様と工務店の最高の出会いをサポートします。
            <br className="hidden sm:block" />
            理想の住まいを実現するために、信頼できるパートナーを見つけましょう。
          </p>
        </div>

        {/* コンセプトカード */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* カード1: こだわり */}
          <div className="group relative bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                <Heart className="w-8 h-8 text-white" fill="currentColor" />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                こだわりを
                <br />
                カタチに
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                注文住宅だからこそ実現できる、あなただけのこだわりの住まい。細部まで妥協せず、理想を追求できます。
              </p>
            </div>
          </div>

          {/* カード2: つながり */}
          <div className="group relative bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                信頼できる
                <br />
                パートナー
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                経験豊富な工務店が、あなたの家づくりを全力でサポート。一生のお付き合いができるパートナーと出会えます。
              </p>
            </div>
          </div>

          {/* カード3: 安心 */}
          <div className="group relative bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                <Home className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                安心の
                <br />
                サポート体制
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                プロジェクトの始まりから完成まで、そしてアフターフォローまで。ずっと安心して暮らせる住まいづくりを。
              </p>
            </div>
          </div>
        </div>

        {/* 追加メッセージ */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full px-8 py-4 border-2 border-red-200">
            <p className="text-gray-700 font-medium">
              <span className="text-red-600 font-bold">理想の住まい</span>は、
              <span className="text-orange-600 font-bold">
                信頼できる工務店
              </span>
              から始まります
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
