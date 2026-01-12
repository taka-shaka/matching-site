// src/app/admin/login/page.tsx
// 管理者ログインページ

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-provider";

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { user, error: signInError } = await signIn(email, password);

      if (signInError) {
        // エラーメッセージを日本語に変換
        const errorMessage = signInError.message;
        if (errorMessage.includes("Invalid login credentials")) {
          setError("メールアドレスまたはパスワードが正しくありません");
        } else if (errorMessage.includes("Email not confirmed")) {
          setError("メールアドレスが確認されていません");
        } else if (errorMessage.includes("User not found")) {
          setError("アカウントが見つかりません");
        } else {
          setError("ログインに失敗しました。入力内容をご確認ください。");
        }
        setIsLoading(false);
        return;
      }

      if (!user) {
        setError("ログインに失敗しました。入力内容をご確認ください。");
        setIsLoading(false);
        return;
      }

      // 管理者かどうかをチェック
      if (user.userType !== "admin") {
        setError("管理者アカウントでログインしてください");
        setIsLoading(false);
        return;
      }

      // ログイン成功 - 管理者ダッシュボードへ
      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("ログイン処理中にエラーが発生しました");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* ヘッダー */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">
              管理者ログイン
            </h2>
            <p className="text-gray-300 text-sm">
              管理者専用のログインページです
            </p>
          </div>

          {/* フォーム */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-500/20 border border-red-500/50 p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* メールアドレス */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  メールアドレス
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              {/* パスワード */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  パスワード
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* ログインボタン */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-xl border border-transparent bg-linear-to-r from-blue-600 to-purple-600 py-3 px-4 text-sm font-bold text-white hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ログイン中...
                  </span>
                ) : (
                  "ログイン"
                )}
              </button>
            </div>

            {/* その他のリンク */}
            <div className="flex items-center justify-between text-sm">
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition"
              >
                ← トップページに戻る
              </Link>
            </div>
          </form>

          {/* フッター情報 */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-xs text-gray-400">
              管理者専用ページです。一般ユーザーの方は
              <Link href="/login" className="text-blue-400 hover:text-blue-300">
                こちら
              </Link>
              からログインしてください。
            </p>
          </div>
        </div>

        {/* コピーライト */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            © 2026 House Match（仮）. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
