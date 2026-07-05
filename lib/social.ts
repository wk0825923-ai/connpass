/**
 * 複数SNS投稿のディスパッチャ（サーバー側）
 * platform ごとに投稿処理を振り分ける。X は lib/twitter で実投稿、
 * それ以外は認証情報が入るまでモック成功を返すスキャフォールド。
 * ※ 定数・型は lib/platforms.ts（Node依存なし）に分離してある。
 */
import { postToX, type PostResult } from './twitter';
import type { Platform } from './platforms';

export type { Platform };
export { PLATFORM_LABEL, PLATFORM_READY, isPlatform } from './platforms';

/** platform 宛にテキストを投稿。未実装/鍵無しは mock 成功。 */
export async function postToPlatform(platform: Platform, text: string): Promise<PostResult> {
  if (platform === 'x') return postToX(text);
  // TODO: 各プラットフォームのAPIを lib/<platform>.ts として実装し、ここで振り分け
  //   Threads Graph API / Bluesky AT Protocol / Mastodon REST / Slack Webhook 等
  return { ok: true, source: 'mock' };
}
