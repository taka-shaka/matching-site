// src/app/member/login/page.tsx
// メンバー（工務店）ログインページ

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-provider";

export default function MemberLoginPage() {
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

      // 工務店メンバーかどうかをチェック
      if (user.userType !== "member") {
        setError("工務店メンバーアカウントでログインしてください");
        setIsLoading(false);
        return;
      }

      // ログイン成功 - メンバーダッシュボードへ
      router.push("/member");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("ログイン処理中にエラーが発生しました");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 via-green-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          {/* ヘッダー */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-linear-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              工務店ログイン
            </h2>
            <p className="text-gray-600 text-sm">
              工務店メンバー専用のログインページです
            </p>
          </div>

          {/* フォーム */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="member@company.co.jp"
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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* ログイン状態を保持 */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                ログイン状態を保持
              </label>
            </div>

            {/* ログインボタン */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-xl border border-transparent bg-linear-to-r from-blue-600 to-green-600 py-3 px-4 text-sm font-bold text-white hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
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
                className="text-gray-600 hover:text-gray-900 transition"
              >
                ← トップページに戻る
              </Link>
              <Link
                href="/member/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500 transition"
              >
                パスワードを忘れた場合
              </Link>
            </div>
          </form>

          {/* フッター情報 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              工務店メンバー専用ページです。一般ユーザーの方は
              <Link href="/login" className="text-blue-600 hover:text-blue-500">
                こちら
              </Link>
              からログインしてください。
            </p>
            <p className="text-center text-xs text-gray-500 mt-2">
              アカウント登録は管理者にお問い合わせください。
            </p>
          </div>
        </div>

        {/* お知らせカード */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            工務店メンバーの方へ
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>施工事例の投稿・編集が可能です</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>お問い合わせの確認・返信ができます</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>自社情報の更新が行えます</span>
            </li>
          </ul>
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
