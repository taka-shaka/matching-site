// データベース接続テスト用スクリプト
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Supabaseデータベースに接続中...');

    // 単純なクエリでテスト（テーブルがなくても実行可能）
    await prisma.$queryRaw`SELECT 1`;

    console.log('✅ データベース接続成功！');
    console.log('📊 接続情報:');
    console.log('   - データベース: PostgreSQL (Supabase)');
    console.log('   - 接続状態: 正常');

  } catch (error) {
    console.error('❌ データベース接続エラー:');
    console.error(error.message);

    if (error.message.includes('authentication')) {
      console.error('\n💡 認証エラーの可能性があります。');
      console.error('   DATABASE_URLとDIRECT_URLを確認してください。');
    } else if (error.message.includes('timeout')) {
      console.error('\n💡 タイムアウトエラー。');
      console.error('   ネットワーク接続を確認してください。');
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
