"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Flame, Timer } from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Today overview",
    body: "See today’s habits, Pomodoro sessions, priority tasks, and a quick journal preview in one scroll.",
  },
  {
    icon: Flame,
    title: "Habit tracking",
    body: "Check off daily habits, view a 30-day grid, streaks, and completion trends so patterns stay visible.",
  },
  {
    icon: Timer,
    title: "Focus sessions",
    body: "Run Pomodoro timers with optional task links, breaks between rounds, and a simple history for the day.",
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Core features</h2>
          <p className="mt-3 text-muted-foreground">
            Built for people who want structure without noise—students, professionals, and anyone building better
            routines.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/30 p-6 shadow-lg backdrop-blur-md"
              >
                <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 [background:linear-gradient(135deg,rgba(99,102,241,0.35),transparent_40%,rgba(139,92,246,0.25))]" />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
