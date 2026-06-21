import type { ReactNode } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description?: string;
  action?: { label: string; onClick?: () => void; href?: string };
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-border/50 bg-gradient-to-b from-card/60 to-card/20 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-inner">
          {icon ?? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7 opacity-80"
              aria-hidden
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <path d="M14 17.5h7M17.5 14v7" />
            </svg>
          )}
        </div>
      </div>

      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
      {action ? (
        <div className="mt-6">
          {action.href ? (
            <Button size="sm" className="shadow-md shadow-primary/20" asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button size="sm" className="shadow-md shadow-primary/20" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function EmptyStateSlot({ children }: { children: ReactNode }) {
  return <div className="text-muted-foreground">{children}</div>;
}
