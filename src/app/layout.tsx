import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "주간체크",
  description: "주 1회 체성분 체크인을 기록하고 변화 흐름을 보는 정적 웹 앱",
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
