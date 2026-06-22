"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/lib/hooks/useUser";
import { useJournal } from "@/lib/hooks/useJournal";
import { JournalEditor } from "@/components/journal/JournalEditor";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import type { JournalEntry } from "@/types";

export default function JournalDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { user } = useUser();
  const { getEntry, saveEntry } = useJournal(user?.id);
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await getEntry(id);
      if (cancelled) return;
      if (error || !data) setErr(error ?? "Not found");
      else setEntry(data);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id, getEntry]);

  if (loading || !user) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (err || !entry) {
    return <ErrorState message={err ?? "Entry not found"} />;
  }

  return (
    <div>
      <PageHeader title="Edit entry" />
      <JournalEditor
        entry={entry}
        onSave={async (p) => {
          const { error } = await saveEntry({
            id: entry.id,
            title: p.title,
            content: p.content,
            mood: p.mood,
            tags: p.tags,
            image_url: p.image_url,
            entry_date: p.entry_date,
          });
          return { error };
        }}
      />
    </div>
  );
}
