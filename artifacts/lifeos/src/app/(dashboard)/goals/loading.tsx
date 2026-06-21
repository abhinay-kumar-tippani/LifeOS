export default function GoalsLoading() {
  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-pulse">
      {/* HEADER */}
      <div className="mb-8">
        <div className="h-8 w-32 bg-gray-800 rounded mb-2"></div>
        <div className="h-4 w-64 bg-gray-800/50 rounded"></div>
      </div>

      <div className="flex flex-col gap-8 pb-20">
        {/* SECTION 1: MAIN GOAL */}
        <section>
          <div className="h-64 rounded-2xl bg-gray-800/50 w-full"></div>
        </section>

        {/* SECTION 2: MONTHLY GOALS */}
        <section>
          <div className="mb-4">
            <div className="h-6 w-40 bg-gray-800 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 rounded-xl bg-gray-800/50"></div>
            <div className="h-32 rounded-xl bg-gray-800/50"></div>
          </div>
        </section>

        {/* SECTION 3: WEEKLY GOALS */}
        <section>
          <div className="mb-4 mt-8">
            <div className="h-6 w-40 bg-gray-800 rounded"></div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-12 rounded-lg bg-gray-800/50"></div>
            <div className="h-12 rounded-lg bg-gray-800/50"></div>
            <div className="h-12 rounded-lg bg-gray-800/50"></div>
          </div>
        </section>
      </div>
    </div>
  );
}
