import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI 대답 예측 | AI@Sogang MT',
  description:
    'OpenAI의 답변을 예측하고 실시간으로 순위를 겨루는 AI@Sogang MT 라이브 게임',
  openGraph: {
    title: 'AI 대답 예측 | AI@Sogang MT',
    description: 'OpenAI의 선택과 이유를 예측하는 실시간 참여형 게임',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'AI 대답 예측 | AI@Sogang MT',
    description: 'OpenAI의 선택과 이유를 예측하는 실시간 참여형 게임',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
