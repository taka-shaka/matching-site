"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
  Phone,
} from "lucide-react";
import { useAuth } from "@/lib/auth-provider";
import { translateAuthError } from "@/lib/auth-errors";

// SearchParamsを使用するコンポーネントを分離
function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();

  // リダイレクト先URLを取得（デフォルトはトップページ）
  const redirectUrl = searchParams.get("redirect") || "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    lastName: "",
    firstName: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // バリデーション
    if (formData.password !== formData.confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    if (formData.password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return;
    }

    setIsLoading(true);

    try {
      // サーバーサイドのAPI経由で登録（Customer DBレコードも作成される）
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          lastName: formData.lastName,
          firstName: formData.firstName,
          phoneNumber: formData.phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // エラーレスポンスの場合
        console.error("Signup API error:", data.error);
        const translatedError = translateAuthError(
          data.error || "登録に失敗しました"
        );
        setError(translatedError);
      } else {
        // 登録成功
        setSuccess(true);

        // クライアント側でもログイン状態にする
        try {
          const signInResult = await signIn(formData.email, formData.password);

          if (signInResult.error) {
            console.error("Auto sign-in failed:", signInResult.error);
            // ログイン失敗の場合はログインページにリダイレクト
            setTimeout(() => {
              router.push(
                `/login?message=登録が完了しました。ログインしてください&redirect=${encodeURIComponent(
                  redirectUrl
                )}`
              );
            }, 3000);
            return;
          }

          // ログイン成功 - 3秒後に元のページまたはトップページにリダイレクト
          setTimeout(() => {
            router.push(redirectUrl);
            router.refresh();
          }, 3000);
        } catch (signInError) {
          console.error("Auto sign-in exception:", signInError);
          // 例外が発生した場合もログインページにリダイレクト
          setTimeout(() => {
            router.push(
              `/login?message=登録が完了しました。ログインしてください&redirect=${encodeURIComponent(
                redirectUrl
              )}`
            );
          }, 3000);
        }
      }
    } catch (err) {
      // 予期しないエラーの場合
      console.error("Signup error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "登録に失敗しました";
      setError(translateAuthError(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 max-w-md w-full text-center">
          <div className="mx-auto h-20 w-20 bg-linear-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">登録完了</h2>
          <p className="text-gray-600 mb-2">アカウントの登録が完了しました。</p>
          <p className="text-sm text-gray-500">3秒後に自動的に移動します...</p>
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
              <UserPlus className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">新規登録</h2>
            <p className="text-gray-600 text-sm">
              既にアカウントをお持ちの方は{" "}
              <Link
                href={
                  redirectUrl && redirectUrl !== "/"
                    ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
                    : "/login"
                }
                className="font-medium text-red-600 hover:text-red-500"
              >
                ログイン
              </Link>
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
              {/* 姓名 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    姓
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                      placeholder="山田"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    名
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                      placeholder="太郎"
                    />
                  </div>
                </div>
              </div>

              {/* メールアドレス */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  メールアドレス <span className="text-red-500">*</span>
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
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="example@example.com"
                  />
                </div>
              </div>

              {/* 携帯電話番号 */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  携帯電話番号 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel-national"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="090-1234-5678"
                  />
                </div>
              </div>

              {/* パスワード */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  パスワード <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="8文字以上"
                  />
                </div>
              </div>

              {/* パスワード確認 */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  パスワード（確認） <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="もう一度入力"
                  />
                </div>
              </div>
            </div>

            {/* 登録ボタン */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-xl border border-transparent bg-linear-to-r from-red-600 to-orange-600 py-3 px-4 text-sm font-bold text-white hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    登録中...
                  </span>
                ) : (
                  "登録"
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

// メインのページコンポーネント（Suspenseでラップ）
export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-orange-50 via-red-50 to-pink-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
