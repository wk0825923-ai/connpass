'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/Icon';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  const handleLogin = () => router.push('/admin/dashboard');

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F2F5F2', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 380, background: '#FFFFFF', borderRadius: 12, padding: '34px 30px', boxShadow: '0 10px 40px rgba(10,107,82,.10)', border: '1px solid #E2E8E2' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0A6B52', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Icon name="brand-x" style={{ fontSize: 19 }} />
            connpass 自動投稿システム
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 6, letterSpacing: '.08em', textTransform: 'uppercase' }}>
            SNS Auto-Post for connpass
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4, background: '#F1F5F1', padding: 4, borderRadius: 8, marginBottom: 22 }}>
          {(['login', 'signup'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: 8, borderRadius: 6, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700,
              background: mode === m ? '#FFFFFF' : 'transparent',
              color: mode === m ? '#0A6B52' : '#94A3B8',
              boxShadow: mode === m ? '0 1px 2px rgba(0,0,0,.06)' : 'none',
              transition: 'all .12s',
            }}>
              {m === 'login' ? 'ログイン' : '新規登録'}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="form-label">メールアドレス</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="form-label">パスワード</label>
          <input className="form-input" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" />
        </div>

        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleLogin}>
          {mode === 'login' ? 'ログイン' : '登録して始める'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0', color: '#CBD5E1', fontSize: 11 }}>
          <div style={{ flex: 1, height: 1, background: '#E2E8E2' }} />または
          <div style={{ flex: 1, height: 1, background: '#E2E8E2' }} />
        </div>

        <button className="btn btn-ghost" style={{ width: '100%' }} onClick={handleLogin}>
          <Icon name="brand-github" style={{ fontSize: 18 }} />
          GitHub で続ける
        </button>

        <p style={{ fontSize: 11, color: '#A8B5A8', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
          フロントエンドプレビュー（認証バックエンドは後日接続）
        </p>
      </div>
    </div>
  );
}
