'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_EVENT, buildInitialPosts } from '@/lib/mock-data';
import { sharedEvent, sharedPosts } from '@/lib/event-store';
import type { ScheduledPost } from '@/lib/types';
import Icon from '@/components/Icon';

const CHAR_LIMIT = 280;

export default function EditorPage() {
  const router = useRouter();
  // dashboard で取得済みなら引き継ぐ。直接遷移時は MOCK_EVENT にフォールバック
  const initialEvent = sharedEvent ?? MOCK_EVENT;
  const [event]             = useState(initialEvent);
  const [posts, setPosts]   = useState<ScheduledPost[]>(
    () => sharedPosts.length ? sharedPosts : buildInitialPosts(initialEvent)
  );
  const [activeIdx, setActiveIdx] = useState(0);

  const [generating, setGenerating] = useState(false);

  const cur = posts[activeIdx];
  const cnt = cur?.text.length ?? 0;

  const updateText = (text: string) =>
    setPosts(prev => prev.map((p, i) => i === activeIdx ? { ...p, text } : p));

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event }),
      });
      const data = await res.json();
      if (data.text) updateText(data.text);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="page">
      <div className="eyebrow">STEP 3</div>
      <h1 className="page-title">投稿テキスト編集</h1>

      <div className="event-info-bar">
        <Icon name="calendar-event" style={{ fontSize: 16, color: '#0A6B52' }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#065F46' }}>{event.title}</span>
      </div>

      {/* タブ */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {posts.map((p, i) => (
          <button key={p.id} className="post-tab" onClick={() => setActiveIdx(i)}
            style={{
              background: i === activeIdx ? '#0A6B52' : '#FFFFFF',
              color: i === activeIdx ? '#FFFFFF' : '#64748B',
              borderColor: i === activeIdx ? '#0A6B52' : '#DDE8DE',
            }}>
            {p.label}
          </button>
        ))}
      </div>

      {cur && (
        <div style={{ flex: 1, display: 'flex', gap: 16, flexWrap: 'wrap', minHeight: 0 }}>
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <button className="btn btn-ghost" onClick={handleGenerate} disabled={generating}
                style={{ fontSize: 13 }}>
                {generating ? <span className="spinner" /> : <Icon name="sparkles" style={{ fontSize: 16 }} />}
                {generating ? '生成中…' : 'AIで生成'}
              </button>
            </div>
            <textarea className="form-textarea" value={cur.text} rows={12}
              style={{ flex: 1, minHeight: 220 }}
              onChange={e => updateText(e.target.value)} />
            <div className={`char-count${cnt > CHAR_LIMIT ? ' over' : ''}`}>
              {cnt} / {CHAR_LIMIT} 文字{cnt > CHAR_LIMIT ? ' ⚠ 超過' : ''}
            </div>
          </div>
          <div style={{ flex: '1 1 260px' }}>
            <label className="form-label">Xプレビュー</label>
            <div className="card" style={{ fontSize: 13, whiteSpace: 'pre-wrap', lineHeight: 1.8, wordBreak: 'break-word' }}>
              {cur.text}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
        <button className="btn btn-primary" onClick={() => router.push('/user/status')}>
          次へ：ステータス確認<Icon name="arrow-right" style={{ fontSize: 16 }} />
        </button>
      </div>
    </div>
  );
}
