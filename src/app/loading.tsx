export default function RootLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="h-[56vh] w-full rounded-3xl bg-slate-200/60 animate-pulse" />
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl border border-slate-200 bg-white">
            <div className="aspect-[4/3] rounded-xl bg-slate-200/70 animate-pulse" />
            <div className="h-4 mt-3 w-3/4 rounded bg-slate-200/70 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="mt-10 h-10 w-40 rounded-full bg-slate-200/70 animate-pulse" />
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl border border-slate-200 bg-white">
            <div className="aspect-[4/3] rounded-xl bg-slate-200/70 animate-pulse" />
            <div className="h-4 mt-3 w-3/4 rounded bg-slate-200/70 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
