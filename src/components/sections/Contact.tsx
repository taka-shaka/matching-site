"use client";

import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/general-inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "送信に失敗しました");
      }

      setSuccessMessage(
        "お問い合わせありがとうございます。担当者より折り返しご連絡いたします。"
      );
      setFormData({ name: "", email: "", phone: "", message: "" });

      // 3秒後にメッセージを消す
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "送信に失敗しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="contact"
      className="py-20 sm:py-32 bg-linear-to-b from-white to-orange-50 relative overflow-hidden"
    >
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-red-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* セクションタイトル */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-linear-to-r from-red-500 to-orange-500 rounded-full"></div>
              <span className="text-sm font-bold text-red-600 tracking-widest uppercase">
                Contact
              </span>
              <div className="h-1 w-8 bg-linear-to-r from-orange-500 to-red-500 rounded-full"></div>
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-orange-600">
              お問い合わせ
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            家づくりに関するご質問、ご相談はお気軽にどうぞ
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* お問い合わせフォーム */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              メッセージを送る
            </h3>

            {/* 成功メッセージ */}
            {successMessage && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-green-800">
                  {successMessage}
                </p>
              </div>
            )}

            {/* エラーメッセージ */}
            {errorMessage && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <p className="text-sm font-medium text-red-800">
                  {errorMessage}
                </p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* お名前 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="山田太郎"
                  required
                />
              </div>

              {/* メールアドレス */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="example@email.com"
                  required
                />
              </div>

              {/* 電話番号 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  電話番号
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="090-1234-5678"
                />
              </div>

              {/* メッセージ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メッセージ <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                  placeholder="お問い合わせ内容をご記入ください"
                  required
                />
              </div>

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-linear-to-r from-red-500 to-orange-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? "送信中..." : "送信する"}
              </button>
            </form>
          </div>

          {/* 連絡先情報 */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                その他のお問い合わせ方法
              </h3>

              <div className="space-y-6">
                {/* 電話 */}
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-linear-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">
                      お電話でのお問い合わせ
                    </h4>
                    <p className="text-2xl font-bold text-red-600">
                      0120-XXX-XXX
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      受付時間：平日 10:00〜18:00
                    </p>
                  </div>
                </div>

                {/* メール */}
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-linear-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">
                      メールでのお問い合わせ
                    </h4>
                    <p className="text-lg text-red-600">info@example.com</p>
                    <p className="text-sm text-gray-600 mt-1">24時間受付</p>
                  </div>
                </div>

                {/* 住所 */}
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-linear-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">オフィス</h4>
                    <p className="text-gray-600">
                      〒460-0008
                      <br />
                      愛知県名古屋市中区栄1-1-1
                      <br />
                      サンプルビル 5F
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* よくある質問へのリンク */}
            <div className="bg-linear-to-br from-red-50 to-orange-50 rounded-3xl p-8 border-2 border-red-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                よくあるご質問
              </h3>
              <p className="text-gray-600 mb-6">
                お問い合わせの前に、よくあるご質問もご確認ください。
              </p>
              <button className="text-red-600 font-bold hover:text-red-700 transition-colors flex items-center gap-2">
                FAQを見る
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
