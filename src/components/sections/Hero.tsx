"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
      {/* 背景画像 */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-background.jpg"
          alt="家族の暮らし"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-105"
        />
        {/* グラデーションオーバーレイで視認性を向上 */}
        <div className="absolute inset-0 bg-linear-to-b from-white/40 via-white/20 to-white/60"></div>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* イラスト風アイコン - 家のシルエット */}
        {/* <div className="mb-8 flex justify-center">
          <div className="relative">
            家のイラスト
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-red-400 to-orange-500 rounded-3xl transform rotate-45 shadow-2xl">
              <div className="absolute inset-4 bg-white rounded-2xl transform -rotate-45 flex items-center justify-center">
                <svg
                  className="w-16 h-16 sm:w-20 sm:h-20 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
            </div>
            装飾的な小さな家
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-orange-400 rounded-2xl transform rotate-12 shadow-lg opacity-80"></div>
          </div>
        </div> */}

        {/* キャッチコピー */}
        <h1 className="mt-20 mb-20">
          <span className="block text-7xl sm:text-8xl lg:text-9xl font-black text-red-600 mb-2 tracking-tight font-poppins drop-shadow-2xl transform hover:scale-105 transition-transform duration-300">
            No House,
          </span>
          <span className="block text-7xl sm:text-8xl lg:text-9xl font-black text-red-600 mb-2 tracking-tight font-poppins drop-shadow-2xl transform hover:scale-105 transition-transform duration-300">
            No Life
          </span>
          <span className="block text-xl sm:text-2xl lg:text-3xl font-black text-orange-600 tracking-tight font-poppins">
            豊かな暮らしなしじゃ、生きられない
          </span>
        </h1>

        <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-4 font-medium">
          あなたにぴったりの工務店と出会える
        </p>

        {/* CTAボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            href="/companies"
            className="group relative px-8 py-4 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto text-center"
          >
            <span className="relative z-10">工務店を探す</span>
            <div className="absolute inset-0 bg-linear-to-r from-red-600 to-orange-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          <Link
            href="/cases"
            className="px-8 py-4 bg-white text-red-600 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-red-200 w-full sm:w-auto text-center inline-block"
          >
            施工事例を見る
          </Link>
        </div>

        {/* スクロール促進アイコン */}
        <div className="animate-bounce">
          <ChevronDown className="w-8 h-8 text-red-500 mx-auto" />
        </div>
      </div>

      {/* 下部の波型デザイン */}
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
    </section>
  );
}
