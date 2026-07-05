import { getTenants, getPostLogs, getSignups } from '@/lib/api';
import Icon from '@/components/Icon';

export default async function AdminDashboardPage() {
  const [tenants, logs, signups] = await Promise.all([getTenants(), getPostLogs(), getSignups()]);

  const totalUsers  = tenants.length;
  const activeUsers = tenants.filter(u => u.status === 'active').length;
  const trialUsers  = tenants.filter(u => u.status === 'trial').length;
  const thisMonth   = signups[signups.length - 1].count;
  const postedCount = logs.filter(p => p.status === 'posted').length;
  const errorCount  = logs.filter(p => p.status === 'error').length;

  const maxSignup = Math.max(...signups.map(d => d.count));

  const SNS_ICON: Record<string, string> = { x: 'brand-x', facebook: 'brand-facebook', linkedin: 'brand-linkedin', slack: 'brand-slack' };

  return (
    <div className="page">
      <div className="eyebrow">運営者コンソール</div>
      <h1 className="page-title">運営ダッシュボード</h1>
      <p className="page-sub">プラットフォーム全体の状況をひと目で確認できます。</p>

      {errorCount > 0 && (
        <div className="alert-banner">
          <Icon name="alert-triangle" style={{ fontSize: 18, color: '#C2410C' }} />
          <span style={{ fontSize: 13, color: '#9A3412', fontWeight: 600 }}>
            {errorCount}件の投稿エラーが発生しています — 投稿モニタリングを確認してください
          </span>
        </div>
      )}

      {/* KPI */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card green">
          <div className="eyebrow" style={{ margin: 0 }}>総ユーザー</div>
          <div className="stat-n">{totalUsers}</div>
          <div className="stat-l">テナント</div>
        </div>
        <div className="stat-card green">
          <div className="eyebrow" style={{ margin: 0 }}>アクティブ</div>
          <div className="stat-n">{activeUsers}</div>
          <div className="stat-l">ユーザー</div>
        </div>
        <div className="stat-card blue">
          <div className="eyebrow" style={{ margin: 0 }}>トライアル</div>
          <div className="stat-n">{trialUsers}</div>
          <div className="stat-l">ユーザー</div>
        </div>
        <div className="stat-card amber">
          <div className="eyebrow" style={{ margin: 0 }}>今月の新規登録</div>
          <div className="stat-n">{thisMonth}</div>
          <div className="stat-l">件</div>
        </div>
        <div className="stat-card green">
          <div className="eyebrow" style={{ margin: 0 }}>本日の投稿</div>
          <div className="stat-n">{logs.length}</div>
          <div className="stat-l">件</div>
        </div>
        <div className="stat-card red">
          <div className="eyebrow" style={{ margin: 0 }}>エラー</div>
          <div className="stat-n">{errorCount}</div>
          <div className="stat-l">件</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, flex: 1, flexWrap: 'wrap', minHeight: 0 }}>
        {/* 新規登録グラフ */}
        <div className="card" style={{ flex: '1 1 240px' }}>
          <div className="section-title">新規登録の推移（月次）</div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 110 }}>
            {signups.map(d => {
              const barH = Math.round(d.count / maxSignup * 80);
              return (
                <div key={d.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                  <div style={{ width: '100%', height: 80, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <div style={{ width: '72%', margin: '0 auto', height: barH, background: d.count === maxSignup ? '#0A6B52' : '#D1FAE5', borderRadius: '3px 3px 0 0', position: 'relative' }}>
                      {d.count === maxSignup && (
                        <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: 9, fontWeight: 700, color: '#0A6B52', whiteSpace: 'nowrap' }}>最高</div>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: '#374151', fontWeight: 600 }}>{d.month}</div>
                  <div style={{ fontSize: 10, color: '#0A6B52', fontWeight: 700 }}>{d.count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 本日の投稿状況 */}
        <div className="card" style={{ flex: '2 1 340px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div className="section-title" style={{ margin: 0 }}>本日の投稿状況（{logs.length}件）</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <span className="badge badge-amber">{logs.filter(p => p.status === 'scheduled').length} 予約中</span>
              <span className="badge badge-green">{postedCount} 投稿済み</span>
              <span className="badge badge-red">{errorCount} エラー</span>
            </div>
          </div>
          {logs.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < logs.length - 1 ? '1px solid #EDF2ED' : 'none' }}>
              <div style={{ flex: '0 0 130px', fontSize: 12, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.user}</div>
              <div style={{ flex: 1, fontSize: 12, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.event}</div>
              <Icon name={SNS_ICON[p.sns] || 'brand-x'} style={{ fontSize: 13, color: '#64748B', flexShrink: 0 }} />
              <span className={`badge badge-${p.status === 'posted' ? 'green' : p.status === 'error' ? 'red' : 'amber'}`} style={{ flexShrink: 0 }}>
                {p.status === 'posted' ? '投稿済み' : p.status === 'error' ? 'エラー' : '予約中'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
