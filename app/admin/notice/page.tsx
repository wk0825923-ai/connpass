'use client';

import { useState } from 'react';
import { MOCK_NOTICES, MOCK_TENANTS } from '@/lib/mock-data';
import type { Notice } from '@/lib/types';
import Icon from '@/components/Icon';

const TARGET_OPTS = [
  { value: 'all',      label: '全ユーザー' },
  { value: 'pro_team', label: 'Pro / Team ユーザー' },
  { value: 'active',   label: 'アクティブユーザーのみ' },
];

export default function AdminNoticePage() {
  const [history, setHistory] = useState<Notice[]>(MOCK_NOTICES.map(n => ({ ...n })));
  const [title, setTitle]     = useState('');
  const [body, setBody]       = useState('');
  const [target, setTarget]   = useState('all');
  const [sending, setSending] = useState(false);
  const [toast, setToast]     = useState<string | null>(null);

  const LIMIT = 500;
  const reach = {
    all:      MOCK_TENANTS.length,
    pro_team: MOCK_TENANTS.filter(u => u.plan === 'Pro' || u.plan === 'Team').length,
    active:   MOCK_TENANTS.filter(u => u.status === 'active').length,
  }[target] ?? 0;

  const handleSend = () => {
    if (!title.trim() || !body.trim()) {
      setToast('件名と本文を入力してください');
      setTimeout(() => setToast(null), 2500);
      return;
    }
    setSending(true);
    setTimeout(() => {
      const n: Notice = {
        id: Date.now(), title, target: TARGET_OPTS.find(o => o.value === target)?.label ?? target,
        sentAt: '2026-06-30（送信済み）', status: 'sent', reach,
      };
      setHistory(prev => [n, ...prev]);
      setTitle(''); setBody(''); setSending(false);
      setToast(`お知らせを配信しました（${reach}名）`);
      setTimeout(() => setToast(null), 3000);
    }, 1800);
  };

  return (
    <div className="page">
      {toast && (
        <div className="toast" style={{ background: '#0A6B52', color: '#fff' }}>
          <Icon name="circle-check" style={{ fontSize: 16 }} />{toast}
        </div>
      )}

      <div className="eyebrow">運営設定</div>
      <h1 className="page-title">お知らせ配信</h1>
      <p className="page-sub">全ユーザーまたは特定プランのユーザーへお知らせを配信します。</p>

      <div style={{ display: 'flex', gap: 16, flex: 1, flexWrap: 'wrap', minHeight: 0 }}>
        {/* compose */}
        <div className="card" style={{ flex: '1 1 320px' }}>
          <div className="section-title">新規お知らせ作成</div>
          <div style={{ marginBottom: 14 }}>
            <label className="form-label">配信対象</label>
            <select className="form-input" style={{ cursor: 'pointer' }} value={target} onChange={e => setTarget(e.target.value)}>
              <option value="all">全ユーザー（{MOCK_TENANTS.length}名）</option>
              <option value="pro_team">Pro / Team ユーザー（{MOCK_TENANTS.filter(u => u.plan !== 'Free').length}名）</option>
              <option value="active">アクティブユーザーのみ（{MOCK_TENANTS.filter(u => u.status === 'active').length}名）</option>
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="form-label">件名</label>
            <input className="form-input" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="例：メンテナンスのご案内" />
          </div>
          <div style={{ marginBottom: 6 }}>
            <label className="form-label">本文</label>
            <textarea className="form-textarea" value={body} rows={8} onChange={e => setBody(e.target.value)} placeholder="お知らせの内容を入力してください。" />
          </div>
          <div className={`char-count${body.length > LIMIT ? ' over' : ''}`} style={{ marginBottom: 14 }}>
            {body.length} / {LIMIT} 文字
          </div>
          <div style={{ background: '#F8FAF8', border: '1px solid #DDE8DE', borderRadius: 6, padding: '10px 12px', marginBottom: 16, fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="info-circle" style={{ fontSize: 14, color: '#94A3B8' }} />
            配信後の取り消しはできません。内容をよく確認してから送信してください。
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={handleSend} disabled={sending || !title.trim() || !body.trim()}>
              {sending ? <span className="spinner" /> : <Icon name="send" style={{ fontSize: 16 }} />}
              {sending ? '配信中…' : `配信する（${reach}名）`}
            </button>
            <button className="btn btn-ghost" onClick={() => { setTitle(''); setBody(''); }}>
              <Icon name="trash" style={{ fontSize: 15 }} />クリア
            </button>
          </div>
        </div>

        {/* history */}
        <div style={{ flex: '2 1 340px', display: 'flex', flexDirection: 'column' }}>
          <div className="section-title">配信履歴（{history.length}件）</div>
          <div className="card" style={{ padding: 0, overflow: 'hidden', flex: 1 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>件名</th><th>配信対象</th><th>到達数</th><th>配信日時</th><th>ステータス</th>
                </tr>
              </thead>
              <tbody>
                {history.map(n => (
                  <tr key={n.id}>
                    <td><div style={{ fontSize: 13, fontWeight: 700, color: '#111827', lineHeight: 1.4 }}>{n.title}</div></td>
                    <td><span style={{ fontSize: 12 }}>{n.target}</span></td>
                    <td><div style={{ fontSize: 12, fontWeight: 700, color: '#0A6B52' }}>{n.reach}名</div></td>
                    <td><span style={{ fontSize: 12, color: '#64748B' }}>{n.sentAt}</span></td>
                    <td><span className="badge badge-green">配信済み</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
