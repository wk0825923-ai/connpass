'use client';

import Icon from '@/components/Icon';

// === モック: 主催者の技術タグ傾向から生成したレコメンド ===
const TAG_PROFILE = [
  { tag: 'TypeScript', strength: 92 },
  { tag: 'React',      strength: 78 },
  { tag: 'Node.js',    strength: 61 },
  { tag: 'AI/LLM',     strength: 44 },
];

interface Reco {
  title: string;
  reason: string;
  trend: 'rising' | 'stable';
  match: number;   // マッチ度 %
}

const RECOS: Reco[] = [
  { title: 'AI駆動開発（LLMエージェント）ナイト', reason: 'AI/LLM タグが直近3ヶ月で上昇。参加者の関心も高い', trend: 'rising', match: 88 },
  { title: '型安全フルスタック もくもく会',         reason: 'TypeScript × Node.js の主催実績を活かせる',        trend: 'stable', match: 84 },
  { title: 'React Server Components 勉強会',        reason: 'React コミュニティで検索急増中のテーマ',            trend: 'rising', match: 79 },
  { title: 'テスト自動化 LT大会',                   reason: '既存参加者に未提供の隣接ドメイン。多様性向上に寄与', trend: 'stable', match: 66 },
];

export default function RecommendPage() {
  const maxStrength = Math.max(...TAG_PROFILE.map(t => t.strength));

  return (
    <div className="page">
      <div className="eyebrow">将来機能（AI）</div>
      <h1 className="page-title">学習レコメンド</h1>
      <p className="page-sub">あなたの主催実績とコミュニティのトレンドから、次に開催すると伸びそうなイベントテーマを提案します。</p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', flex: 1, minHeight: 0 }}>
        {/* 技術プロフィール */}
        <div className="card" style={{ flex: '1 1 240px' }}>
          <div className="section-title">あなたの技術プロフィール</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
            {TAG_PROFILE.map(t => (
              <div key={t.tag}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: '#1F2937' }}>{t.tag}</span>
                  <span style={{ color: '#64748B' }}>{t.strength}</span>
                </div>
                <div style={{ height: 8, background: '#EDF2ED', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${t.strength / maxStrength * 100}%`, height: '100%', background: '#0A6B52', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 12, lineHeight: 1.6 }}>
            主催・登壇イベントの技術タグから算出。多様性を広げると信頼スコアが向上します。
          </div>
        </div>

        {/* レコメンド */}
        <div className="card" style={{ flex: '1.6 1 340px' }}>
          <div className="section-title">おすすめイベントテーマ</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {RECOS.map(r => (
              <div key={r.title} style={{ border: '1px solid #E2E8E2', borderRadius: 10, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name="bulb" style={{ fontSize: 18, color: '#D97706' }} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{r.title}</span>
                    {r.trend === 'rising' && (
                      <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <Icon name="trending-up" style={{ fontSize: 12 }} />上昇中
                      </span>
                    )}
                  </div>
                  <span className="badge badge-blue" style={{ flexShrink: 0 }}>マッチ {r.match}%</span>
                </div>
                <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>{r.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="info-banner" style={{ marginTop: 16 }}>
        <Icon name="info-circle" style={{ fontSize: 16 }} />
        プレビュー（モック）。本番では蓄積したイベントデータとコミュニティグラフからAIが提案します。
      </div>
    </div>
  );
}
