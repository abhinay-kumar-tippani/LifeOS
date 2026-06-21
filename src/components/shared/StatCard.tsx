import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export function StatCard({
  label,
  value,
  hint,
  hintClassName,
  icon,
  action,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  hintClassName?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border-border/60 bg-card/60 backdrop-blur-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        {icon ? <div className="text-primary">{icon}</div> : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
        {(hint || action) ? (
          <div className="mt-1 flex items-center gap-1.5">
            {hint ? (
              <p className={cn("text-xs text-muted-foreground", hintClassName)}>{hint}</p>
            ) : null}
            {action}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
