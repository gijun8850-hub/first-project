import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "야키테이 키오스크",
  description: "야키테이 야끼소바 가게를 위한 시연용 주문 키오스크",
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
