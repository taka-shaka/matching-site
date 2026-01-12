"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  FileText,
  MessageSquare,
  LogOut,
  X,
} from "lucide-react";

interface MemberSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  memberName?: string;
  memberRole?: string;
  companyName?: string;
  companyPrefecture?: string;
  companyCity?: string;
}

export default function MemberSidebar({
  isOpen,
  onClose,
  memberName = "山田太郎",
  memberRole = "ADMIN",
  companyName = "株式会社ナゴヤホーム",
  companyPrefecture = "愛知県",
  companyCity = "名古屋市中区",
}: MemberSidebarProps) {
  const pathname = usePathname();

  async function handleLogout() {
    try {
      // Supabaseからログアウト
      const { createSupabaseBrowserClient } = await import("@/lib/supabase");
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      // ログインページにリダイレクト
      window.location.href = "/member/login";
    } catch (error) {
      console.error("ログアウトエラー:", error);
      window.location.href = "/member/login";
    }
  }

  // ナビゲーションリンクの設定
  const navLinks = [
    {
      href: "/member",
      icon: Home,
      label: "ダッシュボード",
      exact: true,
    },
    {
      href: "/member/cases",
      icon: FileText,
      label: "施工事例",
    },
    {
      href: "/member/inquiries",
      icon: MessageSquare,
      label: "問い合わせ",
    },
    {
      href: "/member/company",
      icon: Building2,
      label: "会社情報",
    },
  ];

  // アクティブなリンクかどうかを判定
  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* サイドバー（デスクトップ） */}
      <aside
        className={`
        hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col
        ${isOpen ? "" : ""}
      `}
      >
        <div className="flex flex-col grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          {/* ロゴ */}
          <div className="flex items-center shrink-0 px-6 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-black text-gray-900">
              Member Portal
            </span>
          </div>

          {/* 会社情報 */}
          <div className="px-6 mb-6">
            <div className="p-4 bg-linear-to-br from-blue-50 to-green-50 rounded-xl border border-blue-100">
              <p className="text-xs text-gray-500 mb-1">所属工務店</p>
              <p className="text-sm font-bold text-gray-900">{companyName}</p>
              <p className="text-xs text-gray-600 mt-1">
                {companyPrefecture} {companyCity}
              </p>
            </div>
          </div>

          {/* ナビゲーション */}
          <nav className="flex-1 px-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href, link.exact);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                    active
                      ? "bg-linear-to-r from-blue-500 to-green-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      active ? "text-white" : "text-gray-400"
                    }`}
                  />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ユーザー情報 */}
          <div className="shrink-0 px-3 pb-4">
            <div className="flex items-center px-3 py-3 bg-gray-50 rounded-lg">
              <div className="shrink-0">
                <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {memberName.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {memberName}
                </p>
                <p className="text-xs text-gray-500">{memberRole}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* モバイルメニュー */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-black text-gray-900">
                  Member Portal
                </span>
              </div>
              <button onClick={onClose} className="p-2 text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href, link.exact);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      active
                        ? "bg-linear-to-r from-blue-500 to-green-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
