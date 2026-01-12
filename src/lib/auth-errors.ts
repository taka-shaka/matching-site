// src/lib/auth-errors.ts
// 認証関連のエラーメッセージを日本語に変換するユーティリティ

export function translateAuthError(errorMessage: string): string {
  if (!errorMessage) {
    return "エラーが発生しました";
  }

  const lowerMessage = errorMessage.toLowerCase();

  // メールアドレス関連のエラー
  if (lowerMessage.includes("invalid") && lowerMessage.includes("email")) {
    // .testドメインなど特殊なTLDの場合
    if (errorMessage.includes(".test")) {
      return "メールアドレスの形式が正しくありません。example.com、gmail.com などの実在するドメインを使用してください";
    }
    return "メールアドレスの形式が正しくありません。有効なメールアドレスを入力してください";
  }
  if (
    lowerMessage.includes("email address") &&
    lowerMessage.includes("invalid")
  ) {
    // .testドメインなど特殊なTLDの場合
    if (errorMessage.includes(".test")) {
      return "メールアドレスの形式が正しくありません。example.com、gmail.com などの実在するドメインを使用してください";
    }
    return "メールアドレスの形式が正しくありません。有効なメールアドレスを入力してください";
  }
  if (lowerMessage.includes("user already registered")) {
    return "このメールアドレスは既に登録されています";
  }
  if (lowerMessage.includes("already registered")) {
    return "このメールアドレスは既に登録されています";
  }
  if (lowerMessage.includes("email not confirmed")) {
    return "メールアドレスの確認が完了していません。確認メールをご確認ください";
  }

  // ログイン関連のエラー
  if (lowerMessage.includes("invalid login credentials")) {
    return "メールアドレスまたはパスワードが正しくありません";
  }
  if (lowerMessage.includes("invalid credentials")) {
    return "メールアドレスまたはパスワードが正しくありません";
  }
  if (lowerMessage.includes("user not found")) {
    return "アカウントが見つかりません";
  }

  // パスワード関連のエラー
  if (lowerMessage.includes("password should be at least")) {
    return "パスワードは8文字以上で入力してください";
  }
  if (lowerMessage.includes("weak password")) {
    return "パスワードが弱すぎます。8文字以上で英数字を組み合わせてください";
  }
  if (lowerMessage.includes("password") && lowerMessage.includes("too short")) {
    return "パスワードは8文字以上で入力してください";
  }

  // ネットワーク関連のエラー
  if (lowerMessage.includes("failed to fetch")) {
    return "ネットワークエラーが発生しました。インターネット接続を確認してください";
  }
  if (lowerMessage.includes("network")) {
    return "ネットワークエラーが発生しました。インターネット接続を確認してください";
  }

  // レート制限
  if (lowerMessage.includes("rate limit")) {
    return "リクエストが多すぎます。しばらく待ってから再度お試しください";
  }
  if (lowerMessage.includes("too many requests")) {
    return "リクエストが多すぎます。しばらく待ってから再度お試しください";
  }

  // サーバーエラー
  if (lowerMessage.includes("internal server error")) {
    return "サーバーエラーが発生しました。しばらく待ってから再度お試しください";
  }

  // 認証エラー
  if (lowerMessage.includes("unauthorized")) {
    return "認証に失敗しました。再度ログインしてください";
  }

  // デフォルトのエラーメッセージ
  return "エラーが発生しました。入力内容を確認してください";
}
