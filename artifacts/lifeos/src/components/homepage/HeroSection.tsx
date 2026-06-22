"use client";


import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeroDashboardPreview } from "./HeroDashboardPreview";
import { Sparkles, Flame, Timer, BookOpen } from "lucide-react";

const socialProof = [
  { icon: Flame,    label: "Habit streaks",   stat: "30-day grids" },
  { icon: Timer,    label: "Pomodoro focus",  stat: "Session logging" },
  { icon: BookOpen, label: "Daily journaling", stat: "Mood & reflection" },
];

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-28 pb-10 sm:pt-36 sm:pb-14">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.35),transparent)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.45 }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" aria-hidden />
            Free forever · No credit card · Your data, your control
          </div>

          {/* Eyebrow */}
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
            Habits · Tasks · Focus · Journal
          </p>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl sm:leading-[1.1] lg:text-6xl">
            Your Productivity{" "}
            <span className="gradient-text">Operating System</span>
          </h1>

          {/* Sub */}
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Plan your day, build streaks, run Pomodoro sessions, and reflect in one calm
            dashboard—built for clarity, not clutter.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button size="lg" className="min-h-12 min-w-[160px] shadow-lg shadow-primary/30" asChild>
              <Link href="/signup">Get Started — it&apos;s free</Link>
            </Button>
            <Button size="lg" variant="outline" className="min-h-12 border-white/15 bg-white/[0.04] hover:bg-white/[0.08]" asChild>
              <a href="#features">See all features</a>
            </Button>
          </div>

          {/* Social proof chips */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {socialProof.map(({ icon: Icon, label, stat }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5"
              >
                <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
                <span className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{label}</span>
                  {" · "}
                  {stat}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <HeroDashboardPreview />
      </div>
    </section>
  );
}
