// ── ユーザー・テナント ──────────────────────────────────────
export type Plan = 'Free' | 'Pro' | 'Team';
export type UserStatus = 'active' | 'trial' | 'suspended';
export type SnsKey = 'x' | 'facebook' | 'linkedin' | 'slack';

export interface Tenant {
  id: number;
  name: string;
  email: string;
  plan: Plan;
  sns: SnsKey[];
  events: number;
  posts: number;
  status: UserStatus;
  lastActive: string;
}

// ── イベント ────────────────────────────────────────────────
export interface ConnpassEvent {
  title: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  attending: number;
  url: string;
  tags: string[];
}

// ── 投稿 ────────────────────────────────────────────────────
export type PostStatus = 'posted' | 'scheduled' | 'error';

export interface ScheduledPost {
  id: string;
  label: string;
  icon: string;
  schedAt: string;
  text: string;
  status: PostStatus;
  postedAt: string | null;
  errorMsg: string | null;
}

export interface PostLog {
  id: number;
  user: string;
  event: string;
  sns: SnsKey;
  trigger: string;
  scheduledAt: string;
  status: PostStatus;
  error: string | null;
}

// ── 運営 ────────────────────────────────────────────────────
export interface SignupStats {
  month: string;
  count: number;
}

export interface Notice {
  id: number;
  title: string;
  target: string;
  sentAt: string;
  status: 'sent' | 'draft';
  reach: number;
}

export interface PlanConfig {
  id: string;
  name: string;
  price: number;
  color: string;
  featured?: boolean;
  features: string[];
  userCount: number;
}
