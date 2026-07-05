'use client';

import { useState } from 'react';
import { PLAN_CONFIGS, MOCK_TENANTS } from '@/lib/mock-data';
import type { PlanConfig } from '@/lib/types';
import Icon from '@/components/Icon';

export default function AdminBillingPage() {
  const [plans, setPlans]   = useState<PlanConfig[]>(PLAN_CONFIGS.map(p => ({ ...p })));
  const [editing, setEditing] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState(0);
  const [toast, setToast]   = useState<string | null>(null);

  const totalMRR  = plans.reduce((s, p) => s + p.price * p.userCount, 0);
  const totalUsers = plans.reduce((s, p) => s + p.userCount, 0);
  const paidUsers = plans.filter(p => p.price > 0).reduce((s, p) => s + p.userCount, 0);
  const freeUsers = plans.find(p => p.id === 'free')?.userCount ?? 0;
  const arpu = totalUsers > 0 ? Math.round(totalMRR / totalUsers / 100) * 100 : 0;

  const maxMRR = Math.max(...plans.map(p => p.price * p.userCount || 1));
  const maxU   = Math.max(...plans.map(p => p.userCount || 1));

  const openEdit  = (p: PlanConfig) => { setEditing(p.id); setEditPrice(p.price); };
  const saveEdit  = (id: string) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, price: editPrice } : p));
    setEditing(null);
    setToast('プラン設定を保存しました');
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="page">
      {toast && (
        <div className="toast" style={{ background: '#0A6B52', color: '#fff' }}>
          <Icon name="circle-check" style={{ fontSize: 16 }} />{toast}
        </div>
      )}

      <div className="eyebrow">運営設定</div>
      <h1 className="page-title">プラン・課金管理</h1>
      <p className="page-sub">各プランの機能・料金を設定します。MRRと利用者分布をひと目で確認できます。</p>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card green">
          <div className="eyebrow" style={{ margin: 0 }}>月次売上（MRR）</div>
          <div className="stat-n">¥{Math.round(totalMRR / 1000)}k</div>
          <div className="stat-l">/ 月（概算）</div>
        </div>
        <div className="stat-card blue">
          <div className="eyebrow" style={{ margin: 0 }}>有料ユーザー</div>
          <div className="stat-n">{paidUsers}</div>
          <div className="stat-l">テナント</div>
        </div>
        <div className="stat-card amber">
          <div className="eyebrow" style={{ margin: 0 }}>無料ユーザー</div>
          <div className="stat-n">{freeUsers}</div>
          <div className="stat-l">テナント</div>
        </div>
        <div className="stat-card purple">
          <div className="eyebrow" style={{ margin: 0 }}>ARPU</div>
          <div className="stat-n">¥{arpu.toLocaleString()}</div>
          <div className="stat-l">/ テナント</div>
        </div>
      </div>

      <div className="section-title">プラン設定</div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
        {plans.map(plan => (
          <div key={plan.id} className={`plan-card${plan.featured ? ' featured' : ''}`} style={{ flex: '1 1 200px', borderColor: editing === plan.id ? '#0A6B52' : plan.featured ? plan.color : '#D8E4D8' }}>
            {plan.featured && (
              <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)' }}>
                <span className="badge badge-green">人気No.1</span>
              </div>
            )}
            <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{plan.name}</div>

            {editing === plan.id ? (
              <div style={{ marginBottom: 12 }}>
                <label className="form-label" style={{ marginBottom: 4 }}>月額料金（円）</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input className="form-input" type="number" value={editPrice} onChange={e => setEditPrice(Number(e.target.value))} style={{ maxWidth: 120 }} />
                  <button className="btn btn-primary btn-sm" onClick={() => saveEdit(plan.id)}>
                    <Icon name="check" style={{ fontSize: 14 }} />保存
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>
                    <Icon name="x" style={{ fontSize: 14 }} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: plan.price === 0 ? '#94A3B8' : '#111827', lineHeight: 1 }}>
                  {plan.price === 0 ? '無料' : `¥${plan.price.toLocaleString()}`}
                </div>
                {plan.price > 0 && <div style={{ fontSize: 11, color: '#94A3B8' }}>/ 月</div>}
              </div>
            )}

            <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 10, fontWeight: 600 }}>{plan.userCount}名が利用中</div>
            <div style={{ marginBottom: 14 }}>
              {plan.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#374151', marginBottom: 5 }}>
                  <Icon name="check" style={{ fontSize: 12, color: '#0A6B52' }} />{f}
                </div>
              ))}
            </div>
            {editing !== plan.id && (
              <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={() => openEdit(plan)}>
                <Icon name="edit" style={{ fontSize: 13 }} />料金を編集
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, flex: 1, flexWrap: 'wrap', minHeight: 0 }}>
        <div className="card" style={{ flex: '1 1 240px' }}>
          <div className="section-title">プラン別 月次売上</div>
          {plans.map(p => {
            const val = p.price * p.userCount;
            return (
              <div key={p.id} className="bar-row">
                <div className="bar-label">{p.name}</div>
                <div className="bar-track">
                  <div className={`bar-fill${p.id === 'team' ? ' purple' : p.id === 'free' ? '' : ' blue'}`} style={{ width: `${val / maxMRR * 100}%` }} />
                </div>
                <div className="bar-val">{val === 0 ? '¥0' : `¥${val.toLocaleString()}`}</div>
              </div>
            );
          })}
        </div>
        <div className="card" style={{ flex: '1 1 240px' }}>
          <div className="section-title">プラン別 ユーザー数</div>
          {plans.map(p => (
            <div key={p.id} className="bar-row">
              <div className="bar-label">{p.name}</div>
              <div className="bar-track">
                <div className={`bar-fill${p.id === 'team' ? ' purple' : p.id === 'free' ? ' amber' : ''}`} style={{ width: `${p.userCount / maxU * 100}%` }} />
              </div>
              <div className="bar-val">{p.userCount}名</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ flex: '1 1 200px' }}>
          <div className="section-title">課金ステータス</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: '決済方法',     val: 'Stripe（後日接続）' },
              { label: '請求サイクル', val: '月次（月末締め）' },
              { label: 'トライアル期間', val: '14日間' },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #EDF2ED' }}>
                <span style={{ fontSize: 12, color: '#374151' }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{val}</span>
              </div>
            ))}
            <div className="info-banner" style={{ marginTop: 12 }}>
              <Icon name="info-circle" style={{ fontSize: 16 }} />
              実際の決済はStripe連携後に有効になります
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
