# メール送信機能セットアップガイド

## 📧 概要

一般問い合わせへの返信機能では、管理者が返信した内容を問い合わせ者のメールアドレスに自動送信します。

## 🚀 現在の状態

### 開発環境（現在）

- ✅ メール送信機能は実装済み
- ✅ コンソールログにメール内容が出力される
- ✅ 実際のメール送信は行わない（安全）
- ✅ APIは正常に動作する

### 本番環境対応（Resend統合後）

- 📧 実際にメールが送信される
- 🔒 セキュアなAPI経由で送信
- 📊 送信ログの確認が可能

---

## 📝 開発環境での動作確認

### 1. 管理者ページで返信を送信

1. `http://localhost:3000/admin/login` で管理者ログイン
2. サイドバーから「サイト問い合わせ」を選択
3. 任意の問い合わせをクリック
4. 返信フォームにメッセージを入力して送信

### 2. コンソールログを確認

ターミナルに以下のような出力が表示されます：

```
📧 [EMAIL - Development Mode]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: customer@example.com
Subject: 【House Match】お問い合わせへの回答
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HTML Content:
<!DOCTYPE html>
<html lang="ja">
...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Email logged to console (not actually sent)

✅ Reply email sent to customer@example.com
```

このログで、以下を確認できます：

- 送信先メールアドレス
- メールの件名
- HTML形式のメール本文
- テキスト形式のメール本文

---

## 🔧 Resendへの切り替え手順（本番対応）

### ステップ1: Resendアカウント作成

1. https://resend.com にアクセス
2. 「Sign Up」をクリック
3. GitHubアカウントでサインアップ（推奨）
4. メールアドレスを確認

### ステップ2: APIキーを取得

1. Resendダッシュボードにログイン
2. 「API Keys」セクションに移動
3. 「Create API Key」をクリック
4. 名前を入力（例：`house-match-production`）
5. 「Full Access」を選択
6. APIキーをコピー（**一度しか表示されません！**）

### ステップ3: ドメイン設定（オプション）

#### テスト用（すぐに試したい場合）

- デフォルトの `onboarding@resend.dev` が使用可能
- ドメイン設定不要で即テスト可能

#### 本番用（独自ドメインを使用）

1. Resendダッシュボードで「Domains」を選択
2. 「Add Domain」をクリック
3. ドメインを入力（例：`yourdomain.com`）
4. DNSレコードを追加（Resendが表示する指示に従う）
5. 検証が完了するまで待機

### ステップ4: 環境変数を設定

`.env.local` ファイルに以下を追加：

```bash
# Resend API Key
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxx"

# 送信元メールアドレス
# テスト: onboarding@resend.dev
# 本番: noreply@yourdomain.com
EMAIL_FROM="onboarding@resend.dev"
```

### ステップ5: Resendパッケージをインストール

```bash
npm install resend
```

### ステップ6: コードのコメントを解除

`src/lib/email.ts` を開き、以下の部分のコメントを解除：

```typescript
// 変更前（コメントアウトされている）
/*
const { Resend } = await import('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const result = await resend.emails.send({
  from: process.env.EMAIL_FROM || 'noreply@example.com',
  to,
  subject,
  html,
  text,
});

console.log('✅ Email sent successfully via Resend:', result);

return {
  success: true,
  message: 'Email sent successfully',
  mode: 'production',
  result,
};
*/

// 変更後（コメント解除）
const { Resend } = await import("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const result = await resend.emails.send({
  from: process.env.EMAIL_FROM || "noreply@example.com",
  to,
  subject,
  html,
  text,
});

console.log("✅ Email sent successfully via Resend:", result);

return {
  success: true,
  message: "Email sent successfully",
  mode: "production",
  result,
};
```

### ステップ7: 開発サーバーを再起動

```bash
npm run dev
```

### ステップ8: テスト送信

1. 管理者ページで問い合わせに返信
2. 実際にメールが届くことを確認
3. Resendダッシュボードで送信ログを確認

---

## 🎨 メールテンプレートのカスタマイズ

メールのデザインや内容を変更したい場合：

### ファイル

`src/lib/email-templates.ts`

### カスタマイズ例

```typescript
// 件名を変更
const subject = '【あなたの会社名】お問い合わせへの回答';

// ロゴやカラーを変更
<div class="logo">あなたの会社名</div>

// 色を変更
border-bottom: 3px solid #your-color;
```

---

## 📊 Resendの無料プラン制限

| 項目           | 制限    |
| -------------- | ------- |
| 月間送信数     | 3,000通 |
| APIリクエスト  | 無制限  |
| ドメイン数     | 1個     |
| チームメンバー | 1人     |

十分な容量があるため、中小規模のサイトなら無料プランで問題ありません。

---

## 🐛 トラブルシューティング

### メールが届かない

1. **SPAMフォルダを確認**
   - 初回送信は迷惑メールに分類されることがあります

2. **Resend APIキーを確認**
   - `.env.local` に正しく設定されているか
   - APIキーに余分なスペースがないか

3. **送信ログを確認**
   - Resendダッシュボードで送信履歴を確認
   - エラーメッセージがあれば対応

4. **ドメイン検証を確認**
   - 独自ドメイン使用時は、DNSレコードが正しく設定されているか

### コンソールエラーが出る

```
⚠️  RESEND_API_KEY is set but Resend is not installed.
   Run: npm install resend
```

→ `npm install resend` を実行してください

---

## 🔐 セキュリティ注意事項

1. **APIキーの管理**
   - `.env.local` をGitにコミットしない
   - `.gitignore` に `.env.local` が含まれていることを確認

2. **本番環境での設定**
   - Vercel/Netlifyなどのデプロイ先で環境変数を設定
   - ローカルの `.env.local` は使用されない

3. **送信元アドレス**
   - 検証済みドメインのみ使用可能
   - テスト以外で `onboarding@resend.dev` を使用しない

---

## 📚 関連ファイル

| ファイル                                                  | 説明                      |
| --------------------------------------------------------- | ------------------------- |
| `src/lib/email.ts`                                        | メール送信ユーティリティ  |
| `src/lib/email-templates.ts`                              | メールテンプレート        |
| `src/app/api/admin/general-inquiries/[id]/reply/route.ts` | 返信API（メール送信統合） |
| `.env.example`                                            | 環境変数の例              |

---

## ✅ チェックリスト

開発環境での確認：

- [ ] 問い合わせフォームから送信できる
- [ ] 管理者ページで問い合わせを確認できる
- [ ] 返信を送信できる
- [ ] コンソールにメール内容が表示される

Resend統合後の確認：

- [ ] Resendアカウント作成済み
- [ ] APIキー取得済み
- [ ] `.env.local` に設定済み
- [ ] `npm install resend` 実行済み
- [ ] `src/lib/email.ts` のコメント解除済み
- [ ] テストメールが届く
- [ ] HTMLメールが正しく表示される

---

## 🆘 サポート

問題が解決しない場合：

- Resendドキュメント: https://resend.com/docs
- Resendサポート: support@resend.com
- Next.js統合ガイド: https://resend.com/docs/send-with-nextjs

---

**作成日**: 2026-01-06
**バージョン**: 1.0.0
