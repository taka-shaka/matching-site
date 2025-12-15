import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            注文住宅マッチングサイト
          </h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-16">
        {/* ヒーローセクション */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            理想の住まいを実現する
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            信頼できる工務店と出会えるマッチングサイト
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/companies"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              工務店を探す
            </Link>
            <Link
              href="/cases"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50"
            >
              施工事例を見る
            </Link>
          </div>
        </div>

        {/* ログインカード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Link
            href="/login"
            className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-bold mb-2">施主ログイン</h3>
            <p className="text-gray-600 text-sm mb-4">家づくりを検討中の方</p>
            <p className="text-xs text-gray-400">
              テスト: customer@example.com / customer123456
            </p>
          </Link>

          <Link
            href="/member/login"
            className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-xl font-bold mb-2">工務店ログイン</h3>
            <p className="text-gray-600 text-sm mb-4">工務店の担当者様</p>
            <p className="text-xs text-gray-400">
              テスト: member1@example.com / member123456
            </p>
          </Link>

          <Link
            href="/admin/login"
            className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-bold mb-2">管理者ログイン</h3>
            <p className="text-gray-600 text-sm mb-4">システム管理者</p>
            <p className="text-xs text-gray-400">
              テスト: admin@example.com / admin123456
            </p>
          </Link>
        </div>

        {/* 特徴セクション */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-8">
            プロトタイプの主な機能
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h4 className="font-bold mb-2">✅ 三者認証システム</h4>
              <p className="text-sm text-gray-600">
                管理者・工務店・施主の3種類のユーザー認証
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h4 className="font-bold mb-2">✅ 施工事例投稿</h4>
              <p className="text-sm text-gray-600">
                工務店が実績を掲載できる機能
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h4 className="font-bold mb-2">✅ 問い合わせ機能</h4>
              <p className="text-sm text-gray-600">
                施主から工務店への直接問い合わせ
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h4 className="font-bold mb-2">✅ 検索・閲覧</h4>
              <p className="text-sm text-gray-600">
                工務店と施工事例の検索・閲覧機能
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm">
            © 2024 注文住宅マッチングサイト（プロトタイプ版）
          </p>
        </div>
      </footer>
    </div>
  );
}
