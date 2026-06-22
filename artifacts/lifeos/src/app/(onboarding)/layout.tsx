"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import OnboardingShell from "@/components/layout/OnboardingShell";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <OnboardingShell>{children}</OnboardingShell>
    </AuthGuard>
  );
}
