/**
 * SNSプラットフォームの定数・型（クライアント/サーバー両用・Node依存なし）
 * 実投稿ロジック（twitter-api-v2 等）は lib/social.ts 側に置く。
 */
export type Platform =
  | 'x' | 'threads' | 'bluesky' | 'mastodon'
  | 'facebook' | 'linkedin' | 'slack';

export const PLATFORM_LABEL: Record<Platform, string> = {
  x: 'X（旧Twitter）', threads: 'Threads', bluesky: 'Bluesky', mastodon: 'Mastodon',
  facebook: 'Facebook', linkedin: 'LinkedIn', slack: 'Slack',
};

/** 実装状況（実投稿ロジックが繋がっているか） */
export const PLATFORM_READY: Record<Platform, boolean> = {
  x: true,        // lib/twitter 実装済み（鍵で有効化）
  threads: false, bluesky: false, mastodon: false,
  facebook: false, linkedin: false, slack: false,
};

export function isPlatform(v: unknown): v is Platform {
  return typeof v === 'string' && v in PLATFORM_LABEL;
}
