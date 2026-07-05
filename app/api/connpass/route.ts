import { NextResponse } from 'next/server';
import { extractEventId, fetchConnpassEventById } from '@/lib/connpass';
import { MOCK_EVENT } from '@/lib/mock-data';

/**
 * GET /api/connpass?url=<connpassのイベントURL or ID>
 * API キーが設定されていれば実データ、なければモックを返す。
 * キーはサーバー側にとどめ、クライアントへ出さない。
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get('url') ?? '';

  const eventId = extractEventId(input);
  if (!eventId) {
    return NextResponse.json(
      { error: 'connpassのイベントURL（例: https://connpass.com/event/123456/）を指定してください' },
      { status: 400 }
    );
  }

  const event = await fetchConnpassEventById(eventId);
  if (event) return NextResponse.json({ event, source: 'connpass' });

  // キー未設定 or 取得失敗 → モックにフォールバック（デモを止めない）
  return NextResponse.json({ event: MOCK_EVENT, source: 'mock' });
}
