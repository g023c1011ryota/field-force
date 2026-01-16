import type { ReactNode } from "react";

import { AuthGuard } from "@/features/auth/components/AuthGuard";

export default function TabsLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
