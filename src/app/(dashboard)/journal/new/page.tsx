"use client";

import { useUser } from "@/lib/hooks/useUser";
import { useJournal } from "@/lib/hooks/useJournal";
import { JournalEditor } from "@/components/journal/JournalEditor";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function NewJournalPage() {
  const { user } = useUser();
  const { saveEntry } = useJournal(user?.id);

  if (!user) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="New entry" description="Draft auto-saves locally until you publish." />
      <JournalEditor
        entry={null}
        onSave={async (p) => {
          const { error } = await saveEntry({
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
