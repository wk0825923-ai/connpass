import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'connpass 自動投稿システム',
  description: 'connpassイベントのSNS自動投稿プラットフォーム',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
