
import { Link } from "wouter";
import { useMemo, useState } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { useJournal } from "@/lib/hooks/useJournal";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JournalCard } from "@/components/journal/JournalCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";

const PAGE_SIZE = 20;

const MOODS = ["happy", "neutral", "sad", "stressed", "energized"] as const;
const moodLabels: Record<string, string> = {
  happy: "😊 Happy",
  neutral: "😐 Neutral",
  sad: "😔 Sad",
  stressed: "😤 Stressed",
  energized: "⚡ Energized",
};

export default function JournalListPage() {
  const { user } = useUser();
  const { entries, loading, error, removeEntry } = useJournal(user?.id);
  const [query, setQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const e of entries) {
      (e.tags ?? []).forEach((t) => set.add(t));
    }
    return Array.from(set).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (moodFilter && e.mood !== moodFilter) return false;
      if (tagFilter && !(e.tags ?? []).includes(tagFilter)) return false;
      if (!q) return true;
      const hay = `${e.title ?? ""} ${e.content} ${(e.tags ?? []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [entries, query, moodFilter, tagFilter]);

  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  async function handleDelete(id: string) {
    const { error } = await removeEntry(id);
    if (error) toast.error(error);
  }

  const shown = filtered.slice(0, visible);
  const hasMore = filtered.length > visible;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Journal"
        description="Reflect with mood, tags, and images."
        action={
          <Button asChild aria-label="New journal entry">
            <Link href="/journal/new">
              <Plus className="h-4 w-4" aria-hidden />
              New entry
            </Link>
          </Button>
        }
      />

      {entries.length === 0 ? (
        <EmptyState
          title="No entries yet"
          description="Capture wins, lessons, and how you felt today."
          action={{ label: "New entry", onClick: () => (window.location.href = "/journal/new") }}
        />
      ) : (
        <>
          {/* Search + filter bar */}
          <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/40 p-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search entries by title, content, or tag…"
                aria-label="Search journal entries"
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setMoodFilter(null)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  !moodFilter
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground hover:border-border"
                }`}
                aria-pressed={!moodFilter}
              >
                All moods
              </button>
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMoodFilter(moodFilter === m ? null : m)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    moodFilter === m
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 text-muted-foreground hover:border-border"
                  }`}
                  aria-pressed={moodFilter === m}
                >
                  {moodLabels[m]}
                </button>
              ))}
            </div>
          </div>

          {allTags.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-muted-foreground">Tags:</span>
              <button
                onClick={() => setTagFilter(null)}
                className={`rounded-full border px-2.5 py-0.5 transition ${
                  !tagFilter
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground hover:border-border"
                }`}
                aria-pressed={!tagFilter}
              >
                All
              </button>
              {allTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTagFilter(tagFilter === t ? null : t)}
                  className={`rounded-full border px-2.5 py-0.5 transition ${
                    tagFilter === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 text-muted-foreground hover:border-border"
                  }`}
                  aria-pressed={tagFilter === t}
                >
                  #{t}
                </button>
              ))}
            </div>
          ) : null}

          {filtered.length === 0 ? (
            <EmptyState
              title="No matches"
              description="Try a different search term or clear filters."
              action={{ label: "Clear filters", onClick: () => { setQuery(""); setMoodFilter(null); setTagFilter(null); } }}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((e) => (
                <JournalCard key={e.id} entry={e} onDelete={handleDelete} />
              ))}
            </div>
          )}

          {hasMore ? (
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Load more ({filtered.length - visible} remaining)
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}