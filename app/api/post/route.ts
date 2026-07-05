import { NextResponse } from 'next/server';
import { postToX } from '@/lib/twitter';

/**
 * POST /api/post  body: { text: string }
 * X の認証情報があれば実投稿、なければ mock 成功を返す。
 * TODO: 投稿後に Supabase post_logs へ記録（キー投入後に有効化）
 */
export async function POST(req: Request) {
  let text = '';
  try {
    const body = await req.json();
    text = typeof body?.text === 'string' ? body.text : '';
  } catch {
    return NextResponse.json({ ok: false, error: '不正なリクエストです' }, { status: 400 });
  }

  if (!text.trim()) {
    return NextResponse.json({ ok: false, error: '投稿テキストが空です' }, { status: 400 });
  }

  const result = await postToX(text);
  const status = result.ok ? 200 : 502;
  return NextResponse.json(result, { status });
}
