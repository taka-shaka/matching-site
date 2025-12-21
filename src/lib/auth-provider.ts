// src/lib/auth-provider.ts
// 認証プロバイダーの抽象化層 - Supabase → Clerk移行を容易にする
// ✅ Next.js 15 + @supabase/ssr 完全対応版

"use client";

import { createSupabaseBrowserClient } from "./supabase";
import type { SupabaseClient, User, Session } from "@supabase/supabase-js";

// ========================================
// 共通型定義
// ========================================

export interface AuthUser {
  id: string;
  email: string;
  emailVerified?: boolean;
  userType?: "admin" | "member" | "customer";
  companyId?: number;
  metadata?: Record<string, unknown>;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  expiresAt?: number;
}

export interface AuthResult {
  user: AuthUser | null;
  session: AuthSession | null;
  error: Error | null;
}

export interface SignUpParams {
  email: string;
  password: string;
  userType?: "admin" | "member" | "customer";
  metadata?: Record<string, unknown>;
}

// ========================================
// 認証プロバイダーインターフェース
// ========================================

export interface AuthProvider {
  // 認証
  signIn(email: string, password: string): Promise<AuthResult>;
  signUp(params: SignUpParams): Promise<AuthResult>;
  signOut(): Promise<void>;

  // ユーザー情報
  getCurrentUser(): Promise<AuthUser | null>;
  getSession(): Promise<AuthSession | null>;

  // パスワード管理
  resetPassword(email: string): Promise<void>;
  updatePassword(newPassword: string): Promise<void>;

  // メール認証
  resendVerificationEmail(): Promise<void>;

  // ソーシャルログイン
  signInWithOAuth(provider: "google" | "facebook" | "github"): Promise<void>;

  // セッション管理
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
}

// ========================================
// Supabase実装
// ========================================

class SupabaseAuthProvider implements AuthProvider {
  private client: SupabaseClient;

  constructor() {
    this.client = createSupabaseBrowserClient();
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, session: null, error };
      }

      if (!data.user || !data.session) {
        return {
          user: null,
          session: null,
          error: new Error("Authentication failed"),
        };
      }

      return {
        user: this.mapUser(data.user),
        session: this.mapSession(data.session),
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as Error,
      };
    }
  }

  async signUp(params: SignUpParams): Promise<AuthResult> {
    try {
      const { data, error } = await this.client.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            user_type: params.userType || "customer",
            ...params.metadata,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { user: null, session: null, error };
      }

      if (!data.user) {
        return {
          user: null,
          session: null,
          error: new Error("Sign up failed"),
        };
      }

      return {
        user: this.mapUser(data.user),
        session: data.session ? this.mapSession(data.session) : null,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as Error,
      };
    }
  }

  async signOut(): Promise<void> {
    await this.client.auth.signOut();
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const {
        data: { user },
        error,
      } = await this.client.auth.getUser();

      if (error || !user) {
        return null;
      }

      return this.mapUser(user);
    } catch {
      return null;
    }
  }

  async getSession(): Promise<AuthSession | null> {
    try {
      const {
        data: { session },
        error,
      } = await this.client.auth.getSession();

      if (error || !session) {
        return null;
      }

      return this.mapSession(session);
    } catch {
      return null;
    }
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw error;
    }
  }

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await this.client.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }
  }

  async resendVerificationEmail(): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error("No authenticated user");
    }

    const { error } = await this.client.auth.resend({
      type: "signup",
      email: user.email,
    });

    if (error) {
      throw error;
    }
  }

  async signInWithOAuth(
    provider: "google" | "facebook" | "github"
  ): Promise<void> {
    const { error } = await this.client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    const {
      data: { subscription },
    } = this.client.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        callback(this.mapUser(session.user));
      } else {
        callback(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }

  // ========================================
  // ヘルパー関数
  // ========================================

  private mapUser(supabaseUser: User): AuthUser {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      emailVerified: !!supabaseUser.email_confirmed_at,
      userType: supabaseUser.app_metadata?.user_type || "customer",
      companyId: supabaseUser.app_metadata?.company_id,
      metadata: supabaseUser.user_metadata,
    };
  }

  private mapSession(supabaseSession: Session): AuthSession {
    return {
      user: this.mapUser(supabaseSession.user),
      accessToken: supabaseSession.access_token,
      expiresAt: supabaseSession.expires_at,
    };
  }
}

// ========================================
// Clerk実装（将来用 - スケルトン）
// ========================================

class ClerkAuthProvider implements AuthProvider {
  async signIn(_email: string, _password: string): Promise<AuthResult> {
    // TODO: Clerk実装
    // import { useSignIn } from '@clerk/nextjs'
    throw new Error(
      "Clerk provider not implemented yet. Please set NEXT_PUBLIC_AUTH_PROVIDER=supabase"
    );
  }

  async signUp(_params: SignUpParams): Promise<AuthResult> {
    throw new Error("Clerk provider not implemented yet");
  }

  async signOut(): Promise<void> {
    throw new Error("Clerk provider not implemented yet");
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    throw new Error("Clerk provider not implemented yet");
  }

  async getSession(): Promise<AuthSession | null> {
    throw new Error("Clerk provider not implemented yet");
  }

  async resetPassword(_email: string): Promise<void> {
    throw new Error("Clerk provider not implemented yet");
  }

  async updatePassword(_newPassword: string): Promise<void> {
    throw new Error("Clerk provider not implemented yet");
  }

  async resendVerificationEmail(): Promise<void> {
    throw new Error("Clerk provider not implemented yet");
  }

  async signInWithOAuth(
    _provider: "google" | "facebook" | "github"
  ): Promise<void> {
    throw new Error("Clerk provider not implemented yet");
  }

  onAuthStateChange(_callback: (user: AuthUser | null) => void): () => void {
    throw new Error("Clerk provider not implemented yet");
  }
}

// ========================================
// プロバイダーのファクトリー関数
// ========================================

let authProviderInstance: AuthProvider | null = null;

export function getAuthProvider(): AuthProvider {
  if (!authProviderInstance) {
    // 環境変数でプロバイダーを切り替え
    // デフォルトは Supabase
    const providerType = process.env.NEXT_PUBLIC_AUTH_PROVIDER || "supabase";

    switch (providerType) {
      case "clerk":
        authProviderInstance = new ClerkAuthProvider();
        break;
      case "supabase":
      default:
        authProviderInstance = new SupabaseAuthProvider();
        break;
    }
  }

  return authProviderInstance;
}

// ========================================
// 便利な export（クライアントコンポーネント用）
// ========================================

export const auth = getAuthProvider();

// ========================================
// React Hooks（オプション）
// ========================================

import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 初回ユーザー取得
    auth.getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
    });

    // 認証状態の変更を監視
    const unsubscribe = auth.onAuthStateChange(setUser);

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    signIn: auth.signIn.bind(auth),
    signUp: auth.signUp.bind(auth),
    signOut: auth.signOut.bind(auth),
    resetPassword: auth.resetPassword.bind(auth),
  };
}

// ========================================
// 使用例
// ========================================

/*
// クライアントコンポーネントでの使用

'use client'

import { useAuth } from '@/lib/auth-provider'

export default function LoginPage() {
  const { user, loading, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = await signIn(email, password)
    
    if (result.error) {
      setError(result.error.message)
    } else {
      // ログイン成功
      router.push('/dashboard')
    }
  }
  
  if (loading) return <div>Loading...</div>
  if (user) return <div>Already logged in</div>
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
    </form>
  )
}
*/
