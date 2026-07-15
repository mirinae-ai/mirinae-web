import type { Metadata } from "next";
import { Manrope, Nanum_Gothic } from "next/font/google";
import "./globals.css";

const latinFont = Manrope({
  subsets: ["latin"],
  variable: "--font-latin",
  weight: ["400", "500", "600", "700", "800"],
});

const koreanFont = Nanum_Gothic({
  subsets: ["latin"],
  variable: "--font-korean",
  weight: ["400", "700", "800"],
});

export const metadata: Metadata = {
  title: "미리내 | 나를 이해하는 점성술 대화",
  description:
    "내 출생 차트와 오늘의 별 흐름을 바탕으로 연애, 커리어, 마음속 고민을 함께 풀어가는 점성술 대화 앱.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${latinFont.variable} ${koreanFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
