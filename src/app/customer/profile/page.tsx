"use client";

import { useState } from "react";
import {
  Menu,
  Save,
  User,
  Mail,
  Phone,
  Lock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import CustomerSidebar from "@/components/customer/CustomerSidebar";

// モックデータ
const MOCK_CUSTOMER = {
  id: 1,
  firstName: "花子",
  lastName: "山田",
  email: "hanako.yamada@example.com",
  phoneNumber: "090-1234-5678",
};

export default function CustomerProfilePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // プロフィールフォーム
  const [lastName, setLastName] = useState(MOCK_CUSTOMER.lastName);
  const [firstName, setFirstName] = useState(MOCK_CUSTOMER.firstName);
  const [email, setEmail] = useState(MOCK_CUSTOMER.email);
  const [phoneNumber, setPhoneNumber] = useState(MOCK_CUSTOMER.phoneNumber);

  // パスワード変更フォーム
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function validateProfileForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!lastName.trim()) newErrors.lastName = "姓は必須です";
    if (!firstName.trim()) newErrors.firstName = "名は必須です";
    if (!email.trim()) newErrors.email = "メールアドレスは必須です";
    if (phoneNumber && !/^[0-9-]+$/.test(phoneNumber)) {
      newErrors.phoneNumber = "電話番号の形式が正しくありません";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validatePasswordForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!currentPassword)
      newErrors.currentPassword = "現在のパスワードは必須です";
    if (!newPassword) newErrors.newPassword = "新しいパスワードは必須です";
    if (newPassword.length < 8) {
      newErrors.newPassword = "パスワードは8文字以上で入力してください";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "パスワードが一致しません";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateProfileForm()) return;

    setIsSubmitting(true);
    setSuccessMessage("");

    // TODO: API実装時に実際の更新処理を追加
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage("プロフィールを更新しました");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setIsSubmitting(true);
    setSuccessMessage("");

    // TODO: API実装時に実際のパスワード変更処理を追加
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage("パスワードを変更しました");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50">
      {/* サイドバー */}
      <CustomerSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        customerName={`${MOCK_CUSTOMER.lastName} ${MOCK_CUSTOMER.firstName}`}
        customerEmail={MOCK_CUSTOMER.email}
      />

      {/* メインコンテンツ */}
      <div className="lg:pl-64">
        {/* トップバー */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white border-b border-gray-200">
          <button
            type="button"
            className="px-4 text-gray-500 lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex flex-1 items-center">
              <h1 className="text-2xl font-black text-gray-900">
                プロフィール編集
              </h1>
            </div>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <main className="p-4 lg:p-8">
          {/* 成功メッセージ */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-green-800">
                {successMessage}
              </p>
            </div>
          )}

          {/* プロフィール編集フォーム */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-black text-gray-900">基本情報</h2>
              </div>

              <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* 姓 */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      姓 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.lastName ? "border-red-300" : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="山田"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  {/* 名 */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.firstName ? "border-red-300" : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="花子"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* メールアドレス */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      メールアドレス <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* 電話番号 */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      電話番号
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.phoneNumber
                          ? "border-red-300"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="090-1234-5678"
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-green-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  {isSubmitting ? "保存中..." : "変更を保存"}
                </button>
              </form>
            </div>
          </div>

          {/* パスワード変更フォーム */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-black text-gray-900">
                パスワード変更
              </h2>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4 mb-6">
                {/* 現在のパスワード */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    現在のパスワード <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.currentPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="現在のパスワード"
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                {/* 新しいパスワード */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    新しいパスワード <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.newPassword ? "border-red-300" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="8文字以上"
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                {/* 新しいパスワード（確認） */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    新しいパスワード（確認）{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="確認用"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50"
              >
                <Lock className="h-5 w-5" />
                {isSubmitting ? "変更中..." : "パスワードを変更"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
