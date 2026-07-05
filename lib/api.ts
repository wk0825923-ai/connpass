/**
 * データ取得レイヤー（クライアントから呼ぶ）
 * イベント取得・投稿は API ルート経由。環境変数（鍵）があれば実データ、
 * なければルート側が自動でモックにフォールバックする。
 * 運営者向けの一覧系は当面モック（Supabase接続後に差し替え）。
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

/** connpass URL/ID からイベント情報を取得（/api/connpass 経由） */
export async function fetchConnpassEvent(url: string): Promise<ConnpassEvent> {
  try {
    const res = await fetch(`/api/connpass?url=${encodeURIComponent(url)}`);
    if (res.ok) {
      const { event } = await res.json();
      if (event) return event as ConnpassEvent;
    }
  } catch {
    /* ネットワーク不通時はモックへ */
  }
  return MOCK_EVENT;
}

/** イベントの初期投稿スケジュールを生成 */
export async function getInitialPosts(ev: ConnpassEvent) {
  return buildInitialPosts(ev);
}

/** 投稿を実行（/api/post 経由。X の鍵が無ければ mock 成功） */
export async function executePost(text: string): Promise<{ ok: boolean; source: string; error?: string }> {
  try {
    const res = await fetch('/api/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return await res.json();
  } catch (e) {
    return { ok: false, source: 'mock', error: e instanceof Error ? e.message : String(e) };
  }
}

/** お知らせ配信（本番: Supabase Edge Function を呼ぶ） */
export async function sendNotice(_title: string, _body: string, _target: string): Promise<void> {
  await new Promise(r => setTimeout(r, 1800)); // simulate sending
}
