import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function ErrorState({
  message,
  onRetry,
  className,
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-6 py-10 text-center",
        className,
      )}
    >
      <AlertCircle className="h-9 w-9 text-destructive" aria-hidden />
      <p className="text-sm text-destructive-foreground">{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry} aria-label="Retry loading">
          Retry
        </Button>
      ) : null}
    </div>
  );
}
