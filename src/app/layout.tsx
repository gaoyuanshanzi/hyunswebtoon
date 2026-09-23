import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '현스 9컷 교육용 만화 제작소 (Hyun\'s 9-Cut Webtoon Studio)',
  description: '주제와 대상만으로 9칸 교육용 인포그래픽 만화를 손쉽게 기획하고 제작하는 스마트 스튜디오',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Gowun+Dodum&family=Do+Hyeon&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
