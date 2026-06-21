import { useEffect } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/lib/hooks/useUser";

function AuthLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [pathname, navigate] = useLocation();
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const next = encodeURIComponent(pathname);
      navigate(`/login?next=${next}`, { replace: true });
    }
  }, [user, loading, pathname, navigate]);

  if (loading) return <AuthLoader />;
  if (!user) return <AuthLoader />;

  return <>{children}</>;
}

export function PublicOnlyGuard({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) return <AuthLoader />;
  if (user) return <AuthLoader />;

  return <>{children}</>;
}
