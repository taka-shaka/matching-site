// src/lib/email.ts
// メール送信ユーティリティ

/**
 * メール送信インターフェース
 */
interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * メール送信関数
 *
 * 開発環境: コンソールログに出力
 * 本番環境: Resendを使用してメール送信
 *
 * Resendへの切り替え手順:
 * 1. https://resend.com でアカウント作成
 * 2. APIキーを取得
 * 3. .env.local に以下を追加:
 *    RESEND_API_KEY=your_api_key_here
 *    EMAIL_FROM=noreply@yourdomain.com
 * 4. npm install resend を実行
 * 5. 下記のコメントを解除
 */
export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const hasResendKey = !!process.env.RESEND_API_KEY;

  // 開発環境またはResendキーがない場合はコンソールログのみ
  if (isDevelopment || !hasResendKey) {
    console.log("📧 [EMAIL - Development Mode]");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("HTML Content:");
    console.log(html);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    if (text) {
      console.log("Text Content:");
      console.log(text);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }
    console.log("✅ Email logged to console (not actually sent)\n");

    return {
      success: true,
      message: "Email logged to console in development mode",
      mode: "development",
    };
  }

  // 本番環境でResend APIキーが設定されている場合
  try {
    // TODO: Resend統合時にコメント解除
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

    // 現在は本番環境でもログのみ（Resend未設定）
    console.warn("⚠️  RESEND_API_KEY is set but Resend is not installed.");
    console.warn("   Run: npm install resend");
    console.warn("   Then uncomment the Resend code in src/lib/email.ts");

    return {
      success: true,
      message: "Email logged (Resend not configured)",
      mode: "fallback",
    };
  } catch (error) {
    console.error("❌ Failed to send email:", error);

    return {
      success: false,
      message: "Failed to send email",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * メール送信が有効かどうかをチェック
 */
export function isEmailEnabled(): boolean {
  return process.env.NODE_ENV === "production" && !!process.env.RESEND_API_KEY;
}

/**
 * 送信元メールアドレスを取得
 */
export function getFromEmail(): string {
  return process.env.EMAIL_FROM || "noreply@example.com";
}
