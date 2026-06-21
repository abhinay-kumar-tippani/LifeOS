"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[LifeOS] Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-destructive/40 bg-destructive/5 p-8 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          This page crashed
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Try again, or head back to your dashboard to continue.
        </p>
        {error.digest ? (
          <p className="mt-3 font-mono text-xs text-muted-foreground/70">
            Reference: {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={reset} aria-label="Retry">
            <RotateCw className="h-4 w-4" aria-hidden />
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}