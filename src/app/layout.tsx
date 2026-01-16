import type { ReactNode } from "react";

import { AuthProvider } from "@/features/auth/components/AuthProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
