/**
 * データ取得レイヤー
 * 現在はすべてモックを返す。
 * バックエンド接続時はここの実装を差し替えるだけでOK。
 * ────────────────────────────────────────────────────────────
 * 例: Supabase接続後
 *   import { supabase } from './supabase';
 *   export async function getTenants() {
 *     const { data } = await supabase.from('tenants').select('*');
 *     return data ?? [];
 *   }
 */

import {
  MOCK_TENANTS,
  MOCK_POST_LOGS,
  MOCK_SIGNUPS,
  MOCK_NOTICES,
  PLAN_CONFIGS,
  MOCK_EVENT,
  buildInitialPosts,
} from './mock-data';
import type { ConnpassEvent } from './types';

export async function getTenants()    { return MOCK_TENANTS; }
export async function getPostLogs()   { return MOCK_POST_LOGS; }
export async function getSignups()    { return MOCK_SIGNUPS; }
export async function getNotices()    { return MOCK_NOTICES; }
export async function getPlanConfigs(){ return PLAN_CONFIGS; }

/** connpass URL からイベント情報を取得（本番: connpass API v1 を呼ぶ） */
export async function fetchConnpassEvent(_url: string): Promise<ConnpassEvent> {
  await new Promise(r => setTimeout(r, 1200)); // simulate network
  return MOCK_EVENT;
}

/** イベントの初期投稿スケジュールを生成 */
export async function getInitialPosts(ev: ConnpassEvent) {
  return buildInitialPosts(ev);
}

/** 投稿を実行（本番: X API v2 / SNS API を呼ぶ） */
export async function executePost(_postId: string): Promise<void> {
  await new Promise(r => setTimeout(r, 1500)); // simulate posting
}

/** お知らせ配信（本番: Supabase Edge Function を呼ぶ） */
export async function sendNotice(_title: string, _body: string, _target: string): Promise<void> {
  await new Promise(r => setTimeout(r, 1800)); // simulate sending
}
