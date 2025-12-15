import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

// ✅ Next.js 15: async Server Component
export default async function AdminDashboard() {
  // ✅ await で認証チェック
  const { admin } = await requireAdmin();

  // 統計情報を取得
  const [
    totalCompanies,
    totalMembers,
    totalCustomers,
    totalCases,
    recentActivity,
  ] = await Promise.all([
    prisma.company.count(),
    prisma.member.count(),
    prisma.customer.count(),
    prisma.constructionCase.count(),
    prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        admin: true,
        member: true,
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              管理者ダッシュボード
            </h1>
            <div className="text-sm text-gray-500">
              {admin.name} / {admin.role}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* 統計カード */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard title="工務店" value={totalCompanies} />
          <StatCard title="担当者" value={totalMembers} />
          <StatCard title="顧客" value={totalCustomers} />
          <StatCard title="施工事例" value={totalCases} />
        </div>

        {/* 最近のアクティビティ */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              最近のアクティビティ
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                アクティビティがありません
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.admin?.name || activity.member?.name} が実行
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(activity.createdAt).toLocaleString("ja-JP")}
                    </div>
                  </div>
                  {activity.details && (
                    <p className="mt-1 text-sm text-gray-600">
                      {JSON.stringify(activity.details)}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 統計カードコンポーネント
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
        <dd className="mt-1 text-3xl font-semibold text-gray-900">
          {value.toLocaleString()}
        </dd>
      </div>
    </div>
  );
}
