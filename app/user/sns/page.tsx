'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import { PLATFORM_LABEL, PLATFORM_READY, type Platform } from '@/lib/platforms';

interface SnsMeta { key: Platform; icon: string; bg: string; note: string }

// 初期設定(setup)で扱う X/FB/LI/Slack に加え、分散先の Threads/Bluesky/Mastodon を拡張
const SNS_LIST: SnsMeta[] = [
  { key: 'x',        icon: 'brand-x',        bg: '#111827', note: '実投稿対応（APIキーで有効化）' },
  { key: 'threads',  icon: 'brand-threads',  bg: '#000000', note: 'Threads Graph API（実装予定）' },
  { key: 'bluesky',  icon: 'brand-bluesky',  bg: '#0085FF', note: 'AT Protocol（実装予定）' },
  { key: 'mastodon', icon: 'brand-mastodon', bg: '#6364FF', note: 'Mastodon REST（実装予定）' },
  { key: 'facebook', icon: 'brand-facebook', bg: '#1877F2', note: 'Graph API（実装予定）' },
  { key: 'linkedin', icon: 'brand-linkedin', bg: '#0A66C2', note: 'Marketing API（実装予定）' },
  { key: 'slack',    icon: 'brand-slack',    bg: '#4A154B', note: 'Incoming Webhook（実装予定）' },
];

export default function SnsPage() {
  const [connected, setConnected] = useState<Set<Platform>>(new Set<Platform>(['x']));
  const [toast, setToast] = useState<string | null>(null);

  const toggle = (key: Platform) => {
    setConnected(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
    setToast(connected.has(key) ? `${PLATFORM_LABEL[key]} の連携を解除しました` : `${PLATFORM_LABEL[key]} を連携しました（デモ）`);
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="page">
      {toast && (
        <div className="toast" style={{ background: '#0A6B52', color: '#fff' }}>
          <Icon name="circle-check" style={{ fontSize: 16 }} />{toast}
        </div>
      )}

      <div className="eyebrow">拡張機能</div>
      <h1 className="page-title">複数SNS連携</h1>
      <p className="page-sub">投稿先を分散し、特定プラットフォームへの依存を避けます。連携したSNSすべてに同時投稿できます。</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {SNS_LIST.map(sns => {
          const isConnected = connected.has(sns.key);
          const ready = PLATFORM_READY[sns.key];
          return (
            <div key={sns.key} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: sns.bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={sns.icon} style={{ fontSize: 23 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{PLATFORM_LABEL[sns.key]}</span>
                  {ready
                    ? <span className="badge badge-green" style={{ fontSize: 10 }}>実装済み</span>
                    : <span className="badge badge-amber" style={{ fontSize: 10 }}>実装予定</span>}
                  {isConnected
                    ? <span className="badge badge-blue">連携中</span>
                    : <span className="badge badge-gray">未連携</span>}
                </div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{sns.note}</div>
              </div>
              {isConnected
                ? <button className="btn btn-ghost btn-sm" onClick={() => toggle(sns.key)}><Icon name="unlink" style={{ fontSize: 16 }} />解除</button>
                : <button className="btn btn-dark btn-sm" onClick={() => toggle(sns.key)}><Icon name="link" style={{ fontSize: 16 }} />連携する</button>}
            </div>
          );
        })}
      </div>

      <div className="info-banner">
        <Icon name="info-circle" style={{ fontSize: 16 }} />
        現在は X のみ実投稿ロジックが接続済み（APIキーで有効化）。他プラットフォームはキー投入まで自動でモック動作します。
      </div>
    </div>
  );
}
