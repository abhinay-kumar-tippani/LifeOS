import { Link } from "wouter";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card/40 p-8 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Compass className="h-6 w-6 text-primary" aria-hidden />
        </div>
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Not found
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
          Nothing here yet
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you tried to open doesn&apos;t exist inside your workspace.
        </p>
        <div className="mt-6 flex justify-center">
          <Button asChild aria-label="Back to dashboard">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}