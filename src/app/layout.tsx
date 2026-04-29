import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "주간 체성분 코치",
  description: "주 1회 체성분 체크인을 저장하고 이번 주 운동 방향을 제안하는 정적 웹 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
