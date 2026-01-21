import "./globals.css"; // mainから採用

import type { ReactNode } from "react";
import type { Metadata } from "next";

// mainから採用（これがないとログイン機能が動かない可能性が高いです）
import { AuthProvider } from "@/features/auth/components/AuthProvider";

export const metadata: Metadata = {
  title: "Field Sales App", // あなたの変更を採用
  description: "フィールドセールスアプリ", // あなたの変更を採用
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      {/* 以下の body のスタイルはあなたの変更、AuthProvider は main の変更を合体 */}
      <body style={{ margin: 0 }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}