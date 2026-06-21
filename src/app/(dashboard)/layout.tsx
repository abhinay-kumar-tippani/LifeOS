import { DashboardShell } from "@/components/layout/DashboardShell";
import { PomodoroEngine } from "@/lib/stores/PomodoroEngine";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PomodoroEngine />
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
