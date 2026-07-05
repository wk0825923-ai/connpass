/**
 * X (Twitter) API v2 投稿
 * まずはオーナー1アカウント（環境変数のトークン）で投稿する最小構成。
 * 将来はユーザーごとの OAuth2 トークン（users.x_access_token）に置き換える。
 * 認証情報が未設定なら null を返し、呼び出し側はモック投稿にフォールバックする。
 */
import { TwitterApi } from 'twitter-api-v2';

function getClient(): TwitterApi | null {
  const { X_APP_KEY, X_APP_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET } = process.env;
  if (!X_APP_KEY || !X_APP_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) return null;
  return new TwitterApi({
    appKey: X_APP_KEY,
    appSecret: X_APP_SECRET,
    accessToken: X_ACCESS_TOKEN,
    accessSecret: X_ACCESS_SECRET,
  });
}

export interface PostResult {
  ok: boolean;
  source: 'x' | 'mock';
  tweetId?: string;
  error?: string;
}

/** テキストを X へ投稿。未設定なら mock 成功を返す。 */
export async function postToX(text: string): Promise<PostResult> {
  const client = getClient();
  if (!client) return { ok: true, source: 'mock' };

  try {
    const { data } = await client.v2.tweet(text);
    return { ok: true, source: 'x', tweetId: data.id };
  } catch (e) {
    return { ok: false, source: 'x', error: e instanceof Error ? e.message : String(e) };
  }
}

export const isXConfigured = () =>
  Boolean(
    process.env.X_APP_KEY &&
    process.env.X_APP_SECRET &&
    process.env.X_ACCESS_TOKEN &&
    process.env.X_ACCESS_SECRET
  );
