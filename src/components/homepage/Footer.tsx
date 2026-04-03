import Link from "next/link";

export function Footer() {
  return (
    <footer id="about" className="border-t border-white/10 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs text-primary-foreground">
              L
            </span>
            LifeOS
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Your calm command center for real work.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground" aria-label="Footer">
          <a href="https://github.com/abhinay-kumar-tippani/LifeOS" className="hover:text-foreground">
            GitHub
          </a>
          <Link href="/login" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/login" className="hover:text-foreground">
            Terms
          </Link>
          <a href="mailto:hello@lifeos.app" className="hover:text-foreground">
            Contact
          </a>
        </nav>
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} LifeOS. All rights reserved.
      </p>
    </footer>
  );
}
