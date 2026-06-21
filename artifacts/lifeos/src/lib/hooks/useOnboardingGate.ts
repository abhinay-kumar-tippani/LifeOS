
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/lib/hooks/useUser";
import { useHabits } from "@/lib/hooks/useHabits";

export function useOnboardingGate() {
  const [pathname, navigate] = useLocation();
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
      navigate("/onboarding");
    }
    setChecked(true);
  }, [userLoading, habitsLoading, habits.length, pathname, navigate, checked]);
}