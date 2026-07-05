'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/Icon';

const SNS_LIST = [
  { key: 'x',        name: 'X（旧Twitter）',  icon: 'brand-x',        bg: '#111827' },
  { key: 'facebook', name: 'Facebook',         icon: 'brand-facebook', bg: '#1877F2' },
  { key: 'linkedin', name: 'LinkedIn',         icon: 'brand-linkedin', bg: '#0A66C2' },
  { key: 'slack',    name: 'Slack',            icon: 'brand-slack',    bg: '#4A154B' },
];

export default function SetupPage() {
  const router = useRouter();
  const [connected, setConnected] = useState<Set<string>>(new Set());

  const toggle = (key: string) => setConnected(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

  return (
    <div className="page">
      <div className="eyebrow">初期設定 — STEP 1</div>
      <h1 className="page-title">アカウント連携・初期設定</h1>
      <p className="page-sub">SNSアカウントを連携してください。X（旧Twitter）は必須です。</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {SNS_LIST.map(sns => {
          const isConnected = connected.has(sns.key);
          return (
            <div key={sns.key} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: sns.bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={sns.icon} style={{ fontSize: 24 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{sns.name}</span>
                  {sns.key === 'x' && <span className="badge badge-red" style={{ fontSize: 10 }}>必須</span>}
                  {isConnected
                    ? <span className="badge badge-green">連携済み</span>
                    : <span className="badge badge-gray">未連携</span>}
                </div>
              </div>
              {isConnected
                ? <button className="btn btn-ghost btn-sm" onClick={() => toggle(sns.key)}><Icon name="unlink" style={{ fontSize: 16 }} />解除</button>
                : <button className="btn btn-dark btn-sm" onClick={() => toggle(sns.key)}><Icon name={sns.icon} style={{ fontSize: 16 }} />連携する</button>}
            </div>
          );
        })}
      </div>

      <div className="info-banner" style={{ marginBottom: 24 }}>
        <Icon name="info-circle" style={{ fontSize: 16 }} />
        フロントエンドプレビュー：実際のOAuth認証はバックエンド接続後に有効になります
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" disabled={!connected.has('x')} onClick={() => router.push('/user/dashboard')}>
          次へ：ダッシュボード<Icon name="arrow-right" style={{ fontSize: 16 }} />
        </button>
      </div>
    </div>
  );
}
