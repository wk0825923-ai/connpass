/**
 * AI告知文生成（サーバー側）
 * Anthropic 公式SDK（claude-opus-4-8）でイベント告知文を生成。
 * ANTHROPIC_API_KEY が未設定なら、テンプレートによる生成にフォールバックする。
 * ※ コスト重視なら model を 'claude-haiku-4-5' に変更可（品質は落ちる）。
 */
import Anthropic from '@anthropic-ai/sdk';
import type { ConnpassEvent } from './types';

export interface GenerateResult {
  text: string;
  source: 'ai' | 'template';
}

/** 鍵が無いときのフォールバック（既存の投稿テンプレと同系統） */
function templatePost(ev: ConnpassEvent): string {
  const tags = ev.tags.length ? ev.tags.map(t => `#${t}`).join(' ') : '#connpass #勉強会';
  return `📢 ${ev.title}

🗓 ${ev.date} ${ev.time}
📍 ${ev.location}
👥 定員${ev.capacity}名（現在${ev.attending}名参加）

ぜひご参加ください！
▶️ ${ev.url}

${tags}`;
}

export async function generatePost(ev: ConnpassEvent): Promise<GenerateResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { text: templatePost(ev), source: 'template' };

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 1024,
    system:
      'あなたはエンジニアコミュニティのSNS運用担当です。connpassイベントの告知文をX(旧Twitter)向けに作成します。' +
      '絵文字を適度に使い、日時・場所・定員・申込URLを含め、280文字以内で親しみやすく。ハッシュタグは3個まで。本文のみを返し、前置きや説明は書かないこと。',
    messages: [
      {
        role: 'user',
        content:
          `次のイベントの告知文を作ってください。\n` +
          `タイトル: ${ev.title}\n` +
          `日時: ${ev.date} ${ev.time}\n` +
          `場所: ${ev.location}\n` +
          `定員: ${ev.capacity}名（参加${ev.attending}名）\n` +
          `URL: ${ev.url}\n` +
          `タグ: ${ev.tags.join(', ') || 'なし'}`,
      },
    ],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map(b => b.text)
    .join('')
    .trim();

  return { text: text || templatePost(ev), source: text ? 'ai' : 'template' };
}
