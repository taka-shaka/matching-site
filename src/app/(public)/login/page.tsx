"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-provider";
import { translateAuthError } from "@/lib/auth-errors";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, loading: authLoading } = useAuth();

  // リダイレクト先URLとメッセージを取得
  const redirectUrl = searchParams.get("redirect") || "/";
  const message = searchParams.get("message");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.error) {
        // エラーメッセージを日本語に変換
        setError(translateAuthError(result.error.message));
        setIsLoading(false);
        return;
      }

      if (!result.user) {
        setError("ログインに失敗しました。入力内容をご確認ください。");
        setIsLoading(false);
        return;
      }

      // 顧客アカウントかどうかをチェック
      const userType = result.user.userType;

      if (userType === "member") {
        setError(
          "工務店メンバーの方は専用ログインページからログインしてください"
        );
        setIsLoading(false);
        return;
      }

      if (userType === "admin") {
        setError("管理者の方は専用ログインページからログインしてください");
        setIsLoading(false);
        return;
      }

      // 顧客としてログイン成功 - 元のページまたはトップページにリダイレクト
      router.push(redirectUrl);
      router.refresh();
    } catch (err) {
      // 予期しないエラーの場合
      const errorMessage =
        err instanceof Error
          ? err.message
          : "ログインに失敗しました。入力内容をご確認ください。";
      setError(translateAuthError(errorMessage));
      setIsLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-orange-50 via-red-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          {/* ヘッダー */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-linear-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">ログイン</h2>
            <p className="text-gray-600 text-sm">
              アカウントをお持ちでない方は{" "}
              <Link
                href="/signup"
                className="font-medium text-red-600 hover:text-red-500"
              >
                新規登録
              </Link>
            </p>
          </div>

          {/* フォーム */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* 成功メッセージ（新規登録後など） */}
            {message && !error && (
              <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                  <p className="text-sm text-green-800">{message}</p>
                </div>
              </div>
            )}

            {/* エラーメッセージ */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* メールアドレス */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-gray-700 mb-2"
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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="example@example.com"
                  />
                </div>
              </div>

              {/* パスワード */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-gray-700 mb-2"
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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* オプション */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  ログイン状態を保持
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-red-600 hover:text-red-500"
                >
                  パスワードを忘れた場合
                </Link>
              </div>
            </div>

            {/* ログインボタン */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-xl border border-transparent bg-linear-to-r from-red-600 to-orange-600 py-3 px-4 text-sm font-bold text-white hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
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
            <div className="flex items-center justify-center text-sm">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                ← トップページに戻る
              </Link>
            </div>
          </form>

          {/* フッター情報 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              工務店メンバーの方は
              <Link
                href="/member/login"
                className="text-red-600 hover:text-red-500"
              >
                こちら
              </Link>
              からログインしてください。
            </p>
          </div>
        </div>

        {/* コピーライト */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            © 2026 House Match（仮）. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
