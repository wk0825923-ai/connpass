'use client';

import { useState } from 'react';
import { MOCK_TENANTS } from '@/lib/mock-data';
import type { Tenant } from '@/lib/types';
import Icon from '@/components/Icon';

const SNS_ICON: Record<string, string> = { x: 'brand-x', facebook: 'brand-facebook', linkedin: 'brand-linkedin', slack: 'brand-slack' };
const STATUS_CLASS = { active: 'badge-green', trial: 'badge-blue', suspended: 'badge-gray' } as const;
const STATUS_LABEL = { active: 'アクティブ', trial: 'トライアル', suspended: '停止中' } as const;

export default function AdminUsersPage() {
  const [query, setQuery]     = useState('');
  const [planF, setPlanF]     = useState('all');
  const [statusF, setStatusF] = useState('all');
  const [selected, setSelected] = useState<Tenant | null>(null);
  const [suspended, setSuspended] = useState<Set<number>>(new Set());

  const filtered = MOCK_TENANTS.filter(u => {
    const q = !query || u.name.includes(query) || u.email.includes(query);
    const p = planF === 'all' || u.plan === planF;
    const s = statusF === 'all' || u.status === statusF;
    return q && p && s;
  });

  const toggleSuspend = (id: number) => setSuspended(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <div className="page">
      {selected && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="modal-box">
            <div className="modal-header">
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{selected.email}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>
                <Icon name="x" style={{ fontSize: 16 }} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'プラン', val: <span className="badge badge-purple">{selected.plan}</span> },
                  { label: 'ステータス', val: <span className={`badge ${STATUS_CLASS[selected.status]}`}>{STATUS_LABEL[selected.status]}</span> },
                  { label: 'イベント数', val: <div style={{ fontSize: 24, fontWeight: 700, color: '#0A6B52' }}>{selected.events}</div> },
                  { label: '総投稿数',   val: <div style={{ fontSize: 24, fontWeight: 700, color: '#1D4ED8' }}>{selected.posts}</div> },
                ].map(({ label, val }) => (
                  <div key={label} style={{ background: '#F8FAF8', borderRadius: 8, padding: 14 }}>
                    <div className="section-title" style={{ marginBottom: 6 }}>{label}</div>
                    {val}
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <div className="section-title">連携SNS</div>
                {selected.sns.length > 0 ? (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selected.sns.map(s => (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F0F8F4', border: '1px solid #6EE7B7', borderRadius: 6, padding: '6px 12px' }}>
                        <Icon name={SNS_ICON[s] || 'brand-x'} style={{ fontSize: 15, color: '#0A6B52' }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#065F46' }}>{s.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                ) : <span style={{ fontSize: 12, color: '#94A3B8' }}>未連携</span>}
              </div>
              <div>
                <div className="section-title">最終ログイン</div>
                <div style={{ fontSize: 13, color: '#374151' }}>{selected.lastActive}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="eyebrow">運営者コンソール</div>
      <h1 className="page-title">ユーザー管理</h1>
      <p className="page-sub">全テナントの状況を確認・管理します。「詳細」から個別情報を確認できます。</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div className="search-box">
          <Icon name="search" style={{ fontSize: 16, color: '#94A3B8' }} />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="会社名・メールで検索" />
        </div>
        <select className="form-input" style={{ flex: '0 0 130px', cursor: 'pointer' }} value={planF} onChange={e => setPlanF(e.target.value)}>
          <option value="all">全プラン</option>
          <option value="Free">Free</option>
          <option value="Pro">Pro</option>
          <option value="Team">Team</option>
        </select>
        <select className="form-input" style={{ flex: '0 0 150px', cursor: 'pointer' }} value={statusF} onChange={e => setStatusF(e.target.value)}>
          <option value="all">全ステータス</option>
          <option value="active">アクティブ</option>
          <option value="trial">トライアル</option>
          <option value="suspended">停止中</option>
        </select>
        <span style={{ fontSize: 12, color: '#94A3B8', alignSelf: 'center', flexShrink: 0 }}>{filtered.length} 件</span>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', flex: 1 }}>
        <table className="table">
          <thead>
            <tr>
              <th>会社名</th><th>プラン</th><th>SNS</th>
              <th>イベント</th><th>投稿数</th><th>ステータス</th>
              <th>最終ログイン</th><th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const isSusp = suspended.has(u.id) || u.status === 'suspended';
              const st = (suspended.has(u.id) && u.status !== 'suspended') ? 'suspended' : u.status;
              return (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{u.email}</div>
                  </td>
                  <td><span className="badge badge-purple">{u.plan}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {u.sns.map(s => (
                        <div key={s} style={{ width: 22, height: 22, borderRadius: 4, background: '#F1F5F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name={SNS_ICON[s] || 'brand-x'} style={{ fontSize: 13, color: '#64748B' }} />
                        </div>
                      ))}
                      {u.sns.length === 0 && <span style={{ fontSize: 11, color: '#94A3B8' }}>なし</span>}
                    </div>
                  </td>
                  <td><span style={{ fontWeight: 700 }}>{u.events}</span></td>
                  <td><span style={{ fontWeight: 700 }}>{u.posts}</span></td>
                  <td><span className={`badge ${STATUS_CLASS[st]}`}>{STATUS_LABEL[st]}</span></td>
                  <td><span style={{ fontSize: 12 }}>{u.lastActive}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelected(u)}>
                        <Icon name="chevron-right" style={{ fontSize: 13 }} />詳細
                      </button>
                      {u.status !== 'suspended' && (
                        <button className={`btn ${isSusp ? 'btn-ghost' : 'btn-danger'} btn-sm`} onClick={() => toggleSuspend(u.id)}>
                          {isSusp ? '再開' : '停止'}
                        </button>
                      )}
                    </div>
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
