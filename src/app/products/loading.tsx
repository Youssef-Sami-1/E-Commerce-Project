export default function LoadingProducts() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="h-8 w-40 bg-slate-200 rounded mb-6 animate-pulse" />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl border border-slate-200 bg-white">
            <div className="aspect-square rounded-xl bg-slate-100 animate-pulse" />
            <div className="mt-3 space-y-2">
              <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-1/3 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="mt-3 h-9 bg-slate-200 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}
