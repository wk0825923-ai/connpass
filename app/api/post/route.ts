import { NextResponse } from 'next/server';
import { postToPlatform, isPlatform } from '@/lib/social';

/**
 * POST /api/post  body: { text: string, platform?: Platform }
 * platform 既定は 'x'。認証情報があれば実投稿、なければ mock 成功。
 * TODO: 投稿後に Supabase post_logs へ記録（キー投入後に有効化）
 */
export async function POST(req: Request) {
  let text = '';
  let platform = 'x';
  try {
    const body = await req.json();
    text = typeof body?.text === 'string' ? body.text : '';
    if (isPlatform(body?.platform)) platform = body.platform;
  } catch {
    return NextResponse.json({ ok: false, error: '不正なリクエストです' }, { status: 400 });
  }

  if (!text.trim()) {
    return NextResponse.json({ ok: false, error: '投稿テキストが空です' }, { status: 400 });
  }

  const result = await postToPlatform(platform as Parameters<typeof postToPlatform>[0], text);
  const status = result.ok ? 200 : 502;
  return NextResponse.json({ ...result, platform }, { status });
}
