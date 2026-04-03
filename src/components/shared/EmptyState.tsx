import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-border/60 bg-card/40 px-6 py-14 text-center",
        className,
      )}
    >
      <Inbox className="mb-3 h-10 w-10 text-muted-foreground" aria-hidden />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? (
        <Button className="mt-6" onClick={action.onClick} aria-label={action.label}>
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyStateSlot({ children }: { children: ReactNode }) {
  return <div className="text-muted-foreground">{children}</div>;
}
