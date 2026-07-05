'use client';

import { useState } from 'react';
import { MOCK_POST_LOGS } from '@/lib/mock-data';
import type { PostLog } from '@/lib/types';
import Icon from '@/components/Icon';

const SNS_ICON: Record<string, string> = { x: 'brand-x', facebook: 'brand-facebook', linkedin: 'brand-linkedin', slack: 'brand-slack' };

export default function AdminPostsPage() {
  const [logs, setLogs]       = useState<PostLog[]>(MOCK_POST_LOGS.map(p => ({ ...p })));
  const [statusF, setStatusF] = useState('all');
  const [toast, setToast]     = useState<string | null>(null);

  const filtered = statusF === 'all' ? logs : logs.filter(p => p.status === statusF);

  const handleRetry = (id: number) => {
    setLogs(prev => prev.map(p => p.id === id ? { ...p, status: 'scheduled', error: null } : p));
    setToast('再試行キューに追加しました');
    setTimeout(() => setToast(null), 2500);
  };

  const scheduled = logs.filter(p => p.status === 'scheduled').length;
  const posted    = logs.filter(p => p.status === 'posted').length;
  const errors    = logs.filter(p => p.status === 'error').length;

  return (
    <div className="page">
      {toast && (
        <div className="toast" style={{ background: '#0A6B52', color: '#fff' }}>
          <Icon name="circle-check" style={{ fontSize: 16 }} />{toast}
        </div>
      )}

      <div className="eyebrow">運営者コンソール</div>
      <h1 className="page-title">投稿モニタリング</h1>
      <p className="page-sub">全ユーザーの投稿状況を横断的に監視します。</p>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card amber">
          <div className="eyebrow" style={{ margin: 0 }}>予約中</div>
          <div className="stat-n">{scheduled}</div>
          <div className="stat-l">件</div>
        </div>
        <div className="stat-card green">
          <div className="eyebrow" style={{ margin: 0 }}>投稿済み</div>
          <div className="stat-n">{posted}</div>
          <div className="stat-l">件</div>
        </div>
        <div className="stat-card red">
          <div className="eyebrow" style={{ margin: 0 }}>エラー</div>
          <div className="stat-n">{errors}</div>
          <div className="stat-l">件</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>フィルタ:</span>
        {(['all', 'scheduled', 'posted', 'error'] as const).map(s => {
          const labels = { all: 'すべて', scheduled: '予約中', posted: '投稿済み', error: 'エラー' };
          return (
            <button key={s} className={`btn btn-sm ${statusF === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setStatusF(s)}>
              {labels[s]}
            </button>
          );
        })}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', flex: 1 }}>
        <table className="table">
          <thead>
            <tr>
              <th>ユーザー</th><th>イベント</th><th>SNS</th>
              <th>タイミング</th><th>予定日時</th><th>ステータス</th><th>エラー / 操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td><div style={{ fontWeight: 700, fontSize: 12, color: '#111827' }}>{p.user}</div></td>
                <td><div style={{ fontSize: 12, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.event}</div></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon name={SNS_ICON[p.sns] || 'brand-x'} style={{ fontSize: 13, color: '#64748B' }} />
                    <span style={{ fontSize: 12 }}>{p.sns}</span>
                  </div>
                </td>
                <td><span style={{ fontSize: 12 }}>{p.trigger}</span></td>
                <td><span style={{ fontSize: 12 }}>{p.scheduledAt}</span></td>
                <td>
                  <span className={`badge badge-${p.status === 'posted' ? 'green' : p.status === 'error' ? 'red' : 'amber'}`}>
                    {p.status === 'posted' ? '投稿済み' : p.status === 'error' ? 'エラー' : '予約中'}
                  </span>
                </td>
                <td>
                  {p.error && <div style={{ fontSize: 11, color: '#C2410C', marginBottom: 4 }}>{p.error}</div>}
                  {p.status === 'error' && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleRetry(p.id)}>
                      <Icon name="refresh" style={{ fontSize: 13 }} />再試行
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
