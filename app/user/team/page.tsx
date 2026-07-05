'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';

type Role = 'owner' | 'editor' | 'viewer';

interface Member {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'invited';
}

const ROLE_LABEL: Record<Role, string> = { owner: 'オーナー', editor: '編集者', viewer: '閲覧者' };
const ROLE_DESC: Record<Role, string> = {
  owner: '全権限・課金・メンバー管理',
  editor: '投稿の作成・編集・配信',
  viewer: '閲覧のみ',
};
const ROLE_BADGE: Record<Role, string> = { owner: 'badge-purple', editor: 'badge-green', viewer: 'badge-gray' };

const INITIAL: Member[] = [
  { id: 1, name: '田中 太郎',   email: 'tanaka@techstyle.jp', role: 'owner',  status: 'active' },
  { id: 2, name: '佐藤 花子',   email: 'sato@techstyle.jp',   role: 'editor', status: 'active' },
  { id: 3, name: '鈴木 一郎',   email: 'suzuki@techstyle.jp', role: 'editor', status: 'active' },
  { id: 4, name: '（招待中）',  email: 'guest@example.com',   role: 'viewer', status: 'invited' },
];

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>(INITIAL);
  const [email, setEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('editor');
  const [toast, setToast] = useState<string | null>(null);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2200); };

  const changeRole = (id: number, role: Role) =>
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));

  const remove = (id: number) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    flash('メンバーを削除しました');
  };

  const invite = () => {
    if (!email.includes('@')) { flash('メールアドレスを確認してください'); return; }
    setMembers(prev => [...prev, { id: Date.now(), name: '（招待中）', email, role: inviteRole, status: 'invited' }]);
    flash(`${email} を招待しました（デモ）`);
    setEmail('');
  };

  return (
    <div className="page">
      {toast && (
        <div className="toast" style={{ background: '#0A6B52', color: '#fff' }}>
          <Icon name="circle-check" style={{ fontSize: 16 }} />{toast}
        </div>
      )}

      <div className="eyebrow">拡張機能</div>
      <h1 className="page-title">チーム・権限管理</h1>
      <p className="page-sub">メンバーを招待し、役割ごとに操作権限を割り当てます。</p>

      {/* 招待フォーム */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title">メンバーを招待</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="member@example.com" style={{ flex: '1 1 220px' }}
            onKeyDown={e => e.key === 'Enter' && invite()} />
          <select className="form-input" value={inviteRole} onChange={e => setInviteRole(e.target.value as Role)}
            style={{ flex: '0 0 140px', cursor: 'pointer' }}>
            <option value="editor">編集者</option>
            <option value="viewer">閲覧者</option>
          </select>
          <button className="btn btn-primary" onClick={invite} style={{ flexShrink: 0 }}>
            <Icon name="user-plus" style={{ fontSize: 16 }} />招待
          </button>
        </div>
      </div>

      {/* メンバー一覧 */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', flex: 1 }}>
        <table className="table">
          <thead>
            <tr><th>メンバー</th><th>役割</th><th>権限</th><th>状態</th><th>操作</th></tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0A6B52', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                      {m.name.replace('（招待中）', '?').charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{m.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {m.role === 'owner'
                    ? <span className={`badge ${ROLE_BADGE.owner}`}>{ROLE_LABEL.owner}</span>
                    : (
                      <select className="form-input" value={m.role} onChange={e => changeRole(m.id, e.target.value as Role)}
                        style={{ padding: '4px 8px', fontSize: 12, cursor: 'pointer', width: 110 }}>
                        <option value="editor">編集者</option>
                        <option value="viewer">閲覧者</option>
                      </select>
                    )}
                </td>
                <td><span style={{ fontSize: 11, color: '#64748B' }}>{ROLE_DESC[m.role]}</span></td>
                <td>
                  {m.status === 'active'
                    ? <span className="badge badge-green">参加中</span>
                    : <span className="badge badge-amber">招待中</span>}
                </td>
                <td>
                  {m.role !== 'owner'
                    ? <button className="btn btn-ghost btn-sm" onClick={() => remove(m.id)}><Icon name="trash" style={{ fontSize: 14 }} />削除</button>
                    : <span style={{ fontSize: 11, color: '#CBD5E1' }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="info-banner" style={{ marginTop: 16 }}>
        <Icon name="info-circle" style={{ fontSize: 16 }} />
        プレビュー（保存はモック）。Team プランで利用可能。承認ワークフロー（編集者の投稿をオーナーが承認）も実装予定です。
      </div>
    </div>
  );
}
