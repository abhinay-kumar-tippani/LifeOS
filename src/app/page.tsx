import { Navbar } from "@/components/homepage/Navbar";
import { HeroSection } from "@/components/homepage/HeroSection";
import { StatsSection } from "@/components/homepage/StatsSection";
import { FeatureSection } from "@/components/homepage/FeatureSection";
import { CTASection } from "@/components/homepage/CTASection";
import { Footer } from "@/components/homepage/Footer";

const tags = ["Habits", "Tasks", "Focus", "Journal", "Analytics", "Matrix"];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-foreground dark">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-wrap justify-center gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <section id="about" className="mx-auto max-w-4xl px-4 pb-10 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            One dashboard for how you actually work
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            LifeOS brings habits, Kanban tasks, Eisenhower planning, Pomodoro focus, and journaling together so you
            spend less time context-switching and more time making progress.
          </p>
        </section>
        <FeatureSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
