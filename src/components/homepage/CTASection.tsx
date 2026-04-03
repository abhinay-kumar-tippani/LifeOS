"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section id="cta" className="pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/15 via-[#0a0a0f] to-[#0a0a0f] p-10 text-center shadow-[0_0_60px_-24px_rgba(99,102,241,0.45)] sm:p-14"
        >
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Start organizing your day</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Create a free account and use habits, tasks, focus timers, and journal in one place. No clutter—just
            the tools you need to stay consistent.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button size="lg" className="shadow-lg shadow-primary/25" asChild>
              <Link href="/signup">Get started</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/15 bg-transparent" asChild>
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
