"use client";

import Link from "next/link";
import { Navbar } from "@/components/homepage/Navbar";
import { Footer } from "@/components/homepage/Footer";


export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to home
        </Link>
        <h1 className="mt-8 text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: June 21, 2026</p>

        <div className="prose prose-invert mt-10 max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">Acceptance</h2>
            <p className="mt-2">
              By creating an account or using LifeOS, you agree to these Terms of Service. If you do not agree, do not
              use the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">The service</h2>
            <p className="mt-2">
              LifeOS is a personal productivity platform providing habit tracking, task management, focus timers,
              journaling, and analytics. The service is provided &quot;as is&quot; during its current beta period. Features
              may change, be added, or be removed without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Your account</h2>
            <p className="mt-2">
              You are responsible for maintaining the security of your account credentials. You must provide accurate
              information when registering. One person may not maintain more than one account for abusive purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Acceptable use</h2>
            <p className="mt-2">
              You may not use LifeOS to store or transmit illegal content, attempt to gain unauthorized access to our
              systems, or interfere with other users&apos; access to the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Your content</h2>
            <p className="mt-2">
              You retain ownership of the content you create in LifeOS. By using the service, you grant us the limited
              rights necessary to store, display, and process your content solely to provide the service to you.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Limitation of liability</h2>
            <p className="mt-2">
              LifeOS is a personal productivity tool, not professional advice. We are not liable for any loss of data,
              missed deadlines, or productivity outcomes resulting from use of the service. To the maximum extent
              permitted by law, our liability is limited to the amount you paid us in the past 12 months (currently $0
              for free accounts).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Contact</h2>
            <p className="mt-2">
              Questions about these terms? Email{" "}
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
