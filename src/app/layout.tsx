import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "엔필름 — 촬영 현장 인력 구인구직",
  description:
    "감독이 공고를 올리고, 촬영 인력이 신청한다. 지인 추천 기반 신뢰형 구인구직 플랫폼.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-bg text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
