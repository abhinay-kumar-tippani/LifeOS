"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Timer,
  Kanban,
  Grid2x2,
  BarChart2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Target,
  Command,
  Flame,
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import { useHabits } from "@/lib/hooks/useHabits";
import { usePomodoroStore } from "@/lib/stores/pomodoroStore";
import { todayISODate } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { openCommandPalette } from "./CommandPalette";

const sections: { label: string; items: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] }[] = [
  {
    label: "Home",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Plan",
    items: [
      { href: "/tasks", label: "Tasks", icon: Kanban },
      { href: "/matrix", label: "Matrix", icon: Grid2x2 },
      { href: "/goals", label: "Goals", icon: Target },
    ],
  },
  {
    label: "Track",
    items: [
      { href: "/habits", label: "Habits", icon: CheckSquare },
      { href: "/journal", label: "Journal", icon: BookOpen },
      { href: "/analytics", label: "Analytics", icon: BarChart2 },
    ],
  },
  {
    label: "Focus",
    items: [
      { href: "/pomodoro", label: "Pomodoro", icon: Timer },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useUser();
  const { habits, completions } = useHabits(user?.id);
  const supabase = getSupabaseClient();
  const { isRunning, timeLeft } = usePomodoroStore();

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
    onNavigate?.();
  }

  const today = todayISODate();
  const doneToday = completions.filter((c) => c.completed_date.slice(0, 10) === today).length;
  const totalToday = habits.length;
  const habitsBadge = totalToday > 0 ? `${doneToday}/${totalToday}` : null;

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-full flex-col border-r border-border/60 bg-sidebar/80 backdrop-blur-md transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
          className,
        )}
      >
        {/* HEADER */}
        <div className="relative flex h-16 shrink-0 items-center border-b border-border/60 px-4 pr-12">
          <div className="flex items-center gap-2 overflow-hidden">
            <Image
              src="/logo.svg"
              alt="LifeOS"
              width={36}
              height={36}
              className="h-10 w-10 shrink-0 rounded-lg object-cover"
            />
            <span
              className={cn(
                "text-2xl font-bold tracking-tight transition-opacity duration-200 whitespace-nowrap",
                collapsed ? "opacity-0" : "opacity-100",
              )}
            >
              LifeOS
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 cursor-pointer rounded-full border border-border bg-background transition-transform hover:scale-105 sm:flex"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        {/* NAV */}
        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="flex flex-col gap-4" aria-label="Dashboard">
            {sections.map((section) => (
              <div key={section.label} className="flex flex-col gap-1">
                {!collapsed ? (
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.label}
                  </p>
                ) : (
                  <div className="my-1 h-px bg-border/40" aria-hidden />
                )}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const navItem = (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group/item flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer",
                        collapsed && "justify-center",
                        active
                          ? "bg-primary/15 text-primary font-medium border-l-2 border-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                      <span
                        className={cn(
                          "flex-1 truncate transition-opacity duration-200",
                          collapsed ? "hidden" : "opacity-100",
                        )}
                      >
                        {item.label}
                      </span>
                      {!collapsed && item.href === "/habits" && habitsBadge ? (
                        <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                          {habitsBadge}
                        </span>
                      ) : null}
                      {!collapsed && item.href === "/pomodoro" && isRunning ? (
                        <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-500">
                          <Flame className="h-3 w-3 animate-pulse" aria-hidden />
                          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                        </span>
                      ) : null}
                    </Link>
                  );
                  if (collapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                        <TooltipContent side="right" className="z-50">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }
                  return navItem;
                })}
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* FOOTER */}
        <div className="border-t border-border/60 p-3">
          {!collapsed ? (
            <Button
              variant="outline"
              size="sm"
              className="mb-2 w-full justify-start gap-2 text-muted-foreground"
              onClick={openCommandPalette}
              aria-label="Open command palette"
            >
              <Command className="h-4 w-4" aria-hidden />
              Quick actions
              <kbd className="ml-auto rounded border border-border bg-muted px-1.5 font-mono text-[10px]">⌘K</kbd>
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mb-2 w-full"
                  onClick={openCommandPalette}
                  aria-label="Open command palette"
                >
                  <Command className="h-4 w-4" aria-hidden />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="z-50">
                Quick actions ⌘K
              </TooltipContent>
            </Tooltip>
          )}

          {collapsed ? (
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={profile?.avatar_url ?? undefined} alt="" />
                <AvatarFallback>
                  {(profile?.full_name ?? profile?.email ?? "?").slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
                    <LogOut className="h-5 w-5" aria-hidden />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="z-50">
                  Logout
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <>
              <div className="mb-2 flex items-center gap-3 rounded-lg px-2 py-1">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={profile?.avatar_url ?? undefined} alt="" />
                  <AvatarFallback>
                    {(profile?.full_name ?? profile?.email ?? "?").slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium">{profile?.full_name ?? "You"}</p>
                  <p className="truncate text-xs text-muted-foreground">{profile?.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={logout}
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Logout
              </Button>
            </>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}