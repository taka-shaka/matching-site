import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CasesPage() {
  const cases = await prisma.constructionCase.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          prefecture: true,
          city: true,
        },
      },
      tags: {
        include: { tag: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-2xl font-bold">施工事例一覧</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {cases.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">まだ施工事例がありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((case_) => (
              <Link
                key={case_.id}
                href={`/cases/${case_.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                {/* 画像 */}
                {case_.mainImageUrl && (
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                    <img
                      src={case_.mainImageUrl}
                      alt={case_.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* コンテンツ */}
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{case_.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {case_.description.substring(0, 100)}...
                  </p>

                  {/* タグ */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {case_.tags.slice(0, 3).map((ct) => (
                      <span
                        key={ct.id}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                      >
                        {ct.tag.name}
                      </span>
                    ))}
                  </div>

                  {/* 工務店情報 */}
                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium text-gray-900">
                      {case_.company.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {case_.company.prefecture} {case_.company.city}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
