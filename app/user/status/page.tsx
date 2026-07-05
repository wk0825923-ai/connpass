'use client';

import { useState } from 'react';
import { MOCK_EVENT, buildInitialPosts } from '@/lib/mock-data';
import { executePost } from '@/lib/api';
import type { ScheduledPost } from '@/lib/types';
import Icon from '@/components/Icon';

export default function StatusPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>(() => buildInitialPosts(MOCK_EVENT));
  const [posting, setPosting] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flashToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handlePostNow = async (id: string) => {
    const target = posts.find(p => p.id === id);
    if (!target) return;
    setPosting(id);
    const result = await executePost(target.text);
    setPosting(null);

    if (result.ok) {
      setPosts(prev => prev.map(p => p.id === id
        ? { ...p, status: 'posted', postedAt: '手動投稿', errorMsg: null }
        : p));
      flashToast(result.source === 'x' ? 'Xへ投稿しました' : '投稿しました（デモ）');
    } else {
      setPosts(prev => prev.map(p => p.id === id
        ? { ...p, status: 'error', errorMsg: result.error ?? '投稿に失敗しました' }
        : p));
      flashToast('投稿に失敗しました');
    }
  };

  const postedCount = posts.filter(p => p.status === 'posted').length;
  const errorCount  = posts.filter(p => p.status === 'error').length;

  return (
    <div className="page">
      {toast && (
        <div className="toast" style={{ background: '#0A6B52', color: '#fff' }}>
          <Icon name="circle-check" style={{ fontSize: 16 }} />{toast}
        </div>
      )}

      <div className="eyebrow">投稿ステータス管理</div>
      <h1 className="page-title">投稿ステータス管理</h1>

      <div className="event-info-bar">
        <Icon name="calendar-event" style={{ fontSize: 16, color: '#0A6B52' }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#065F46' }}>{MOCK_EVENT.title}</span>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        <div className="stat-card green">
          <div className="eyebrow" style={{ margin: 0 }}>投稿済み</div>
          <div className="stat-n">{postedCount}</div>
          <div className="stat-l">件</div>
        </div>
        <div className="stat-card amber">
          <div className="eyebrow" style={{ margin: 0 }}>予約中</div>
          <div className="stat-n">{posts.filter(p => p.status === 'scheduled').length}</div>
          <div className="stat-l">件</div>
        </div>
        <div className="stat-card red">
          <div className="eyebrow" style={{ margin: 0 }}>エラー</div>
          <div className="stat-n">{errorCount}</div>
          <div className="stat-l">件</div>
        </div>
        <div className="stat-card blue">
          <div className="eyebrow" style={{ margin: 0 }}>合計</div>
          <div className="stat-n">{posts.length}</div>
          <div className="stat-l">件</div>
        </div>
      </div>

      {errorCount > 0 && (
        <div className="alert-banner" style={{ marginBottom: 16 }}>
          <Icon name="alert-triangle" style={{ fontSize: 18 }} />
          {errorCount}件のエラーが発生しています。「今すぐ投稿」で再試行できます。
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden', flex: 1 }}>
        <table className="table">
          <thead>
            <tr>
              <th>タイミング</th><th>予定日時</th><th>ステータス</th><th>詳細</th><th>アクション</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(p => {
              const isPosting = posting === p.id;
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon name={p.icon} style={{ fontSize: 16, color: '#0A6B52' }} />
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{p.label}</span>
                    </div>
                  </td>
                  <td><span style={{ fontSize: 12 }}>{p.schedAt}</span></td>
                  <td>
                    <span className={`badge badge-${p.status === 'posted' ? 'green' : p.status === 'error' ? 'red' : 'amber'}`}>
                      {p.status === 'posted' ? '投稿済み' : p.status === 'error' ? 'エラー' : '予約中'}
                    </span>
                  </td>
                  <td>
                    {p.postedAt && <span style={{ fontSize: 11, color: '#6EE7B7' }}>{p.postedAt}</span>}
                    {p.errorMsg && <span style={{ fontSize: 11, color: '#C2410C' }}>{p.errorMsg}</span>}
                  </td>
                  <td>
                    {p.status !== 'posted' && (
                      <button className="btn btn-primary btn-sm" onClick={() => handlePostNow(p.id)} disabled={isPosting}>
                        {isPosting ? <span className="spinner" /> : <Icon name="send" style={{ fontSize: 13 }} />}
                        {isPosting ? '投稿中…' : '今すぐ投稿'}
                      </button>
                    )}
                    {p.status === 'posted' && (
                      <span style={{ fontSize: 11, color: '#0A6B52', fontWeight: 600 }}>✓ 完了</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
