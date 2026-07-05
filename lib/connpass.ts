/**
 * connpass API v2 連携
 * https://connpass.com/about/api/
 * API キー（X-API-Key ヘッダ）が必須。キー未設定なら null を返し、
 * 呼び出し側はモックにフォールバックする。
 */
import type { ConnpassEvent } from './types';

/** connpass の URL / 数字文字列からイベントID を取り出す */
export function extractEventId(input: string): string | null {
  const trimmed = input.trim();
  if (/^\d+$/.test(trimmed)) return trimmed;
  const m = trimmed.match(/connpass\.com\/event\/(\d+)/);
  return m ? m[1] : null;
}

/** connpass API v2 のイベント1件のレスポンス形（必要な部分のみ） */
interface ConnpassApiEvent {
  id: number;
  title: string;
  catch: string | null;
  description: string | null;
  event_url: string;
  started_at: string;      // ISO8601
  ended_at: string | null;
  place: string | null;
  address: string | null;
  limit: number | null;
  accepted: number;
  waiting: number;
  hash_tag: string | null;
}

const WEEK = ['日', '月', '火', '水', '木', '金', '土'];

/** started_at(ISO) を「YYYY/MM/DD(曜)」と「HH:MM」に分解 */
function splitDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return { date: `${y}/${mo}/${da}(${WEEK[d.getDay()]})`, time: `${hh}:${mi}` };
}

/** API レスポンスを画面用の ConnpassEvent へ変換 */
function toConnpassEvent(e: ConnpassApiEvent): ConnpassEvent {
  const { date, time } = splitDateTime(e.started_at);
  const tags = e.hash_tag
    ? e.hash_tag.split(/[,\s]+/).filter(Boolean).map(t => t.replace(/^#/, ''))
    : [];
  return {
    title: e.title,
    date,
    time,
    location: e.place || e.address || 'オンライン',
    capacity: e.limit ?? 0,
    attending: e.accepted ?? 0,
    url: e.event_url,
    tags,
  };
}

/**
 * イベントID からイベント情報を取得。
 * キー未設定・取得失敗時は null（呼び出し側でモックへ）。
 */
export async function fetchConnpassEventById(eventId: string): Promise<ConnpassEvent | null> {
  const apiKey = process.env.CONNPASS_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(
    `https://connpass.com/api/v2/events/?event_id=${eventId}`,
    { headers: { 'X-API-Key': apiKey }, next: { revalidate: 300 } }
  );
  if (!res.ok) return null;

  const data = await res.json();
  const ev: ConnpassApiEvent | undefined = data?.events?.[0];
  return ev ? toConnpassEvent(ev) : null;
}

export const isConnpassConfigured = () => Boolean(process.env.CONNPASS_API_KEY);
