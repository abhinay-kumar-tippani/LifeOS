"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeroDashboardPreview } from "./HeroDashboardPreview";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.35),transparent)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary/90">
            Habits · Tasks · Focus · Journal
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl sm:leading-[1.1] lg:text-6xl">
            Your Productivity Operating System
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Plan your day, build streaks, run Pomodoro sessions, and reflect in one calm dashboard—built
            for clarity, not clutter.
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button size="lg" className="min-h-12 min-w-[160px] shadow-lg shadow-primary/25" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="min-h-12 border-white/15 bg-white/[0.04]" asChild>
              <a href="#features">Explore features</a>
            </Button>
            <Button size="lg" variant="ghost" className="min-h-12 text-muted-foreground hover:text-foreground" asChild>
              <Link href="/login">Open dashboard</Link>
            </Button>
          </div>
        </motion.div>

        <HeroDashboardPreview />
      </div>
    </section>
  );
}
