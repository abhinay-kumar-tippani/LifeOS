"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const FAQ = [
  {
    q: "Is LifeOS really free?",
    a: "Yes — 100% free, forever. No trial, no pricing tier, no paywall. We believe productivity tools should be accessible to everyone.",
  },
  {
    q: "Where is my data stored?",
    a: "Your data lives in a secure Postgres database managed by Supabase, with row-level security so only you can see it. We never sell or share your data.",
  },
  {
    q: "Can I export or delete my data?",
    a: "Both. Go to Settings → Your data to download a JSON export of everything in your account. To permanently delete your account and all data, go to Settings → Account.",
  },
  {
    q: "What makes LifeOS different from other productivity apps?",
    a: "Most apps focus on one thing — tasks, habits, or journaling. LifeOS combines habits, Kanban tasks, Eisenhower matrix planning, Pomodoro focus sessions, journaling, and analytics into one cohesive dashboard. No tab-switching, no integrations to set up.",
  },
  {
    q: "Do you have a mobile app?",
    a: "LifeOS is a responsive web app that works on phones, tablets, and desktops. The mobile habit tracker is optimized for one-tap daily check-ins. A dedicated PWA install is on the roadmap.",
  },
  {
    q: "Is LifeOS open source?",
    a: "The codebase is public on GitHub. We welcome feedback and contributions — see the link in the footer.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          Everything you need to know before you sign up.
        </p>
      </div>
      <ul className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-card/40">
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <li key={item.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
              >
                <span className="text-base font-medium text-foreground">{item.q}</span>
                <ChevronDown
                  className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")}
                  aria-hidden
                />
              </button>
              {isOpen ? (
                <div id={`faq-panel-${i}`} className="px-5 pb-5 text-sm text-muted-foreground">
                  {item.a}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}