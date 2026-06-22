"use client";


import { motion, useReducedMotion } from "framer-motion";
import { LayoutDashboard, Flame, Timer, Kanban, BookOpen, BarChart2, Target, Grid2x2 } from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Daily overview",
    body: "See habits, Pomodoros, priority tasks, and journal snippets — all before your first coffee.",
    color: "from-indigo-500/20 to-violet-500/10",
    accent: "text-indigo-400",
    ring: "ring-indigo-500/20 bg-indigo-500/10",
  },
  {
    icon: Flame,
    title: "Habit tracking",
    body: "Build streaks with daily check-ins. A 30-day heatmap keeps momentum visible so you never lose the chain.",
    color: "from-orange-500/20 to-amber-500/10",
    accent: "text-orange-400",
    ring: "ring-orange-500/20 bg-orange-500/10",
  },
  {
    icon: Timer,
    title: "Pomodoro focus",
    body: "25-minute focus blocks with optional task links, break reminders, and a daily session log.",
    color: "from-emerald-500/20 to-teal-500/10",
    accent: "text-emerald-400",
    ring: "ring-emerald-500/20 bg-emerald-500/10",
  },
  {
    icon: Kanban,
    title: "Task kanban",
    body: "Drag tasks through To-do, In-progress, and Done columns. Full priority, due-date, and label support.",
    color: "from-blue-500/20 to-cyan-500/10",
    accent: "text-blue-400",
    ring: "ring-blue-500/20 bg-blue-500/10",
  },
  {
    icon: Grid2x2,
    title: "Eisenhower matrix",
    body: "Sort tasks by urgency and importance so you tackle the right things instead of just the loud ones.",
    color: "from-violet-500/20 to-purple-500/10",
    accent: "text-violet-400",
    ring: "ring-violet-500/20 bg-violet-500/10",
  },
  {
    icon: Target,
    title: "Goal hierarchy",
    body: "Link yearly goals to monthly milestones to weekly focus — so every task has a reason behind it.",
    color: "from-pink-500/20 to-rose-500/10",
    accent: "text-pink-400",
    ring: "ring-pink-500/20 bg-pink-500/10",
  },
  {
    icon: BookOpen,
    title: "Journaling",
    body: "Write daily reflections with mood tracking, image uploads, and a searchable entry timeline.",
    color: "from-amber-500/20 to-yellow-500/10",
    accent: "text-amber-400",
    ring: "ring-amber-500/20 bg-amber-500/10",
  },
  {
    icon: BarChart2,
    title: "Analytics",
    body: "Habit completion trends, focus-time charts, and task velocity — everything measured so you can improve.",
    color: "from-cyan-500/20 to-sky-500/10",
    accent: "text-cyan-400",
    ring: "ring-cyan-500/20 bg-cyan-500/10",
  },
];

export function FeatureSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary/80">Everything in one place</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Every tool a high-performer needs
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built for people who want structure without noise — students, professionals, and anyone building better routines.
          </p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: shouldReduceMotion ? 0 : i * 0.06, duration: shouldReduceMotion ? 0.05 : 0.4 }}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-card/30 p-5 shadow-lg backdrop-blur-md"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 transition duration-300 group-hover:opacity-100`}
                />
                <div className="relative">
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${f.ring} ${f.accent}`}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{f.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
