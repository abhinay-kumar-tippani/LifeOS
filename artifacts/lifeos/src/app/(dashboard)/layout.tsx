"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { OnboardingGate } from "@/components/layout/OnboardingGate";
import { PomodoroEngine } from "@/lib/stores/PomodoroEngine";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <OnboardingGate />
      <PomodoroEngine />
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}
