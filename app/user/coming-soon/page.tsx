import Icon from '@/components/Icon';

export default function ComingSoonPage() {
  return (
    <div className="page">
      <div className="eyebrow">拡張機能 / 将来機能</div>
      <h1 className="page-title">実装予定</h1>
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 48, textAlign: 'center' }}>
        <Icon name="tool" style={{ fontSize: 40, color: '#D8E4D8' }} />
        <div style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>このページは実装予定です</div>
        <div style={{ fontSize: 13, color: '#94A3B8', maxWidth: 360 }}>
          拡張機能（複数SNS連携・スケジュール設定・アナリティクス・チーム管理）および
          AI機能（AI告知文生成・メンション自動化・学習レコメンド）は
          Phase 0完了後に順次実装予定です。
        </div>
        <span className="badge badge-amber">実装予定（Phase 1 以降）</span>
      </div>
    </div>
  );
}
