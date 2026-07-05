# connpass 自動投稿プラットフォーム

connpassイベントのSNS自動投稿を起点に、エンジニアコミュニティDBへ発展させるプラットフォーム。

## スタック
- Next.js 14 (App Router) + TypeScript
- データは現在すべてモック（`lib/api.ts` を差し替えてバックエンド接続予定）

## 構成
- `app/user/` … 利用者ビュー（アカウント連携・ダッシュボード・投稿編集・ステータス）
- `app/admin/` … 運営者コンソール（ダッシュボード・ユーザー管理・投稿モニタリング・課金・お知らせ）
- `lib/` … 型定義・モックデータ・データ取得レイヤー・共有ストア
- `legacy/index.html` … 単一HTML版プロトタイプ（旧デプロイ物・参照用）

## 開発
```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # 本番ビルド
```

デプロイは Vercel（mainブランチへのpushで自動デプロイ）。
