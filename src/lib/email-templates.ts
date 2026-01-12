// src/lib/email-templates.ts
// メールテンプレート

interface InquiryReplyEmailParams {
  inquirerName: string;
  inquiryMessage: string;
  replyMessage: string;
  adminName: string;
}

/**
 * 一般問い合わせへの返信メールテンプレート
 */
export function createInquiryReplyEmail({
  inquirerName,
  inquiryMessage,
  replyMessage,
  adminName,
}: InquiryReplyEmailParams) {
  const subject = "【House Match】お問い合わせへの回答";

  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #f97316;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #f97316;
      margin-bottom: 10px;
    }
    .title {
      font-size: 20px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 20px;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #6b7280;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .inquiry-box {
      background-color: #f3f4f6;
      border-left: 4px solid #9ca3af;
      padding: 16px;
      border-radius: 6px;
      margin-bottom: 20px;
    }
    .reply-box {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      border-radius: 6px;
      margin-bottom: 20px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
    .signature {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    .button {
      display: inline-block;
      background: linear-gradient(to right, #ef4444, #f97316);
      color: #ffffff;
      text-decoration: none;
      padding: 12px 32px;
      border-radius: 24px;
      font-weight: bold;
      margin: 20px 0;
    }
    .note {
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 16px;
      border-radius: 6px;
      font-size: 14px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">House Match</div>
      <div style="color: #6b7280; font-size: 14px;">注文住宅マッチングサイト</div>
    </div>

    <div class="title">${subject}</div>

    <div class="greeting">
      ${inquirerName} 様
    </div>

    <p>
      この度は、House Matchにお問い合わせいただき、誠にありがとうございます。<br>
      お問い合わせの内容について、以下の通り回答させていただきます。
    </p>

    <div class="section">
      <div class="section-title">お問い合わせ内容</div>
      <div class="inquiry-box">
        ${inquiryMessage.replace(/\n/g, "<br>")}
      </div>
    </div>

    <div class="section">
      <div class="section-title">回答</div>
      <div class="reply-box">
        ${replyMessage.replace(/\n/g, "<br>")}
      </div>
    </div>

    <div class="note">
      <strong>📌 ご不明な点がございましたら</strong><br>
      さらにご質問がある場合は、このメールに直接ご返信いただくか、再度お問い合わせフォームよりご連絡ください。
    </div>

    <div class="signature">
      <div style="font-weight: bold; margin-bottom: 5px;">担当者: ${adminName}</div>
      <div style="color: #6b7280; font-size: 14px;">House Match 運営チーム</div>
    </div>

    <div class="footer">
      <p>
        このメールは、House Matchのお問い合わせフォームから送信されたお問い合わせへの自動返信メールです。
      </p>
      <p>
        © 2026 House Match（仮）. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
${subject}

${inquirerName} 様

この度は、House Matchにお問い合わせいただき、誠にありがとうございます。
お問い合わせの内容について、以下の通り回答させていただきます。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【お問い合わせ内容】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${inquiryMessage}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【回答】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${replyMessage}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

さらにご質問がある場合は、このメールに直接ご返信いただくか、
再度お問い合わせフォームよりご連絡ください。

担当者: ${adminName}
House Match 運営チーム

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
このメールは、House Matchのお問い合わせフォームから送信された
お問い合わせへの自動返信メールです。

© 2026 House Match（仮）. All rights reserved.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();

  return {
    subject,
    html,
    text,
  };
}

/**
 * 問い合わせ受付確認メールテンプレート（将来的に使用可能）
 */
export function createInquiryConfirmationEmail(params: {
  inquirerName: string;
  inquiryMessage: string;
}) {
  const subject = "【House Match】お問い合わせを受け付けました";

  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #ffffff; border-radius: 12px; padding: 40px;">
    <h1 style="color: #f97316; text-align: center;">House Match</h1>
    <h2>${subject}</h2>
    <p>${params.inquirerName} 様</p>
    <p>お問い合わせいただき、誠にありがとうございます。</p>
    <p>以下の内容でお問い合わせを受け付けました。担当者より2営業日以内にご返信いたします。</p>
    <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin: 20px 0;">
      ${params.inquiryMessage.replace(/\n/g, "<br>")}
    </div>
    <p style="color: #6b7280; font-size: 12px; margin-top: 40px; text-align: center;">
      © 2026 House Match（仮）. All rights reserved.
    </p>
  </div>
</body>
</html>
  `.trim();

  const text = `
${subject}

${params.inquirerName} 様

お問い合わせいただき、誠にありがとうございます。
以下の内容でお問い合わせを受け付けました。担当者より2営業日以内にご返信いたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${params.inquiryMessage}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

© 2026 House Match（仮）. All rights reserved.
  `.trim();

  return {
    subject,
    html,
    text,
  };
}
