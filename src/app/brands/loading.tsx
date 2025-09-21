export default function LoadingBrands() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="h-8 w-40 bg-slate-200 rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl border border-slate-200 bg-white">
            <div className="aspect-[4/3] rounded-xl bg-slate-100 animate-pulse" />
            <div className="mt-3 h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}
