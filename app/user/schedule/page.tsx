'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';

interface TriggerConfig {
  id: string;
  label: string;
  icon: string;
  desc: string;
  enabled: boolean;
  time: string;   // HH:MM
}

const DEFAULT_TRIGGERS: TriggerConfig[] = [
  { id: 'announce',   label: '公開告知', icon: 'speakerphone',   desc: 'イベント公開時にすぐ投稿',       enabled: true,  time: '10:00' },
  { id: 'three_days', label: '3日前',    icon: 'calendar-minus', desc: '開催3日前に投稿',                enabled: true,  time: '09:00' },
  { id: 'day_before', label: '前日',     icon: 'calendar-event', desc: '開催前日に投稿',                 enabled: true,  time: '18:00' },
  { id: 'day_of',     label: '当日朝',   icon: 'sun',            desc: '開催当日の朝に投稿',             enabled: false, time: '08:00' },
];

export default function SchedulePage() {
  const [triggers, setTriggers] = useState<TriggerConfig[]>(DEFAULT_TRIGGERS);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const toggle = (id: string) =>
    setTriggers(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));

  const setTime = (id: string, time: string) =>
    setTriggers(prev => prev.map(t => t.id === id ? { ...t, time } : t));

  const enabledCount = triggers.filter(t => t.enabled).length;

  const handleSave = () => {
    setSaving(true);
    // 本番: Supabase の投稿スケジュール設定を保存
    setTimeout(() => {
      setSaving(false);
      setToast('スケジュール設定を保存しました');
      setTimeout(() => setToast(null), 2500);
    }, 900);
  };

  return (
    <div className="page">
      {toast && (
        <div className="toast" style={{ background: '#0A6B52', color: '#fff' }}>
          <Icon name="circle-check" style={{ fontSize: 16 }} />{toast}
        </div>
      )}

      <div className="eyebrow">拡張機能</div>
      <h1 className="page-title">スケジュール設定</h1>
      <p className="page-sub">イベントごとに、どのタイミングで自動投稿するかを設定します。現在 {enabledCount} 件の投稿トリガーが有効です。</p>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title">投稿トリガー</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {triggers.map(t => (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
              border: '1px solid #E2E8E2', borderRadius: 10,
              background: t.enabled ? '#F6FAF6' : '#FAFAFA',
              opacity: t.enabled ? 1 : 0.65, transition: 'all .12s',
            }}>
              <Icon name={t.icon} style={{ fontSize: 22, color: t.enabled ? '#0A6B52' : '#94A3B8', flexShrink: 0 }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1F2937' }}>{t.label}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{t.desc}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <Icon name="clock" style={{ fontSize: 15, color: '#94A3B8' }} />
                <input
                  className="form-input"
                  type="time"
                  value={t.time}
                  disabled={!t.enabled}
                  onChange={e => setTime(t.id, e.target.value)}
                  style={{ width: 120, padding: '6px 8px', fontSize: 13 }}
                />
              </div>

              <button
                onClick={() => toggle(t.id)}
                aria-label={t.enabled ? '無効にする' : '有効にする'}
                style={{
                  flexShrink: 0, width: 44, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer',
                  background: t.enabled ? '#0A6B52' : '#CBD5E1', position: 'relative', transition: 'background .15s',
                }}>
                <span style={{
                  position: 'absolute', top: 3, left: t.enabled ? 23 : 3, width: 18, height: 18,
                  borderRadius: '50%', background: '#fff', transition: 'left .15s', boxShadow: '0 1px 2px rgba(0,0,0,.2)',
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Icon name="info-circle" style={{ fontSize: 18, color: '#0A6B52', flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
          有効なトリガーは、connpassイベントを登録すると自動でスケジュールされます。
          投稿内容は「投稿テキスト編集」で個別に調整でき、実際の配信状況は「投稿ステータス管理」で確認できます。
          <span className="badge badge-amber" style={{ marginLeft: 8 }}>プレビュー（保存はモック）</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <span className="spinner" /> : <Icon name="device-floppy" style={{ fontSize: 16 }} />}
          {saving ? '保存中…' : '設定を保存'}
        </button>
      </div>
    </div>
  );
}
