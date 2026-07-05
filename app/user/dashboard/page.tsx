'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchConnpassEvent, getInitialPosts } from '@/lib/api';
import type { ConnpassEvent } from '@/lib/types';
import { setSharedEvent, setSharedPosts } from '@/lib/event-store';
import Icon from '@/components/Icon';

export default function DashboardPage() {
  const router = useRouter();
  const [url, setUrl]         = useState('');
  const [loading, setLoading] = useState(false);
  const [event, setEvent]     = useState<ConnpassEvent | null>(null);

  const handleFetch = async () => {
    if (!url.includes('connpass.com')) {
      alert('connpass.comのURLを入力してください');
      return;
    }
    setLoading(true);
    const ev = await fetchConnpassEvent(url);
    const posts = await getInitialPosts(ev);
    setEvent(ev);
    setSharedEvent(ev);
    setSharedPosts(posts);
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="eyebrow">STEP 2</div>
      <h1 className="page-title">ダッシュボード</h1>
      <p className="page-sub">connpassイベントのURLを入力して投稿テキストを自動生成します。</p>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title">イベントURL登録</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input className="form-input" type="url" value={url} onChange={e => setUrl(e.target.value)}
            placeholder="https://connpass.com/event/xxxxxx/" onKeyDown={e => e.key === 'Enter' && handleFetch()} />
          <button className="btn btn-primary" onClick={handleFetch} disabled={loading} style={{ flexShrink: 0 }}>
            {loading ? <span className="spinner" /> : <Icon name="download" style={{ fontSize: 16 }} />}
            {loading ? '取得中…' : '取得'}
          </button>
        </div>
      </div>

      {event ? (
        <>
          <div className="event-info-bar">
            <Icon name="circle-check" style={{ fontSize: 18, color: '#0A6B52' }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#065F46' }}>{event.title}</div>
              <div style={{ fontSize: 12, color: '#065F46' }}>{event.date} {event.time} / {event.location}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            <div className="stat-card green">
              <div className="eyebrow" style={{ margin: 0 }}>定員</div>
              <div className="stat-n">{event.capacity}</div>
              <div className="stat-l">名</div>
            </div>
            <div className="stat-card blue">
              <div className="eyebrow" style={{ margin: 0 }}>参加中</div>
              <div className="stat-n">{event.attending}</div>
              <div className="stat-l">名</div>
            </div>
            <div className="stat-card amber">
              <div className="eyebrow" style={{ margin: 0 }}>残り</div>
              <div className="stat-n">{event.capacity - event.attending}</div>
              <div className="stat-l">席</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={() => router.push('/user/editor')}>
              次へ：テキスト編集<Icon name="arrow-right" style={{ fontSize: 16 }} />
            </button>
          </div>
        </>
      ) : (
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#94A3B8', padding: 48, textAlign: 'center' }}>
          <Icon name="calendar-event" style={{ fontSize: 40, color: '#D8E4D8' }} />
          <div style={{ fontSize: 14, fontWeight: 600 }}>URLを入力してイベント情報を取得しましょう</div>
          <div style={{ fontSize: 12 }}>connpass.comのイベントURLを入力してください</div>
        </div>
      )}
    </div>
  );
}
