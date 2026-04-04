"use client";

import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { useUser } from "@/lib/hooks/useUser";
import { MobileNav } from "./MobileNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/habits": "Habits",
  "/journal": "Journal",
  "/pomodoro": "Pomodoro",
  "/tasks": "Kanban",
  "/matrix": "Eisenhower Matrix",
      "/analytics": "Analytics",
  "/settings": "Settings",
};

function titleFromPath(path: string) {
  if (path.startsWith("/journal/")) return "Journal";
  for (const [k, v] of Object.entries(titles)) {
    if (path === k || path.startsWith(`${k}/`)) return v;
  }
  return "LifeOS";
}

export function TopBar() {
  const pathname = usePathname();
  const { profile } = useUser();
  const router = useRouter();
  const supabase = getSupabaseClient();
  const title = titleFromPath(pathname);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 bg-sidebar/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div>
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-gray-400 sm:inline">
          Today, {format(new Date(), "EEEE, MMMM d, yyyy")}
        </span>
        <Separator orientation="vertical" className="hidden h-6 sm:block" />
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" aria-label="User menu">
            <Avatar className="h-9 w-9">
              <AvatarImage src={profile?.avatar_url ?? undefined} alt="" />
              <AvatarFallback>
                {(profile?.full_name ?? profile?.email ?? "?").slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/settings")}>Profile & settings</DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
