"use client";

import { PublicOnlyGuard } from "@/components/auth/AuthGuard";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <PublicOnlyGuard>{children}</PublicOnlyGuard>;
}
