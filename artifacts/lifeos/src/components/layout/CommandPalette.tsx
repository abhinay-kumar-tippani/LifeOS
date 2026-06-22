"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  ListChecks,
  Target,
  Timer,
  BarChart3,
  BookOpen,
  Settings,
  Plus,
  Play,
} from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { useUser } from "@/lib/hooks/useUser";
import { useHabits } from "@/lib/hooks/useHabits";
import { useTasks } from "@/lib/hooks/useTasks";
import { useJournal } from "@/lib/hooks/useJournal";

type Action = {
  id: string;
  label: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
  keywords?: string[];
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { habits } = useHabits(user?.id);
  const { tasks } = useTasks(user?.id);
  const { entries } = useJournal(user?.id);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    function onCustom() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("lifeos:open-command-palette", onCustom as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("lifeos:open-command-palette", onCustom as EventListener);
    };
  }, []);

  const go = useCallback(
    (path: string) => {
      setOpen(false);
      router.push(path);
    },
    [router],
  );

  const navItems: Action[] = useMemo(
    () => [
      { id: "nav-dashboard", label: "Dashboard", group: "Navigate", icon: Home, onSelect: () => go("/dashboard") },
      { id: "nav-habits", label: "Habits", group: "Navigate", icon: ListChecks, onSelect: () => go("/habits") },
      { id: "nav-tasks", label: "Tasks", group: "Navigate", icon: Plus, onSelect: () => go("/tasks") },
      { id: "nav-matrix", label: "Matrix", group: "Navigate", icon: Target, onSelect: () => go("/matrix") },
      { id: "nav-goals", label: "Goals", group: "Navigate", icon: Target, onSelect: () => go("/goals") },
      { id: "nav-journal", label: "Journal", group: "Navigate", icon: BookOpen, onSelect: () => go("/journal") },
      { id: "nav-pomodoro", label: "Pomodoro", group: "Navigate", icon: Timer, onSelect: () => go("/pomodoro") },
      { id: "nav-analytics", label: "Analytics", group: "Navigate", icon: BarChart3, onSelect: () => go("/analytics") },
      { id: "nav-settings", label: "Settings", group: "Navigate", icon: Settings, onSelect: () => go("/settings") },
    ],
    [go],
  );

  const actionItems: Action[] = useMemo(
    () => [
      {
        id: "act-task",
        label: "Quick add: task",
        group: "Create",
        icon: Plus,
        onSelect: () => go("/tasks"),
        keywords: ["todo", "new task"],
      },
      {
        id: "act-habit",
        label: "Quick add: habit",
        group: "Create",
        icon: Plus,
        onSelect: () => go("/habits"),
      },
      {
        id: "act-journal",
        label: "New journal entry",
        group: "Create",
        icon: Plus,
        onSelect: () => go("/journal/new"),
        keywords: ["write", "reflect"],
      },
      {
        id: "act-pomodoro",
        label: "Start a Pomodoro session",
        group: "Focus",
        icon: Play,
        onSelect: () => go("/pomodoro"),
        keywords: ["focus", "timer"],
      },
    ],
    [go],
  );

  const habitItems: Action[] = useMemo(
    () =>
      habits.map((h) => ({
        id: `habit-${h.id}`,
        label: h.name,
        group: "Habits",
        icon: ListChecks,
        onSelect: () => go("/habits"),
        keywords: ["habit", "track"],
      })),
    [habits, go],
  );

  const taskItems: Action[] = useMemo(
    () =>
      tasks
        .filter((t) => t.status !== "done")
        .slice(0, 8)
        .map((t) => ({
          id: `task-${t.id}`,
          label: t.title,
          group: "Tasks",
          icon: Plus,
          onSelect: () => go("/tasks"),
          keywords: ["task", t.priority],
        })),
    [tasks, go],
  );

  const journalItems: Action[] = useMemo(
    () =>
      entries.slice(0, 5).map((e) => ({
        id: `journal-${e.id}`,
        label: e.title || "Untitled entry",
        group: "Journal",
        icon: BookOpen,
        onSelect: () => go(`/journal/${e.id}`),
        keywords: ["journal", "entry", e.mood ?? ""],
      })),
    [entries, go],
  );

  const all = [...navItems, ...actionItems, ...habitItems, ...taskItems, ...journalItems];
  void all;

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command palette" description="Jump to a page or create something new">
      <CommandInput placeholder="Type a command or search…" autoFocus />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {navItems.map((a) => {
            const Icon = a.icon;
            return (
              <CommandItem key={a.id} value={a.label} onSelect={a.onSelect}>
                <Icon className="h-4 w-4" aria-hidden />
                {a.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Create &amp; focus">
          {actionItems.map((a) => {
            const Icon = a.icon;
            return (
              <CommandItem key={a.id} value={`${a.label} ${a.keywords?.join(" ") ?? ""}`} onSelect={a.onSelect}>
                <Icon className="h-4 w-4" aria-hidden />
                {a.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
        {habitItems.length > 0 ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="Habits">
              {habitItems.map((a) => {
                const Icon = a.icon;
                return (
                  <CommandItem key={a.id} value={`${a.label} ${a.keywords?.join(" ") ?? ""}`} onSelect={a.onSelect}>
                    <Icon className="h-4 w-4" aria-hidden />
                    {a.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        ) : null}
        {taskItems.length > 0 ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="Open tasks">
              {taskItems.map((a) => {
                const Icon = a.icon;
                return (
                  <CommandItem key={a.id} value={`${a.label} ${a.keywords?.join(" ") ?? ""}`} onSelect={a.onSelect}>
                    <Icon className="h-4 w-4" aria-hidden />
                    {a.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        ) : null}
        {journalItems.length > 0 ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent journal entries">
              {journalItems.map((a) => {
                const Icon = a.icon;
                return (
                  <CommandItem key={a.id} value={`${a.label} ${a.keywords?.join(" ") ?? ""}`} onSelect={a.onSelect}>
                    <Icon className="h-4 w-4" aria-hidden />
                    {a.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}

export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent("lifeos:open-command-palette"));
}
