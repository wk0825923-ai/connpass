'use client';

import { useRouter, usePathname } from 'next/navigation';
import Icon from './Icon';

const ADMIN_NAV = [
  { section: '運営者コンソール', items: [
    { id: 'dashboard', label: '運営ダッシュボード', icon: 'chart-pie',     href: '/admin/dashboard' },
    { id: 'users',     label: 'ユーザー管理',       icon: 'users',          href: '/admin/users' },
    { id: 'posts',     label: '投稿モニタリング',   icon: 'broadcast',      href: '/admin/posts' },
  ]},
  { section: '運営設定', items: [
    { id: 'billing', label: 'プラン・課金',   icon: 'credit-card', href: '/admin/billing' },
    { id: 'notice',  label: 'お知らせ配信',   icon: 'bell',        href: '/admin/notice' },
  ]},
];

const USER_NAV = [
  { section: '初期機能（MVP）', items: [
    { id: 'setup',     label: 'アカウント連携・初期設定', icon: 'plug-connected',    href: '/user/setup' },
    { id: 'dashboard', label: 'ダッシュボード',           icon: 'layout-dashboard',  href: '/user/dashboard' },
    { id: 'editor',    label: '投稿テキスト編集',         icon: 'edit',              href: '/user/editor' },
    { id: 'status',    label: '投稿ステータス管理',       icon: 'list-check',        href: '/user/status' },
  ]},
  { section: '拡張機能', items: [
    { id: 'multi_sns', label: '複数SNS連携',     icon: 'share',          href: '/user/coming-soon' },
    { id: 'schedule',  label: 'スケジュール設定', icon: 'calendar-time',  href: '/user/schedule' },
    { id: 'analytics', label: 'アナリティクス',   icon: 'chart-line',     href: '/user/coming-soon' },
    { id: 'team',      label: 'チーム・権限管理', icon: 'users-group',    href: '/user/coming-soon' },
  ]},
  { section: '将来機能（AI）', items: [
    { id: 'ai_generate', label: 'AI告知文生成',     icon: 'sparkles', href: '/user/editor' },
    { id: 'mention',     label: 'メンション自動化', icon: 'at',       href: '/user/coming-soon' },
    { id: 'recommend',   label: '学習レコメンド',   icon: 'bulb',     href: '/user/coming-soon' },
  ]},
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const navData = isAdmin ? ADMIN_NAV : USER_NAV;

  return (
    <nav className="sidebar">
      <div className="sb-logo">
        <div className="brand-name">
          <Icon name="brand-x" style={{ fontSize: 17, color: '#0A6B52' }} />
          connpass自動投稿
        </div>
        <div className="brand-sub">SNS Auto-Post v1.0</div>
      </div>

      <div className="mode-switch">
        <button
          className={`mode-btn${isAdmin ? ' active' : ''}`}
          onClick={() => router.push('/admin/dashboard')}
        >運営者</button>
        <button
          className={`mode-btn${!isAdmin ? ' active' : ''}`}
          onClick={() => router.push('/user/setup')}
        >利用者</button>
      </div>

      <div className="nav-wrap">
        {navData.map(group => (
          <div key={group.section}>
            <div className="nav-section">{group.section}</div>
            {group.items.map(item => (
              <button
                key={item.id}
                className={`nav-item${pathname === item.href ? ' active' : ''}`}
                onClick={() => router.push(item.href)}
              >
                <span className="nav-icon"><Icon name={item.icon} /></span>
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
