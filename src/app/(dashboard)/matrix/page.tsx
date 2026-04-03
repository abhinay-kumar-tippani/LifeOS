"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { EisenhowerGrid } from "@/components/matrix/EisenhowerGrid";
import { useUser } from "@/lib/hooks/useUser";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function MatrixPage() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Eisenhower Matrix"
        description="Drag between quadrants. Tasks stay linked to your Kanban statuses."
      />
      <EisenhowerGrid userId={user.id} />
    </div>
  );
}
