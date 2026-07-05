-- ════════════════════════════════════════════════════════════
-- connpass プラットフォーム 初期スキーマ（Phase 0）
-- ロードマップ 0-4 準拠。users と post_logs から蓄積を開始する。
-- ════════════════════════════════════════════════════════════

-- ── ユーザー（テナント） ─────────────────────────────────────
create table if not exists public.users (
  id                uuid primary key default gen_random_uuid(),
  auth_id           uuid unique,                 -- supabase auth.users.id と対応
  name              text,
  email             text unique,
  connpass_user_id  text,
  x_access_token    text,                        -- 暗号化 or Vault 管理を推奨
  x_refresh_token   text,
  plan              text not null default 'free' -- free | pro | team
                    check (plan in ('free','pro','team')),
  status            text not null default 'trial'
                    check (status in ('active','trial','suspended')),
  last_active       timestamptz,
  created_at        timestamptz not null default now()
);

-- ── 投稿ログ（Phase 1以降のデータ資産になる） ───────────────
create table if not exists public.post_logs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.users(id) on delete cascade,
  event_id     text,                             -- connpass event id
  event_title  text,
  platform     text not null default 'x'         -- x | threads | bluesky | slack
               check (platform in ('x','threads','bluesky','slack','facebook','linkedin')),
  trigger      text,                             -- 公開時 | 前日 | 3日前 ...
  scheduled_at timestamptz,
  posted_at    timestamptz,
  status       text not null default 'scheduled'
               check (status in ('scheduled','posted','error')),
  post_id      text,                             -- 投稿先のツイートID等
  error_msg    text,
  engagement   jsonb,                            -- { likes, retweets, replies } ← Phase1で活用
  created_at   timestamptz not null default now()
);

create index if not exists post_logs_user_id_idx   on public.post_logs (user_id);
create index if not exists post_logs_status_idx     on public.post_logs (status);
create index if not exists post_logs_scheduled_idx  on public.post_logs (scheduled_at);

-- ── RLS（行レベルセキュリティ） ─────────────────────────────
alter table public.users     enable row level security;
alter table public.post_logs enable row level security;

-- 自分のユーザー行のみ参照/更新
create policy "users self read"   on public.users
  for select using (auth.uid() = auth_id);
create policy "users self update" on public.users
  for update using (auth.uid() = auth_id);

-- 自分の投稿ログのみ操作
create policy "post_logs owner read"   on public.post_logs
  for select using (
    user_id in (select id from public.users where auth_id = auth.uid())
  );
create policy "post_logs owner write"  on public.post_logs
  for all using (
    user_id in (select id from public.users where auth_id = auth.uid())
  );
