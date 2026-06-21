import Link from "next/link";
import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";

export const metadata = {
  title: "Privacy Policy — LifeOS",
  description: "How LifeOS collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to home
        </Link>
        <h1 className="mt-8 text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: June 21, 2026</p>

        <div className="prose prose-invert mt-10 max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">What we collect</h2>
            <p className="mt-2">
              When you create an account, we store your email address and profile information (name, avatar). As you
              use LifeOS, we store the content you create: habits, journal entries, tasks, goals, and Pomodoro session
              history. This data is stored in our database (Supabase) and is associated with your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">How we use your data</h2>
            <p className="mt-2">
              Your data powers the LifeOS dashboard — habit tracking, analytics, task boards, and focus sessions. We do
              not sell your personal data. We do not use your journal entries or habits for advertising.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Third-party services</h2>
            <p className="mt-2">
              LifeOS uses Supabase for authentication and data storage, and Cloudinary for image uploads (journal
              attachments and profile avatars). These providers process data on our behalf under their own privacy
              policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Data retention & deletion</h2>
            <p className="mt-2">
              Your data is retained while your account is active. You can delete your account at any time from Settings
              → Account. Deletion permanently removes your profile, habits, journal entries, tasks, and session
              history.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Local preferences</h2>
            <p className="mt-2">
              Some settings (such as default Pomodoro duration and sidebar collapse state) are stored in your browser
              localStorage and are not synced to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Contact</h2>
            <p className="mt-2">
              Questions about this policy? Email{" "}
              <a href="mailto:hello@lifeos.app" className="text-primary hover:underline">
                hello@lifeos.app
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
