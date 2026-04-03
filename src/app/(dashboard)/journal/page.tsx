"use client";

import Link from "next/link";
import { useUser } from "@/lib/hooks/useUser";
import { useJournal } from "@/lib/hooks/useJournal";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { JournalCard } from "@/components/journal/JournalCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function JournalListPage() {
  const { user } = useUser();
  const { entries, loading, error } = useJournal(user?.id);

  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Journal"
        description="Reflect with mood, tags, and images."
        action={
          <Button asChild aria-label="New journal entry">
            <Link href="/journal/new">New Entry</Link>
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((e) => (
            <JournalCard key={e.id} entry={e} />
          ))}
        </div>
      )}
    </div>
  );
}
