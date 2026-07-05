import type { Tenant, ConnpassEvent, PostLog, SignupStats, Notice, PlanConfig, ScheduledPost } from './types';

export const MOCK_TENANTS: Tenant[] = [
  { id: 1, name: '株式会社テックスタイル',  email: 'pr@techstyle.jp',    plan: 'Pro',  sns: ['x', 'slack'],               events: 18, posts: 142, status: 'active',    lastActive: '2026-06-28' },
  { id: 2, name: '合同会社ヌマヅ開発',      email: 'info@numazu.dev',    plan: 'Team', sns: ['x', 'facebook', 'linkedin'], events: 34, posts: 301, status: 'active',    lastActive: '2026-06-29' },
  { id: 3, name: 'フリーランス 佐藤',       email: 'sato@example.com',   plan: 'Free', sns: ['x'],                         events: 3,  posts: 11,  status: 'trial',     lastActive: '2026-06-20' },
  { id: 4, name: 'NPO こどもIT',           email: 'contact@kids-it.org',plan: 'Pro',  sns: ['x', 'facebook'],             events: 9,  posts: 58,  status: 'active',    lastActive: '2026-06-27' },
  { id: 5, name: '株式会社レガシー商会',   email: 'sns@legacy.co.jp',   plan: 'Free', sns: [],                            events: 1,  posts: 0,   status: 'suspended', lastActive: '2026-05-02' },
];

export const MOCK_POST_LOGS: PostLog[] = [
  { id: 101, user: '合同会社ヌマヅ開発',     event: 'Go言語LT大会',            sns: 'x',        trigger: '公開時', scheduledAt: '2026-06-29 10:00', status: 'posted',    error: null },
  { id: 102, user: '株式会社テックスタイル', event: 'React入門もくもく会',      sns: 'x',        trigger: '前日',   scheduledAt: '2026-06-29 18:00', status: 'scheduled', error: null },
  { id: 103, user: 'NPO こどもIT',           event: '夏休みプログラミング教室', sns: 'facebook', trigger: '3日前',  scheduledAt: '2026-06-29 09:00', status: 'error',     error: '連携トークンの期限切れ' },
  { id: 104, user: '合同会社ヌマヅ開発',     event: 'Go言語LT大会',            sns: 'slack',    trigger: '当日朝', scheduledAt: '2026-06-30 08:00', status: 'scheduled', error: null },
];

export const MOCK_SIGNUPS: SignupStats[] = [
  { month: '1月', count: 4 }, { month: '2月', count: 7 }, { month: '3月', count: 6 },
  { month: '4月', count: 11 }, { month: '5月', count: 9 }, { month: '6月', count: 14 },
];

export const MOCK_NOTICES: Notice[] = [
  { id: 1, title: 'APIレート制限の仕様変更のお知らせ',                          target: '全ユーザー',    sentAt: '2026-06-01 10:00', status: 'sent', reach: 5 },
  { id: 2, title: 'メンテナンスのご案内（6/15 2:00〜4:00）',                   target: '全ユーザー',    sentAt: '2026-06-10 09:00', status: 'sent', reach: 5 },
  { id: 3, title: 'Pro・Teamユーザー向け：新機能「AI告知文生成」リリース',      target: 'Pro / Team',   sentAt: '2026-06-20 12:00', status: 'sent', reach: 3 },
];

export const PLAN_CONFIGS: PlanConfig[] = [
  {
    id: 'free', name: 'Free', price: 0, color: '#64748B',
    features: ['月3イベントまで', 'X（Twitter）のみ', '手動投稿のみ'],
    userCount: MOCK_TENANTS.filter(u => u.plan === 'Free').length,
  },
  {
    id: 'pro', name: 'Pro', price: 4800, color: '#0A6B52', featured: true,
    features: ['月30イベントまで', 'X / Facebook / LinkedIn', 'AI告知文生成', 'メンション自動化'],
    userCount: MOCK_TENANTS.filter(u => u.plan === 'Pro').length,
  },
  {
    id: 'team', name: 'Team', price: 14800, color: '#4C1D95',
    features: ['イベント数無制限', '全SNS対応（X / FB / LI / Slack）', 'AI告知文生成 + 学習レコメンド', 'チーム・権限管理', '承認ワークフロー'],
    userCount: MOCK_TENANTS.filter(u => u.plan === 'Team').length,
  },
];

export const MOCK_EVENT: ConnpassEvent = {
  title:    'TypeScript勉強会 Vol.12 — 型安全なAPIクライアントを作ろう',
  date:     '2026-07-20', time: '19:00 〜 21:00',
  location: '渋谷区道玄坂1-2-3 TECH HALL 4F',
  capacity: 50, attending: 32,
  url:      'https://connpass.com/event/xxxxxx/',
  tags:     ['TypeScript', 'JavaScript', 'フロントエンド'],
};

const SCHEDULES = [
  { id: 'announce',   label: '公開告知', icon: 'speakerphone',   timing: '【開催告知】' },
  { id: 'three_days', label: '3日前',    icon: 'calendar-minus', timing: '【開催3日前】' },
  { id: 'day_before', label: '前日',     icon: 'calendar-event', timing: '【開催前日】' },
  { id: 'day_of',     label: '当日朝',   icon: 'sun',            timing: '【開催当日】' },
];

const SCHED_AT = ['2026-07-01 10:00', '2026-07-17 09:00', '2026-07-19 18:00', '2026-07-20 08:00'];

function makeText(ev: ConnpassEvent, timing: string): string {
  return `${timing}${ev.title}\n\n📅 ${ev.date} ${ev.time}\n📍 ${ev.location}\n👥 定員${ev.capacity}名（現在${ev.attending}名参加）\n\n詳細・参加登録はこちら👇\n${ev.url}\n\n${ev.tags.map(t => '#' + t).join(' ')} #connpass`;
}

export function buildInitialPosts(ev: ConnpassEvent): ScheduledPost[] {
  return SCHEDULES.map((s, i) => ({
    id: s.id, label: s.label, icon: s.icon, schedAt: SCHED_AT[i],
    text: makeText(ev, s.timing),
    status: i === 0 ? 'posted' : i === 2 ? 'error' : 'scheduled',
    postedAt: i === 0 ? '2026-07-01 10:02' : null,
    errorMsg: i === 2 ? 'API rate limit exceeded (429)' : null,
  }));
}

export const SNS_ICON: Record<string, string> = {
  x: 'brand-x', facebook: 'brand-facebook', linkedin: 'brand-linkedin', slack: 'brand-slack',
};
