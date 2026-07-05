/**
 * Supabase クライアント
 * 環境変数が未設定の間は null を返し、呼び出し側はモックにフォールバックする。
 * （キー投入だけで本番接続に切り替わる設計）
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** ブラウザ/一般用途クライアント。未設定なら null */
export const supabase: SupabaseClient | null =
  url && anon ? createClient(url, anon) : null;

/** サーバー専用クライアント（Service Role）。APIルート内でのみ使用 */
export function getServiceClient(): SupabaseClient | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** 接続設定が揃っているか */
export const isSupabaseConfigured = Boolean(url && anon);
