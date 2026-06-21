import { DashboardShell } from "@/components/layout/DashboardShell";
import { OnboardingGate } from "@/components/layout/OnboardingGate";
import { PomodoroEngine } from "@/lib/stores/PomodoroEngine";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OnboardingGate />
      <PomodoroEngine />
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}