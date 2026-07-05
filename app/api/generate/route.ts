import { NextResponse } from 'next/server';
import { generatePost } from '@/lib/generate';
import { MOCK_EVENT } from '@/lib/mock-data';
import type { ConnpassEvent } from '@/lib/types';

/**
 * POST /api/generate  body: { event?: ConnpassEvent }
 * ANTHROPIC_API_KEY があればAI生成、なければテンプレ生成を返す。
 */
export async function POST(req: Request) {
  let event: ConnpassEvent = MOCK_EVENT;
  try {
    const body = await req.json();
    if (body?.event) event = body.event as ConnpassEvent;
  } catch {
    /* body無し → MOCK_EVENT を使う */
  }

  try {
    const result = await generatePost(event);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { text: '', source: 'error', error: e instanceof Error ? e.message : String(e) },
      { status: 502 }
    );
  }
}
