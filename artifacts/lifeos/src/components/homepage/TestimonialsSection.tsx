
import { motion, useReducedMotion } from "framer-motion";

const testimonials = [
  {
    quote: "I've tried every productivity app out there. LifeOS is the first one where everything actually connects — my habits feed into my goals, my Pomodoros link to my tasks. It just makes sense.",
    name: "Aisha K.",
    role: "Product designer",
    initials: "AK",
    color: "from-indigo-500 to-violet-500",
  },
  {
    quote: "The Eisenhower matrix combined with Kanban is a game-changer. I spend 5 minutes every morning triaging my tasks and the rest of the day actually doing them.",
    name: "Marcus T.",
    role: "Software engineer",
    initials: "MT",
    color: "from-emerald-500 to-teal-500",
  },
  {
    quote: "The habit heatmap keeps me honest. Seeing that 30-day grid with all the gaps filled in is genuinely motivating in a way no other app has managed.",
    name: "Priya S.",
    role: "Graduate student",
    initials: "PS",
    color: "from-pink-500 to-rose-500",
  },
];

const stats = [
  { value: "7", label: "Modules in one dashboard" },
  { value: "∞", label: "Habits, tasks & goals" },
  { value: "0", label: "Dollars to get started" },
];

export function TestimonialsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Stats strip */}
        <div className="mb-20 grid grid-cols-3 gap-4 rounded-2xl border border-white/8 bg-white/[0.03] py-8 text-center">
          {stats.map((s) => (
            <div key={s.label} className="px-4">
              <p className="gradient-text text-4xl font-bold tabular-nums">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary/80">Loved by focused people</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What users are saying</h2>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: shouldReduceMotion ? 0 : i * 0.08, duration: shouldReduceMotion ? 0.05 : 0.4 }}
              className="group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-white/8 bg-card/30 p-6 shadow-lg backdrop-blur-md"
            >
              <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 [background:linear-gradient(135deg,rgba(99,102,241,0.12),transparent_40%,rgba(139,92,246,0.08))]" />

              {/* Quote */}
              <div className="relative">
                <svg className="mb-3 h-6 w-6 text-primary/40" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-sm leading-relaxed text-muted-foreground">{t.quote}</p>
              </div>

              {/* Author */}
              <div className="relative mt-auto flex items-center gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-xs font-bold text-white shadow`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
