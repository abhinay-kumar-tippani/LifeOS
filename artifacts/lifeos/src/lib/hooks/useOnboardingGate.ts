
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/lib/hooks/useUser";
import { useHabits } from "@/lib/hooks/useHabits";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/forgot-password", "/callback", "/onboarding", "/privacy", "/terms"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || (p !== "/" && pathname.startsWith(p)));
}

export function useOnboardingGate() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { habits, loading: habitsLoading } = useHabits(user?.id);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (userLoading || habitsLoading || checked) return;
    if (isPublicPath(pathname)) {
      setChecked(true);
      return;
    }
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      setChecked(true);
      return;
    }
    let complete = false;
    try {
      complete = localStorage.getItem("lifeos-onboarding-complete") === "1";
    } catch { /* ignore */ }
    if (!complete && habits.length === 0) {
      router.push("/onboarding");
    }
    setChecked(true);
  }, [userLoading, habitsLoading, habits.length, pathname, router, checked, user]);
}
