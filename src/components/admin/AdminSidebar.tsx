"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Building2,
  Users,
  FileText,
  UserCircle,
  Tags,
  LogOut,
  X,
  BarChart3,
  MessageCircle,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  adminName?: string;
  adminRole?: "SUPER_ADMIN" | "ADMIN";
}

export default function AdminSidebar({
  isOpen,
  onClose,
  adminName = "管理者 太郎",
  adminRole = "SUPER_ADMIN",
}: AdminSidebarProps) {
  const pathname = usePathname();

  async function handleLogout() {
    try {
      // Supabaseからログアウト
      const { createSupabaseBrowserClient } = await import("@/lib/supabase");
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      // ログインページにリダイレクト
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("ログアウトエラー:", error);
      window.location.href = "/admin/login";
    }
  }

  // ナビゲーションリンクの設定
  const navLinks = [
    {
      href: "/admin",
      icon: BarChart3,
      label: "ダッシュボード",
      exact: true,
    },
    {
      href: "/admin/companies",
      icon: Building2,
      label: "工務店管理",
    },
    {
      href: "/admin/members",
      icon: Users,
      label: "メンバー管理",
    },
    {
      href: "/admin/cases",
      icon: FileText,
      label: "施工事例管理",
    },
    {
      href: "/admin/customers",
      icon: UserCircle,
      label: "会員顧客管理",
    },
    {
      href: "/admin/general-inquiries",
      icon: MessageCircle,
      label: "サイト問い合わせ",
    },
    {
      href: "/admin/tags",
      icon: Tags,
      label: "タグ管理",
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
      {/* サイドバー */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-950 shadow-2xl transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* ヘッダー */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-white">管理者</h1>
                  <p className="text-xs text-gray-400">管理ダッシュボード</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* 管理者情報カード */}
            <div className="bg-linear-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-4 border border-blue-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow">
                  {adminName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {adminName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {adminRole === "SUPER_ADMIN" ? "スーパー管理者" : "管理者"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ナビゲーション */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href, link.exact);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    active
                      ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ログアウト */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition"
            >
              <LogOut className="h-4 w-4" />
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      </aside>

      {/* オーバーレイ (モバイル) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
