"use client";

import Link from "next/link";

export default function OnboardingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center border-b border-border/40 px-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="LifeOS" className="h-8 w-8 rounded-lg object-cover" />
          <span className="text-xl font-bold tracking-tight">LifeOS</span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        {children}
      </main>
    </div>
  );
}
