"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Home, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-provider";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // 現在のURLをエンコードしてredirectパラメータに使用
  const getAuthUrl = (authPath: string) => {
    // ログイン/新規登録ページ自体の場合は追加しない
    if (pathname === "/login" || pathname === "/signup") {
      return authPath;
    }
    return `${authPath}?redirect=${encodeURIComponent(pathname)}`;
  };

  const navItems = [
    { label: "工務店検索", href: "/companies" },
    { label: "施工事例", href: "/cases" },
    { label: "家づくりの流れ", href: "/#process" },
    { label: "無料相談", href: "/#contact" },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      {/* メインヘッダー */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* ロゴ */}
          <Link
            href="/"
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-linear-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Home className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900 hidden sm:block">
              House Match（仮）
            </span>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-base font-medium text-gray-700 hover:text-red-600 transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* デスクトップボタン */}
          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              <div className="px-6 py-2.5 text-sm text-gray-400">
                読み込み中...
              </div>
            ) : user && user.userType === "customer" ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  <span>{user.name || user.email}</span>
                </button>

                {/* ユーザーメニュードロップダウン */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-xs text-gray-500">ログイン中</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name || user.email}
                      </p>
                    </div>
                    <Link
                      href="/customer"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>マイページ</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>ログアウト</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href={getAuthUrl("/signup")}>
                  <button className="px-6 py-2.5 text-sm font-bold text-red-600 bg-white border-2 border-red-200 rounded-full hover:bg-red-50 transition-all duration-300 hover:scale-105">
                    新規登録
                  </button>
                </Link>
                <Link href={getAuthUrl("/login")}>
                  <button className="px-6 py-2.5 text-sm font-bold text-white bg-linear-to-r from-red-500 to-orange-500 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                    ログイン
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* モバイルメニューボタン */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-red-600 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* サブヘッダー（情報バー） */}
      <div className="bg-linear-to-r from-gray-600 to-gray-700 text-white py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm">
            <span className="font-medium">
              愛知・岐阜・三重の注文住宅情報サイト
            </span>
            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-orange-300">工務店</span>
                <span className="font-black text-orange-400">150</span>
                <span>件</span>
              </div>
              <div className="w-1 h-1 bg-white/50 rounded-full"></div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-orange-300">施工事例</span>
                <span className="font-black text-orange-400">500</span>
                <span>件</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {/* モバイルナビゲーション */}
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 px-4 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}

            {/* モバイルボタン */}
            <div className="pt-4 space-y-3 border-t border-gray-200">
              {user && user.userType === "customer" ? (
                <>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">ログイン中</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name || user.email}
                    </p>
                  </div>
                  <Link href="/customer">
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-blue-600 bg-white border-2 border-blue-200 rounded-full hover:bg-blue-50 transition-all duration-300"
                    >
                      <User className="w-4 h-4" />
                      <span>マイページ</span>
                    </button>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>ログアウト</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href={getAuthUrl("/signup")}>
                    <button className="w-full px-6 py-3 text-sm font-bold text-red-600 bg-white border-2 border-red-200 rounded-full hover:bg-red-50 transition-all duration-300">
                      新規登録
                    </button>
                  </Link>
                  <Link href={getAuthUrl("/login")}>
                    <button className="w-full px-6 py-3 text-sm font-bold text-white bg-linear-to-r from-red-500 to-orange-500 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                      ログイン
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
