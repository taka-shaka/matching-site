# House Match（仮）

<div align="center">

**愛知・岐阜・三重の注文住宅情報サイト**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.7-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?logo=supabase)](https://supabase.com/)

[デモを見る](#) | [機能一覧](#機能一覧features) | [技術スタック](#技術stacktechnology)

</div>

---

## 📖 目次

- [概要](#概要)
- [主な機能](#主な機能)
- [アプリ機能一覧](#機能一覧features)
- [アプリ実装予定機能](#実装予定機能)
- [技術スタック](#技術stacktechnology)
- [必須環境](#必須環境requirements)
- [環境構築](#環境構築installationusageget-build-setup)
- [よく使うコマンド](#よく使うコマンドutilities)
- [テスト方法](#テスト方法running-the-tests)
- [デプロイ方法](#デプロイ方法deployment)
- [branch説明](#branch説明)
- [注意点](#注意点notes)
- [ディレクトリ説明](#ディレクトリ説明)
- [作成者](#作成者author)
- [設計](#設計)

---

## 📝 概要

House Match（仮）は、愛知・岐阜・三重の東海3県で注文住宅を建てたいユーザーと、地域の優良工務店をマッチングするプラットフォームです。

### 🎯 コンセプト

- **ユーザー目線**: 豊富な施工事例から理想の住まいを見つけられる
- **工務店支援**: 地域密着型の工務店が効果的に情報発信できる
- **透明性**: 予算や仕様が明確で、安心して相談できる

### 🖼️ アプリケーション画面

<!-- TODO: スクリーンショットやGIFを追加 -->
<!-- ![トップページ](./docs/images/top-page.png) -->
<!-- ![工務店検索](./docs/images/companies-search.gif) -->
<!-- ![施工事例詳細](./docs/images/case-detail.png) -->

> **Note**: 画像は後日追加予定

---

## ✨ 主な機能

### 👥 ユーザー向け機能

- **工務店検索**: 地域・得意分野から工務店を検索
- **施工事例閲覧**: 豊富な実例から理想の住まいを探す
- **お問い合わせ**: 気になる工務店に直接相談
- **マイページ**: 問い合わせ履歴の管理

### 🏢 工務店メンバー向け機能

- **施工事例管理**: 自社の施工実績を登録・編集
- **画像アップロード**: 複数画像の一括管理
- **問い合わせ対応**: ユーザーからの相談に返信
- **ダッシュボード**: 問い合わせ状況を一覧表示

### 🔧 管理者向け機能

- **工務店管理**: 工務店情報の登録・編集・公開設定
- **メンバー管理**: 工務店担当者アカウントの管理
- **施工事例管理**: 全工務店の施工事例を一元管理
- **タグ管理**: 施工事例・工務店の分類タグ管理
- **顧客管理**: 登録ユーザー情報の管理
- **統計情報**: アクセス状況や問い合わせ数の確認

---

## 🚀 機能一覧（Features）

### パブリック機能（未ログイン）

| 機能名       | 説明                         | 優先度 | 備考                       |
| ------------ | ---------------------------- | ------ | -------------------------- |
| トップページ | サービス概要、主要機能の紹介 | A      | ✅ 実装済み                |
| 工務店検索   | 地域・タグでフィルタリング   | A      | ✅ 実装済み                |
| 工務店詳細   | 工務店情報、施工事例一覧表示 | A      | ✅ 実装済み                |
| 施工事例検索 | 地域・タグ・予算で検索       | A      | ✅ 実装済み                |
| 施工事例詳細 | 詳細情報、画像ギャラリー表示 | A      | ✅ 実装済み                |
| お問い合わせ | 一般問い合わせフォーム       | B      | ✅ UI実装済み（API未実装） |

### 顧客機能（Customer）

| 機能名           | 説明                               | 優先度 | 備考        |
| ---------------- | ---------------------------------- | ------ | ----------- |
| 新規登録         | メールアドレスでアカウント作成     | A      | ✅ 実装済み |
| ログイン         | 認証済みユーザーのログイン         | A      | ✅ 実装済み |
| マイページ       | ダッシュボード、問い合わせ履歴     | A      | ✅ 実装済み |
| プロフィール編集 | 個人情報の更新                     | A      | ✅ 実装済み |
| 問い合わせ管理   | 送信済み問い合わせの確認・返信閲覧 | A      | ✅ 実装済み |

### 工務店メンバー機能（Member）

| 機能名         | 説明                                       | 優先度 | 備考        |
| -------------- | ------------------------------------------ | ------ | ----------- |
| ログイン       | 管理者から付与されたアカウントでログイン   | A      | ✅ 実装済み |
| ダッシュボード | 問い合わせ数、施工事例数の表示             | A      | ✅ 実装済み |
| 施工事例一覧   | 自社の施工事例リスト表示                   | A      | ✅ 実装済み |
| 施工事例登録   | 新規施工事例の作成（画像アップロード含む） | A      | ✅ 実装済み |
| 施工事例編集   | 既存施工事例の更新・画像管理               | A      | ✅ 実装済み |
| 会社情報編集   | 自社情報の更新                             | A      | ✅ 実装済み |
| 問い合わせ対応 | ユーザーからの問い合わせへの返信           | A      | ✅ 実装済み |

### 管理者機能（Admin）

| 機能名         | 説明                               | 優先度 | 備考        |
| -------------- | ---------------------------------- | ------ | ----------- |
| ログイン       | 管理者専用ログイン                 | A      | ✅ 実装済み |
| ダッシュボード | 統計情報、最近の活動表示           | A      | ✅ 実装済み |
| 工務店管理     | 工務店の登録・編集・削除・公開設定 | A      | ✅ 実装済み |
| メンバー管理   | 工務店担当者アカウントの管理       | A      | ✅ 実装済み |
| 施工事例管理   | 全工務店の施工事例管理             | A      | ✅ 実装済み |
| タグ管理       | カテゴリ・特徴タグの管理           | A      | ✅ 実装済み |
| 顧客管理       | 登録ユーザー情報の管理             | A      | ✅ 実装済み |
| 問い合わせ管理 | 全問い合わせの確認・対応状況管理   | A      | ✅ 実装済み |

---

## 🔮 実装予定機能

| 機能名           | 説明                           | 優先度 | 備考                  |
| ---------------- | ------------------------------ | ------ | --------------------- |
| AIを使った機能　 | 未定 　　　　　　　　　　　　  | A      | 将来実装予定          |
| お気に入り機能   | 気になる工務店・施工事例を保存 | B      | 将来実装予定          |
| レビュー機能     | 工務店への評価・口コミ投稿     | B      | 将来実装予定          |
| メール通知       | 問い合わせ時の自動メール送信   | C      | API実装済み（要設定） |
| 画像最適化       | 自動リサイズ・WebP変換         | C      | 将来実装予定          |
| 検索フィルタ拡張 | 価格帯・建築面積での詳細検索   | C      | 将来実装予定          |

---

## 🛠️ 技術スタック（Technology）

### フロントエンド

- **Next.js 15.5.7** - React フレームワーク（App Router）
- **React 19.1.0** - UI ライブラリ
- **TypeScript 5.x** - 型安全な開発
- **Tailwind CSS 4.x** - ユーティリティファーストCSS
- **Lucide React** - アイコンライブラリ
- **SWR 2.3.8** - データフェッチング・キャッシング

### バックエンド

- **Next.js API Routes** - サーバーサイドAPI
- **Prisma 7.1.0** - ORMツール
- **PostgreSQL** - リレーショナルデータベース
- **Supabase** - バックエンドプラットフォーム
  - 認証（Supabase Auth）
  - データベース（PostgreSQL）
  - ストレージ（画像アップロード）

### 開発ツール

- **ESLint 9.x** - コード品質チェック
- **Prettier 3.7.4** - コードフォーマッター
- **Turbopack** - 高速バンドラー（Next.js 15）

### インフラ・デプロイ

- **Vercel** - ホスティングプラットフォーム（予定）
- **Supabase Cloud** - データベース・認証基盤

---

## 📋 必須環境（Requirements）

- **Node.js**: 20.x 以上
- **npm**: 10.x 以上
- **PostgreSQL**: 14.x 以上（Supabaseを使用する場合は不要）
- **Supabase アカウント**: 認証・データベース用

---

## 🚀 環境構築（Installation/Usage/Get Build Setup）

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/matching-site.git
cd matching-site
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.example`を参考に`.env.local`を作成:

```bash
cp .env.example .env.local
```

`.env.local`に以下の環境変数を設定:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database (Supabase PostgreSQL)
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url
```

### 4. データベースのマイグレーション

```bash
npx prisma migrate dev
```

### 5. 初期データの投入（オプション）

```bash
npm run seed
```

### 6. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

---

## 🔧 よく使うコマンド（Utilities）

| コマンド                 | 説明                                |
| ------------------------ | ----------------------------------- |
| `npm run dev`            | 開発サーバーを起動（Turbopack使用） |
| `npm run build`          | 本番用ビルドを作成                  |
| `npm start`              | 本番用サーバーを起動                |
| `npm run lint`           | ESLintでコードチェック              |
| `npm run lint:fix`       | ESLintで自動修正                    |
| `npm run format`         | Prettierでコード整形                |
| `npm run seed`           | データベースに初期データを投入      |
| `npx prisma studio`      | Prisma Studioでデータベースを確認   |
| `npx prisma migrate dev` | マイグレーション実行                |

---

## 🧪 テスト方法（Running the tests）

### 動作確認手順

1. **トップページの確認**
   - [http://localhost:3000](http://localhost:3000) にアクセス
   - ヒーローセクション、機能紹介、施工事例、工務店情報が表示されることを確認

2. **工務店検索の確認**
   - ヘッダーの「工務店検索」をクリック
   - 都道府県・タグでフィルタリングできることを確認

3. **施工事例検索の確認**
   - ヘッダーの「施工事例」をクリック
   - 検索・フィルタリングが動作することを確認

4. **認証機能の確認**
   - 新規登録・ログインが正常に動作することを確認
   - 管理者ログイン: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
   - メンバーログイン: [http://localhost:3000/member/login](http://localhost:3000/member/login)
   - 顧客ログイン: [http://localhost:3000/login](http://localhost:3000/login)

### テストアカウント（seed実行後）

初期データ投入後、以下のテストアカウントが利用可能です:

```
管理者:
- メールアドレス: admin@housematch.test
- パスワード: Admin123!

工務店メンバー:
- メールアドレス: anjo@anjo-gallery.test
- パスワード: Member123!

顧客:
- メールアドレス: customer8@example.com
- パスワード: Customer123!
```

---

## 🌐 デプロイ方法（Deployment）

### Vercel へのデプロイ

1. **Vercelアカウントの作成**
   - [Vercel](https://vercel.com/) でアカウントを作成

2. **プロジェクトのインポート**
   - GitHubリポジトリを接続
   - プロジェクトをインポート

3. **環境変数の設定**
   - Vercelのプロジェクト設定で以下の環境変数を設定:
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     SUPABASE_SERVICE_ROLE_KEY
     DATABASE_URL
     DIRECT_URL
     ```

4. **デプロイ実行**
   - Vercelが自動的にビルド・デプロイを実行
   - デプロイ完了後、URLが発行されます

### 本番環境の注意点

- `.env.production` に本番用の環境変数を設定
- データベースのマイグレーションを本番環境で実行
- Supabaseの本番用プロジェクトを別途作成することを推奨

---

## 🌿 branch説明

| ブランチ名                | 説明                     | 用途                           |
| ------------------------- | ------------------------ | ------------------------------ |
| `main`                    | 本番環境用のブランチ     | プロダクション環境へのデプロイ |
| `test-deployment`         | テストデプロイ用ブランチ | デプロイ前の最終確認           |
| `feature/api-integration` | API実装用ブランチ        | バックエンドAPI開発            |
| `fe/feature/*`            | フロントエンド機能開発   | UI/UX関連の機能追加            |
| `be/feature/*`            | バックエンド機能開発     | API/データベース関連の機能追加 |

### ブランチ運用ルール

1. `main`ブランチへの直接コミットは禁止
2. 機能開発は`feature/*`ブランチで実施
3. プルリクエストを通じて`main`へマージ
4. デプロイ前は`test-deployment`ブランチで動作確認

---

## ⚠️ 注意点（Notes）

### 開発時の注意事項

- **環境変数**: `.env.local`は`.gitignore`に含まれているため、各環境で個別に設定が必要
- **データベース**: Supabaseを使用しているため、ローカルのPostgreSQLは不要
- **画像アップロード**: Supabaseストレージを使用（設定が必要）
- **認証**: Supabase Authを使用（メール認証の設定が必要）

### セキュリティ

- **APIキー**: 環境変数ファイルは絶対にGitにコミットしない
- **サービスロールキー**: サーバーサイドでのみ使用（クライアントに露出しない）
- **パスワード**: 本番環境では強固なパスワードを設定

### パフォーマンス

- **画像最適化**: Next.js Imageコンポーネントを使用して自動最適化
- **SWR**: データフェッチングにキャッシュを活用
- **Turbopack**: 開発時の高速ビルドを実現

---

## 📁 ディレクトリ説明

```
matching-site/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # 未認証ユーザー用ページ（ログイン・新規登録）
│   │   ├── admin/             # 管理者画面
│   │   ├── member/            # 工務店メンバー画面
│   │   ├── customer/          # 顧客マイページ
│   │   ├── companies/         # 工務店一覧・詳細（パブリック）
│   │   ├── cases/             # 施工事例一覧・詳細（パブリック）
│   │   ├── api/               # APIルート
│   │   │   ├── admin/         # 管理者用API
│   │   │   ├── member/        # メンバー用API
│   │   │   ├── customer/      # 顧客用API
│   │   │   ├── public/        # パブリックAPI
│   │   │   └── auth/          # 認証関連API
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # トップページ
│   │   └── globals.css        # グローバルスタイル
│   ├── components/            # Reactコンポーネント
│   │   ├── sections/          # セクションコンポーネント
│   │   ├── admin/             # 管理者用コンポーネント
│   │   ├── member/            # メンバー用コンポーネント
│   │   └── customer/          # 顧客用コンポーネント
│   └── lib/                   # ユーティリティ・ヘルパー
│       ├── prisma.ts          # Prismaクライアント
│       ├── supabase.ts        # Supabase設定
│       ├── auth-helpers.ts    # 認証ヘルパー
│       └── format.ts          # フォーマット関数
├── prisma/
│   ├── schema.prisma          # データベーススキーマ
│   ├── seed.ts                # 初期データ投入スクリプト
│   └── migrations/            # マイグレーションファイル
├── public/
│   └── images/                # 静的画像ファイル
├── .env.example               # 環境変数のテンプレート
├── .gitignore                 # Git除外設定
├── next.config.ts             # Next.js設定
├── tailwind.config.ts         # Tailwind CSS設定
├── tsconfig.json              # TypeScript設定
└── package.json               # 依存関係・スクリプト
```

---

## 👤 作成者（Author）

**Takayuki Ito**

- GitHub: [@your-username](https://github.com/your-username)
- Email: your-email@example.com
- Portfolio: [https://your-portfolio.com](https://your-portfolio.com)

---

## 📐 設計

### データベース設計

主要なテーブル:

- **Admin**: 管理者アカウント
- **Company**: 工務店情報
- **Member**: 工務店メンバーアカウント
- **Customer**: 顧客アカウント
- **ConstructionCase**: 施工事例
- **Tag**: タグマスタ
- **Inquiry**: 問い合わせ
- **GeneralInquiry**: 一般問い合わせ

詳細なER図は `prisma/schema.prisma` を参照してください。

### アーキテクチャ

- **App Router**: Next.js 15の新しいルーティングシステム
- **Server Components**: サーバーサイドレンダリングでパフォーマンス最適化
- **API Routes**: RESTful API設計
- **認証**: Supabase Authによるセキュアな認証
- **データベース**: Prisma ORMによる型安全なデータアクセス

---

## 📄 ライセンス

このプロジェクトは個人のポートフォリオとして作成されています。

---

<div align="center">

**Built with ❤️ using Next.js 15 & Supabase**

</div>
