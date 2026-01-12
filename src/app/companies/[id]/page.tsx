// src/app/companies/[id]/page.tsx
// 工務店詳細ページ（API連携版）

"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import {
  MapPin,
  TrendingUp,
  Building2,
  Mail,
  Phone,
  Globe,
  ChevronLeft,
  Share2,
  Users,
  Award,
  Clock,
  Star,
  MessageCircle,
  ExternalLink,
  Calendar,
  Home,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { useAuth } from "@/lib/auth-provider";
import { formatBudget } from "@/lib/format";

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Tag {
  id: number;
  name: string;
  category: string;
}

interface CompanyTag {
  id: number;
  companyId: number;
  tagId: number;
  createdAt: string;
  tag: Tag;
}

interface CasePreview {
  id: number;
  title: string;
  description: string;
  prefecture: string;
  city: string;
  budget: number | null;
  completionYear: number | null;
  mainImageUrl: string | null;
  tags: {
    id: number;
    tag: {
      name: string;
    };
  }[];
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
  mainImageUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  tags: CompanyTag[];
  cases: CasePreview[];
  _count: {
    cases: number;
    members: number;
  };
}

interface CompanyDetailResponse {
  company: Company;
}

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();

  // 工務店詳細データ取得
  const { data, error, isLoading } = useSWR<CompanyDetailResponse>(
    `/api/public/companies/${id}`,
    fetcher,
    {
      onSuccess: (data) => {
        console.log("API Response:", data);
      },
      onError: (err) => {
        console.error("API Error:", err);
      },
    }
  );

  // 問い合わせボタンのリンク先を決定
  const getInquiryUrl = () => {
    const inquiryPath = `/inquiry?companyId=${id}`;
    if (user) {
      // ログイン済みの場合は直接問い合わせページへ
      return inquiryPath;
    } else {
      // 未ログインの場合は新規登録ページへ(問い合わせページにリダイレクト)
      return `/signup?redirect=${encodeURIComponent(inquiryPath)}`;
    }
  };

  // ローディング状態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-[60px]">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // エラー状態
  if (error || !data || !data.company) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-[60px]">
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-gray-600 mb-4">工務店情報の取得に失敗しました</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              再読み込み
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const company = data.company;

  // 創業年数を計算（createdAtがない場合は現在の年をデフォルト値として使用）
  const establishedYear = company.createdAt
    ? new Date(company.createdAt).getFullYear()
    : new Date().getFullYear();
  const yearsInBusiness = new Date().getFullYear() - establishedYear;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* メインコンテンツ */}
      <main className="pt-[60px]">
        {/* パンくずリスト */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-red-600 transition">
                ホーム
              </Link>
              <span>/</span>
              <Link href="/companies" className="hover:text-red-600 transition">
                工務店検索
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{company.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* メインコンテンツ */}
            <div className="lg:col-span-2">
              {/* 戻るボタン */}
              <Link
                href="/companies"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition mb-6"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>工務店一覧に戻る</span>
              </Link>

              {/* メイン画像（ヒーローセクション） */}
              {company.mainImageUrl && (
                <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-3xl overflow-hidden mb-8 shadow-lg">
                  <Image
                    src={company.mainImageUrl}
                    alt={`${company.name}のメイン画像`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                </div>
              )}

              {/* 工務店基本情報 */}
              <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                {/* ロゴ・名前 */}
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-24 h-24 bg-linear-to-br from-red-400 to-orange-400 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden">
                    {company.logoUrl ? (
                      <Image
                        src={company.logoUrl}
                        alt={company.name}
                        fill
                        className="object-cover rounded-2xl"
                        sizes="96px"
                      />
                    ) : (
                      <Building2 className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                      {company.name}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <span>
                        {company.prefecture} {company.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-gray-900">4.8</span>
                        <span className="text-sm text-gray-500">(48件)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* タグ */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {company.tags.map((ct) => (
                    <span
                      key={ct.id}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-linear-to-r from-red-50 to-orange-50 text-red-700 border border-red-100"
                    >
                      {ct.tag.name}
                    </span>
                  ))}
                </div>

                {/* 統計情報 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-orange-500 mb-1">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                      {yearsInBusiness}年
                    </div>
                    <div className="text-sm text-gray-500">創業年数</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-blue-500 mb-1">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                      {company._count.members}人
                    </div>
                    <div className="text-sm text-gray-500">メンバー数</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-green-500 mb-1">
                      <Home className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                      {company._count.cases}件
                    </div>
                    <div className="text-sm text-gray-500">施工事例</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-yellow-500 mb-1">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-black text-gray-900">4.8</div>
                    <div className="text-sm text-gray-500">評価</div>
                  </div>
                </div>
              </div>

              {/* 会社の説明 */}
              <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="h-1 w-6 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
                  会社について
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {company.description}
                </p>
              </div>

              {/* 施工事例 */}
              <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <div className="h-1 w-6 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
                    施工事例 ({company._count.cases}件)
                  </h2>
                  <Link
                    href={`/cases?companyId=${company.id}`}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    すべて見る
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

                {company.cases.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <p className="text-gray-500">
                      施工事例はまだ登録されていません
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {company.cases.map((caseItem) => (
                      <Link
                        key={caseItem.id}
                        href={`/cases/${caseItem.id}`}
                        className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="aspect-video bg-linear-to-br from-red-400 to-orange-400 overflow-hidden relative">
                          {caseItem.mainImageUrl ? (
                            <Image
                              src={caseItem.mainImageUrl}
                              alt={caseItem.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-20 h-20 bg-white/90 rounded-2xl flex items-center justify-center shadow-lg">
                                <Home className="w-12 h-12 text-red-500" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition">
                            {caseItem.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                            <span>
                              {caseItem.prefecture} {caseItem.city}
                            </span>
                          </div>
                          {caseItem.budget && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                              <TrendingUp className="w-4 h-4 text-orange-500 shrink-0" />
                              <span>{formatBudget(caseItem.budget)}</span>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {caseItem.tags.slice(0, 2).map((ct) => (
                              <span
                                key={ct.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200"
                              >
                                {ct.tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 会社情報 */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="h-1 w-6 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
                  会社情報
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="text-sm text-gray-500 w-24 shrink-0 pt-1">
                      会社名
                    </div>
                    <div className="text-base font-medium text-gray-900">
                      {company.name}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="text-sm text-gray-500 w-24 shrink-0 pt-1">
                      所在地
                    </div>
                    <div className="text-base text-gray-900">
                      {company.address}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="text-sm text-gray-500 w-24 shrink-0 pt-1">
                      電話番号
                    </div>
                    <div className="text-base text-gray-900">
                      {company.phoneNumber}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="text-sm text-gray-500 w-24 shrink-0 pt-1">
                      メール
                    </div>
                    <div className="text-base text-gray-900">
                      {company.email}
                    </div>
                  </div>
                  {company.websiteUrl && (
                    <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                      <div className="text-sm text-gray-500 w-24 shrink-0 pt-1">
                        ウェブサイト
                      </div>
                      <a
                        href={company.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base text-blue-600 hover:underline flex items-center gap-1"
                      >
                        公式サイトを見る
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="text-sm text-gray-500 w-24 shrink-0 pt-1">
                      創業年
                    </div>
                    <div className="text-base text-gray-900">
                      {establishedYear}年
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* サイドバー */}
            <div className="lg:col-span-1">
              {/* お問い合わせカード */}
              <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  この工務店に問い合わせる
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                    <span>通常24時間以内に返信</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MessageCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span>無料相談受付中</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href={getInquiryUrl()}
                    className="w-full px-6 py-3 bg-linear-to-r from-red-500 to-orange-500 text-white text-center rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    <span>
                      {user ? "メールで問い合わせ" : "会員登録して問い合わせ"}
                    </span>
                  </Link>
                  <a
                    href={`tel:${company.phoneNumber}`}
                    className="w-full px-6 py-3 text-red-600 bg-white border-2 border-red-200 text-center rounded-full font-bold hover:bg-red-50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    <span>電話で問い合わせ</span>
                  </a>
                </div>

                <div className="mt-6 p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-bold text-blue-700">
                      無料相談実施中！
                    </span>
                    <br />
                    家づくりに関するご相談や見学会の予約など、お気軽にお問い合わせください。
                  </p>
                </div>
              </div>

              {/* シェアボタン */}
              <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  この工務店をシェア
                </h3>
                <button className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  <span>シェアする</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
