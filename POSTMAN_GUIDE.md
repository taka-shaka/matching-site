# Postman APIテストガイド

## 📋 目次

1. [Postmanコレクションのインポート](#postmanコレクションのインポート)
2. [認証トークンの取得方法](#認証トークンの取得方法)
3. [テストの実行方法](#テストの実行方法)
4. [テストデータ](#テストデータ)

---

## 1. Postmanコレクションのインポート

### VS Code拡張機能を使用する場合

1. VS Codeの拡張機能![alt text](image.png)タブから「Postman」を検索してインストール
2. サイドバーのPostmanアイコンをクリック
3. 「Import」ボタンをクリック
4. `postman_collection.json` ファイルを選択してインポート

### Postmanデスクトップアプリを使用する場合

1. Postmanアプリを開く
2. 左上の「Import」ボタンをクリック
3. `postman_collection.json` ファイルをドラッグ&ドロップ
4. 「Import」をクリック

---

## 2. 認証トークンの取得方法

### ブラウザでログインしてトークンを取得

認証が必要なAPIをテストするには、Supabaseの認証トークンが必要です。

#### 方法1: ブラウザの開発者ツールを使用

1. ブラウザで `http://localhost:3000` にアクセス
2. 開発者ツールを開く（F12キー）
3. 「Application」タブ（ChromeまたはEdge）または「ストレージ」タブ（Firefox）を開く
4. 左側メニューの「Local Storage」→「http://localhost:3000」を選択
5. 以下のテストアカウントでログイン：

**管理者アカウント:**

- Email: `admin@matching-site.jp`
- Password: `admin123456`

**工務店メンバーアカウント（ナゴヤホーム）:**

- Email: `tanaka@nagoya-home.co.jp`
- Password: `member123456`

**工務店メンバーアカウント（豊田ハウジング）:**

- Email: `yamada@toyota-housing.co.jp`
- Password: `member123456`

**顧客アカウント:**

- Email: `customer1@example.com`
- Password: `customer123456`

6. ログイン後、Local Storageに保存されている `sb-<project-id>-auth-token` キーの値を確認
7. その中の `access_token` の値をコピー

#### 方法2: curlコマンドでトークンを取得（推奨）

開発サーバーが起動している状態で、以下のコマンドを実行：

```bash
# 管理者トークン取得
curl -X POST https://jtncadrjotvtfmhqixri.supabase.co/auth/v1/token?grant_type=password \
  -H "Content-Type: application/json" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bmNhZHJqb3R2dGZtaHFpeHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODkyMTcsImV4cCI6MjA4MDg2NTIxN30.sAoohur_Mq3H1CR7Fu-DiObTh9YOJu0FylkzQZlowVU" \
  -d '{"email":"admin@matching-site.jp","password":"admin123456"}'

# メンバートークン取得（ナゴヤホーム）
curl -X POST https://jtncadrjotvtfmhqixri.supabase.co/auth/v1/token?grant_type=password \
  -H "Content-Type: application/json" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bmNhZHJqb3R2dGZtaHFpeHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODkyMTcsImV4cCI6MjA4MDg2NTIxN30.sAoohur_Mq3H1CR7Fu-DiObTh9YOJu0FylkzQZlowVU" \
  -d '{"email":"tanaka@nagoya-home.co.jp","password":"member123456"}'

# 顧客トークン取得
curl -X POST https://jtncadrjotvtfmhqixri.supabase.co/auth/v1/token?grant_type=password \
  -H "Content-Type: application/json" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bmNhZHJqb3R2dGZtaHFpeHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODkyMTcsImV4cCI6MjA4MDg2NTIxN30.sAoohur_Mq3H1CR7Fu-DiObTh9YOJu0FylkzQZlowVU" \
  -d '{"email":"customer1@example.com","password":"customer123456"}'
```

レスポンスの `access_token` フィールドの値をコピーしてください。

### Postmanに認証トークンを設定

1. Postmanコレクションを開く
2. コレクション名を右クリック → 「Edit」を選択
3. 「Variables」タブを開く
4. `access_token` 変数の「CURRENT VALUE」にコピーしたトークンを貼り付け
5. 「Save」をクリック

**注意:** トークンは1時間で期限切れになります。期限切れの場合は再度取得してください。

---

## 3. テストの実行方法

### パブリックAPI（認証不要）のテスト

1. 「1. パブリックAPI（認証不要）」フォルダを開く
2. テストしたいエンドポイントを選択
3. 「Send」ボタンをクリック
4. レスポンスを確認

### 認証が必要なAPIのテスト

1. まず認証トークンを取得・設定（上記参照）
2. テストしたいエンドポイントを選択
3. 「Send」ボタンをクリック
4. レスポンスを確認

### 全エンドポイントを一括テスト

1. コレクション名を右クリック
2. 「Run collection」を選択
3. テストしたいエンドポイントを選択
4. 「Run 注文住宅マッチングサイト API」をクリック

---

## 4. テストデータ

### データベースに登録済みのテストデータ

シードスクリプトで以下のデータが投入されています：

#### タグ（14個）

- **住宅タイプ**: 二階建て、平屋
- **価格帯**: 3000万円台、4000万円台、5000万円以上
- **構造**: 木造、鉄骨造、RC造
- **雰囲気**: ナチュラル、モダン、和風
- **こだわり**: 自然素材、高断熱・高気密

#### 工務店（3社）

1. **株式会社ナゴヤホーム** (ID: 3) - 公開中
   - 所在地: 愛知県名古屋市中区
   - メンバー: 田中一郎
   - 施工事例: 1件

2. **株式会社豊田ハウジング** (ID: 4) - 公開中
   - 所在地: 愛知県豊田市
   - メンバー: 山田太郎
   - 施工事例: 1件

3. **テスト工務店** (ID: 5) - 非公開
   - メンバー: なし
   - 施工事例: 1件（下書き）

#### 施工事例（3件）

1. **自然素材にこだわった平屋の家** (ID: 1) - 公開中
   - 工務店: ナゴヤホーム
   - 予算: 3500万円
   - タグ: 平屋、3000万円台、ナチュラル、自然素材

2. **高断熱・高気密のモダン住宅** (ID: 2) - 公開中
   - 工務店: 豊田ハウジング
   - 予算: 4200万円
   - タグ: 二階建て、4000万円台、モダン、高断熱・高気密

3. **未公開の施工事例** (ID: 3) - 下書き
   - 工務店: テスト工務店

#### 顧客（2名）

1. **山田花子** (customer1@example.com)
   - 問い合わせ: 1件

2. **佐藤太郎** (customer2@example.com)
   - 問い合わせ: 1件

#### 問い合わせ（2件）

1. 問い合わせID: 1（ナゴヤホームへ）
   - ステータス: 対応中
   - 返信: 1件

2. 問い合わせID: 2（豊田ハウジングへ）
   - ステータス: 新規
   - 返信: なし

---

## 5. APIエンドポイント一覧

### パブリックAPI（認証不要）- 4エンドポイント

- `GET /api/public/cases` - 施工事例一覧取得
- `GET /api/public/cases/:id` - 施工事例詳細取得
- `GET /api/public/companies` - 工務店一覧取得
- `GET /api/public/companies/:id` - 工務店詳細取得

### 顧客API（要認証）- 3エンドポイント

- `POST /api/customer/inquiries` - 問い合わせ送信
- `GET /api/customer/inquiries` - 問い合わせ一覧取得
- `GET /api/customer/inquiries/:id` - 問い合わせ詳細取得

### メンバーAPI（要認証）- 10エンドポイント

#### 問い合わせ管理

- `GET /api/member/inquiries` - 問い合わせ一覧取得
- `GET /api/member/inquiries/:id` - 問い合わせ詳細取得
- `PATCH /api/member/inquiries/:id` - 問い合わせステータス更新
- `POST /api/member/inquiries/:id/reply` - 問い合わせ返信送信

#### 施工事例管理

- `GET /api/member/cases` - 施工事例一覧取得
- `GET /api/member/cases/:id` - 施工事例詳細取得
- `POST /api/member/cases` - 施工事例新規作成
- `PATCH /api/member/cases/:id` - 施工事例更新
- `DELETE /api/member/cases/:id` - 施工事例削除

#### 工務店情報管理

- `GET /api/member/company` - 工務店情報取得
- `PATCH /api/member/company` - 工務店情報更新

### 管理者API（要認証）- 8エンドポイント

- `GET /api/admin/stats` - ダッシュボード統計取得
- `GET /api/admin/companies` - 工務店一覧取得
- `GET /api/admin/companies/:id` - 工務店詳細取得
- `PATCH /api/admin/companies/:id` - 工務店情報更新
- `GET /api/admin/tags` - タグ一覧取得
- `POST /api/admin/tags` - タグ新規作成
- `PATCH /api/admin/tags/:id` - タグ更新
- `DELETE /api/admin/tags/:id` - タグ削除
- `GET /api/admin/members` - メンバー一覧取得
- `GET /api/admin/customers` - 顧客一覧取得
- `GET /api/admin/cases` - 施工事例一覧取得（全工務店）

**合計: 25エンドポイント**

---

## 6. トラブルシューティング

### 401 Unauthorized エラーが出る場合

- 認証トークンが正しく設定されているか確認
- トークンの有効期限（1時間）が切れていないか確認
- 再度ログインしてトークンを取得

### 403 Forbidden エラーが出る場合

- 該当のエンドポイントへのアクセス権限があるか確認
- 例：メンバーは管理者APIにアクセスできません

### 404 Not Found エラーが出る場合

- URLが正しいか確認
- リソースID（施工事例ID、工務店IDなど）が存在するか確認

### 500 Internal Server Error が出る場合

- サーバーログを確認（VSCodeのターミナル）
- データベース接続が正常か確認
- リクエストボディのJSONフォーマットが正しいか確認

---

## 7. 便利なTips

### 環境変数の活用

- `base_url` を変更すれば、本番環境でもテスト可能
- `access_token` は各ユーザータイプ別に変数を作成すると便利

### レスポンスの検証

- Postmanの「Tests」タブでレスポンスの自動検証スクリプトを作成可能
- ステータスコードやレスポンスデータの検証を自動化できます

### コレクション実行の自動化

- Newman（Postmanのコマンドラインツール）を使用すると、CI/CDパイプラインに組み込み可能
