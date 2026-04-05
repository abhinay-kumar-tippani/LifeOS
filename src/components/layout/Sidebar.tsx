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
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import { usePomodoroStore } from "@/lib/stores/pomodoroStore";
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

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/habits", label: "Habits", icon: CheckSquare },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/pomodoro", label: "Pomodoro", icon: Timer },
  { href: "/tasks", label: "Tasks", icon: Kanban },
  { href: "/matrix", label: "Matrix", icon: Grid2x2 },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
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
  const { profile } = useUser();
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

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-full flex-col border-r border-border/60 bg-sidebar/80 backdrop-blur-md transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
          className
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
                "font-bold text-2xl tracking-tight transition-opacity duration-200 whitespace-nowrap",
                collapsed ? "opacity-0" : "opacity-100"
              )}
            >
              LifeOS
            </span>
          </div>

          {/* TOGGLE BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-4 top-1/2 -translate-y-1/2 hidden h-10 w-10 rounded-full border border-border bg-background sm:flex z-20 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* NAV */}
        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="flex flex-col gap-1" aria-label="Dashboard">
            {nav.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              const navItem = (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer",
                    collapsed && "justify-center",
                    active
                      ? "bg-indigo-600/20 text-indigo-400 font-medium border-l-2 border-indigo-500"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span
                    className={cn(
                      "truncate transition-opacity duration-200",
                      collapsed ? "hidden" : "opacity-100"
                    )}
                  >
                    {item.label}
                  </span>
                  {item.href === "/pomodoro" && isRunning && (
                    <span className="ml-auto flex items-center gap-1 text-xs text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}
                    </span>
                  )}
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
          </nav>
        </ScrollArea>

        {/* FOOTER */}
        <div className="border-t border-border/60 p-3">
          {collapsed ? (
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={profile?.avatar_url ?? undefined} />
                <AvatarFallback>
                  {(profile?.full_name ?? profile?.email ?? "?")
                    .slice(0, 1)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={logout}>
                    <LogOut className="h-5 w-5 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="z-50">
                  Logout
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center gap-3 rounded-lg px-2 py-1">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={profile?.avatar_url ?? undefined} />
                  <AvatarFallback>
                    {(profile?.full_name ?? profile?.email ?? "?")
                      .slice(0, 1)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-gray-200">
                    {profile?.full_name ?? "You"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {profile?.email}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}