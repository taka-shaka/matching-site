import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* ロゴとキャッチコピー */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
              <span className="text-2xl font-black text-gray-900">
                House Match（仮）
              </span>
            </div>
            <p className="text-gray-600 mb-4">理想の住まいと出会える</p>
          </div>

          {/* リンク */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">サービス</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a
                  href="#companies"
                  className="hover:text-red-600 transition-colors"
                >
                  工務店を探す
                </a>
              </li>
              <li>
                <a
                  href="#cases"
                  className="hover:text-red-600 transition-colors"
                >
                  施工事例
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-red-600 transition-colors"
                >
                  よくある質問
                </a>
              </li>
              <li>
                <Link
                  href="/member/login"
                  className="hover:text-red-600 transition-colors"
                >
                  法人の方はこちら
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">会社情報</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:text-red-600 transition-colors">
                  運営会社
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-600 transition-colors">
                  利用規約
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-600 transition-colors">
                  プライバシーポリシー
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="text-center text-gray-600 text-sm pt-8 border-t border-gray-200">
          © 2026 House Match（仮）. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
