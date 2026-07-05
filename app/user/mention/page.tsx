'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';

interface Speaker {
  id: number;
  name: string;
  role: string;
  handle: string;   // Xハンドル
  include: boolean;
}

const INITIAL_SPEAKERS: Speaker[] = [
  { id: 1, name: '山田 健太', role: '登壇者',   handle: '@yamada_dev',   include: true },
  { id: 2, name: '中村 さくら', role: '登壇者',   handle: '@sakura_ts',    include: true },
  { id: 3, name: '会場スポンサー: TECH HALL', role: '協賛', handle: '@techhall_jp', include: true },
  { id: 4, name: '運営: koya株式会社', role: '主催',   handle: '@koya_inc',    include: false },
];

export default function MentionPage() {
  const [autoMention, setAutoMention] = useState(true);
  const [speakers, setSpeakers] = useState<Speaker[]>(INITIAL_SPEAKERS);
  const [toast, setToast] = useState<string | null>(null);

  const toggle = (id: number) =>
    setSpeakers(prev => prev.map(s => s.id === id ? { ...s, include: !s.include } : s));

  const mentions = speakers.filter(s => s.include).map(s => s.handle);
  const preview =
    `📢 TypeScript勉強会 Vol.12 開催！\n\n登壇: ${mentions.slice(0, 2).join(' ')}\n` +
    `会場提供 ${mentions[2] ?? ''}\n\n詳細はプロフィールから👇` +
    (autoMention ? `\n\ncc ${mentions.join(' ')}` : '');

  const save = () => { setToast('メンション設定を保存しました'); setTimeout(() => setToast(null), 2200); };

  return (
    <div className="page">
      {toast && (
        <div className="toast" style={{ background: '#0A6B52', color: '#fff' }}>
          <Icon name="circle-check" style={{ fontSize: 16 }} />{toast}
        </div>
      )}

      <div className="eyebrow">将来機能（AI）</div>
      <h1 className="page-title">メンション自動化</h1>
      <p className="page-sub">告知文に登壇者・協賛・関係者のアカウントを自動でメンションし、拡散を促します。</p>

      <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon name="at" style={{ fontSize: 22, color: autoMention ? '#0A6B52' : '#94A3B8' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1F2937' }}>自動メンションを有効にする</div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>投稿の末尾に、選択したアカウントを自動で付与します</div>
        </div>
        <button onClick={() => setAutoMention(v => !v)} aria-label="切替"
          style={{ width: 44, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer', background: autoMention ? '#0A6B52' : '#CBD5E1', position: 'relative', flexShrink: 0 }}>
          <span style={{ position: 'absolute', top: 3, left: autoMention ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .15s', boxShadow: '0 1px 2px rgba(0,0,0,.2)' }} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {/* 検出アカウント */}
        <div className="card" style={{ flex: '1 1 300px' }}>
          <div className="section-title">検出された関係者（AIがイベント情報から抽出）</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {speakers.map(s => (
              <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid #E2E8E2', borderRadius: 8, cursor: 'pointer', background: s.include ? '#F6FAF6' : '#fff' }}>
                <input type="checkbox" checked={s.include} onChange={() => toggle(s.id)} style={{ accentColor: '#0A6B52', width: 16, height: 16 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: '#0A6B52' }}>{s.handle}</div>
                </div>
                <span className="badge badge-gray">{s.role}</span>
              </label>
            ))}
          </div>
        </div>

        {/* プレビュー */}
        <div className="card" style={{ flex: '1 1 260px' }}>
          <div className="section-title">投稿プレビュー</div>
          <div className="card" style={{ fontSize: 13, whiteSpace: 'pre-wrap', lineHeight: 1.8, background: '#F8FAF8' }}>
            {preview}
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 8 }}>付与メンション数: {mentions.length}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
        <button className="btn btn-primary" onClick={save}><Icon name="device-floppy" style={{ fontSize: 16 }} />設定を保存</button>
      </div>

      <div className="info-banner" style={{ marginTop: 16 }}>
        <Icon name="info-circle" style={{ fontSize: 16 }} />
        プレビュー（モック）。本番ではAIがイベント説明文から登壇者・協賛を抽出し、Xハンドルを候補提示します。
      </div>
    </div>
  );
}
