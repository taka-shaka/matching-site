import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    where: { isPublished: true },
    include: {
      tags: {
        include: { tag: true },
      },
      _count: {
        select: { cases: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-2xl font-bold">工務店一覧</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {companies.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">まだ登録工務店がありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companies.map((company) => (
              <Link
                key={company.id}
                href={`/companies/${company.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <div className="flex items-start gap-4">
                  {/* ロゴ */}
                  {company.logoUrl && (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* 情報 */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{company.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {company.description?.substring(0, 100)}...
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>
                        📍 {company.prefecture} {company.city}
                      </span>
                      <span>📁 {company._count.cases}件の施工事例</span>
                    </div>

                    {/* タグ */}
                    <div className="flex flex-wrap gap-2">
                      {company.tags.slice(0, 4).map((ct) => (
                        <span
                          key={ct.id}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {ct.tag.name}
                        </span>
                      ))}
                    </div>
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
