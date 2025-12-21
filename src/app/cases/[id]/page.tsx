import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

// ✅ Next.js 15: params は Promise型
interface PageProps {
  params: Promise<{ id: string }>;
}

// ✅ async Server Component
export default async function CaseDetailPage({ params }: PageProps) {
  // ✅ await でparamsを取得
  const { id } = await params;

  // 施工事例を取得（公開されているもののみ）
  const case_ = await prisma.constructionCase.findFirst({
    where: {
      id: parseInt(id),
      status: "PUBLISHED",
    },
    include: {
      property: true,
      company: {
        select: {
          id: true,
          name: true,
          prefecture: true,
          city: true,
        },
      },
      tags: true,
      images: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!case_) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* パンくずリスト */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ホーム
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/cases" className="text-blue-600 hover:text-blue-800">
                施工事例
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-600">{case_.title || "詳細"}</li>
          </ol>
        </nav>

        {/* メインコンテンツ */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* 画像ギャラリー */}
          {case_.images.length > 0 && (
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <img
                src={case_.images[0].imagePath}
                alt={case_.title || "施工事例"}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="px-6 py-8">
            {/* タイトル */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {case_.title || "（タイトル未設定）"}
            </h1>

            {/* タグ */}
            <div className="flex flex-wrap gap-2 mb-6">
              {case_.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag.name}
                </span>
              ))}
            </div>

            {/* 説明 */}
            {case_.description && (
              <div className="prose max-w-none mb-8">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {case_.description}
                </p>
              </div>
            )}

            {/* 物件情報 */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">物件情報</h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">所在地</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {case_.property.prefecture} {case_.property.city}
                    {case_.property.address && ` ${case_.property.address}`}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    建物種別
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {case_.property.buildingType}
                  </dd>
                </div>

                {case_.property.structure && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">構造</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {case_.property.structure}
                    </dd>
                  </div>
                )}

                {case_.property.floors && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">階数</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {case_.property.floors}
                    </dd>
                  </div>
                )}

                {case_.property.landArea && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      敷地面積
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {case_.property.landArea.toFixed(2)}㎡
                    </dd>
                  </div>
                )}

                {case_.property.buildingArea && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      延床面積
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {case_.property.buildingArea.toFixed(2)}㎡
                    </dd>
                  </div>
                )}

                {case_.budget && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">予算</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {(case_.budget / 10000).toFixed(0)}万円
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* 工務店情報 */}
            <div className="border-t border-gray-200 mt-8 pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">施工会社</h2>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {case_.company.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {case_.company.prefecture} {case_.company.city}
                  </p>
                </div>
                <Link
                  href={`/companies/${case_.company.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  会社詳細を見る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
