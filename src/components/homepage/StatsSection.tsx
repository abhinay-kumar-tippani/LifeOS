"use client";

import { motion } from "framer-motion";
import {
  Kanban,
  Grid2x2,
  CalendarRange,
  Timer,
  BookOpen,
  BarChart3,
} from "lucide-react";

/** Product-structure highlights — not vanity metrics. */
const highlights = [
  {
    icon: Kanban,
    title: "Kanban board",
    line: "Move tasks across To do, In progress, and Done with drag-and-drop.",
  },
  {
    icon: Grid2x2,
    title: "Eisenhower matrix",
    line: "Sort work by urgency and importance in four clear quadrants.",
  },
  {
    icon: CalendarRange,
    title: "30-day habit grid",
    line: "See completion patterns and streaks at a glance.",
  },
  {
    icon: Timer,
    title: "Pomodoro & focus",
    line: "Time deep work, optional task links, and session history for today.",
  },
  {
    icon: BookOpen,
    title: "Journal",
    line: "Capture thoughts with mood, tags, and optional images.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    line: "Charts for habits, focus time, and weekly rhythm—your data, your pace.",
  },
];

export function StatsSection() {
  return (
    <section className="border-y border-white/5 bg-white/[0.02] py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">What you get in one workspace</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything below is part of LifeOS—organized so you can work without switching tools.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                className="rounded-xl border border-white/10 bg-card/40 p-5 text-left backdrop-blur-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.line}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
