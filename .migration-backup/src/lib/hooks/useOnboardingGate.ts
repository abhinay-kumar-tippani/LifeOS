"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/useUser";
import { useHabits } from "@/lib/hooks/useHabits";

export function useOnboardingGate() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { habits, loading: habitsLoading } = useHabits(user?.id);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (userLoading || habitsLoading || checked) return;
    if (pathname === "/onboarding" || pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/forgot-password") || pathname.startsWith("/privacy") || pathname.startsWith("/terms")) {
      setChecked(true);
      return;
    }
    let complete = false;
    try {
      complete = localStorage.getItem("lifeos-onboarding-complete") === "1";
    } catch { /* ignore */ }
    if (!complete && habits.length === 0 && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
    setChecked(true);
  }, [userLoading, habitsLoading, habits.length, pathname, router, checked]);
}