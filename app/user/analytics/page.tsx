'use client';

import Icon from '@/components/Icon';

// === モックのエンゲージメントデータ（本番: post_logs.engagement を集計）===
interface PostPerf {
  event: string;
  trigger: string;
  impressions: number;
  likes: number;
  reposts: number;
  replies: number;
  clicks: number;
}

const MOCK_PERF: PostPerf[] = [
  { event: 'TypeScript勉強会 Vol.12',   trigger: '公開告知', impressions: 4820, likes: 142, reposts: 38, replies: 12, clicks: 210 },
  { event: 'React入門もくもく会',        trigger: '前日',     impressions: 3110, likes: 98,  reposts: 21, replies: 7,  clicks: 156 },
  { event: 'Go言語LT大会',               trigger: '公開告知', impressions: 6740, likes: 231, reposts: 64, replies: 19, clicks: 388 },
  { event: '夏休みプログラミング教室',   trigger: '3日前',    impressions: 1980, likes: 54,  reposts: 9,  replies: 4,  clicks: 72 },
  { event: 'AI駆動開発ナイト',           trigger: '公開告知', impressions: 5210, likes: 188, reposts: 47, replies: 23, clicks: 301 },
  { event: 'インフラ勉強会 #7',          trigger: '前日',     impressions: 2450, likes: 71,  reposts: 15, replies: 6,  clicks: 118 },
];

const engRate = (p: PostPerf) =>
  ((p.likes + p.reposts + p.replies) / p.impressions) * 100;

export default function AnalyticsPage() {
  const totalImp    = MOCK_PERF.reduce((s, p) => s + p.impressions, 0);
  const totalEng    = MOCK_PERF.reduce((s, p) => s + p.likes + p.reposts + p.replies, 0);
  const totalClicks = MOCK_PERF.reduce((s, p) => s + p.clicks, 0);
  const avgRate     = (totalEng / totalImp) * 100;

  const maxImp = Math.max(...MOCK_PERF.map(p => p.impressions));
  const ranked = [...MOCK_PERF].sort((a, b) => engRate(b) - engRate(a));

  return (
    <div className="page">
      <div className="eyebrow">拡張機能</div>
      <h1 className="page-title">アナリティクス</h1>
      <p className="page-sub">どの告知がSNSで反応が良かったかを可視化します（直近30日）。</p>

      {/* KPI */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card blue">
          <div className="eyebrow" style={{ margin: 0 }}>総インプレッション</div>
          <div className="stat-n">{totalImp.toLocaleString()}</div>
          <div className="stat-l">回表示</div>
        </div>
        <div className="stat-card green">
          <div className="eyebrow" style={{ margin: 0 }}>総エンゲージ</div>
          <div className="stat-n">{totalEng.toLocaleString()}</div>
          <div className="stat-l">いいね+RP+返信</div>
        </div>
        <div className="stat-card amber">
          <div className="eyebrow" style={{ margin: 0 }}>平均エンゲージ率</div>
          <div className="stat-n">{avgRate.toFixed(1)}<span style={{ fontSize: 16 }}>%</span></div>
          <div className="stat-l">業界平均 ~2%</div>
        </div>
        <div className="stat-card green">
          <div className="eyebrow" style={{ margin: 0 }}>リンククリック</div>
          <div className="stat-n">{totalClicks.toLocaleString()}</div>
          <div className="stat-l">申込導線</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', flex: 1, minHeight: 0 }}>
        {/* インプレッション棒グラフ */}
        <div className="card" style={{ flex: '1 1 300px' }}>
          <div className="section-title">イベント別インプレッション</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
            {MOCK_PERF.map(p => (
              <div key={p.event}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: '#374151', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{p.event}</span>
                  <span style={{ color: '#64748B' }}>{p.impressions.toLocaleString()}</span>
                </div>
                <div style={{ height: 8, background: '#EDF2ED', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${p.impressions / maxImp * 100}%`, height: '100%', background: '#0A6B52', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* パフォーマンスランキング */}
        <div className="card" style={{ flex: '1.4 1 340px', padding: 0, overflow: 'hidden' }}>
          <div className="section-title" style={{ padding: '16px 16px 8px' }}>エンゲージ率ランキング</div>
          <table className="table">
            <thead>
              <tr><th>イベント</th><th>いいね</th><th>RP</th><th>クリック</th><th>エンゲージ率</th></tr>
            </thead>
            <tbody>
              {ranked.map((p, i) => (
                <tr key={p.event}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {i === 0 && <Icon name="trophy" style={{ fontSize: 14, color: '#D97706' }} />}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 12, color: '#111827' }}>{p.event}</div>
                        <div style={{ fontSize: 10, color: '#94A3B8' }}>{p.trigger}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.likes}</td>
                  <td style={{ fontWeight: 600 }}>{p.reposts}</td>
                  <td style={{ fontWeight: 600 }}>{p.clicks}</td>
                  <td>
                    <span className={`badge ${engRate(p) >= 3 ? 'badge-green' : 'badge-blue'}`}>
                      {engRate(p).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="info-banner" style={{ marginTop: 16 }}>
        <Icon name="info-circle" style={{ fontSize: 16 }} />
        プレビュー（モックデータ）。本番では投稿1時間後・24時間後・7日後にX APIからエンゲージメントを自動収集します。
      </div>
    </div>
  );
}
