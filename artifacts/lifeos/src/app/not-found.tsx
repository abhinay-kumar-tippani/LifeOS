import { Link } from "wouter";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card/40 p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Compass className="h-6 w-6 text-primary" aria-hidden />
        </div>
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          404
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for has moved or never existed. Let&apos;s get you back to your dashboard.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild aria-label="Go to dashboard">
            <Link href="/dashboard">
              <Home className="h-4 w-4" aria-hidden />
              Back to dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild aria-label="Go to home">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}