"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  categories: Array<{ _id: string; name: string }>;
  brands: Array<{ _id: string; name: string }>;
  category?: string;
  brand?: string;
  sort?: string;
  limit?: number;
  q?: string;
};

export default function ProductsFiltersClient({ categories, brands, category, brand, sort, limit = 12, q }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const [open, setOpen] = useState<"sort" | "filter" | null>(null);
  const [mounted, setMounted] = useState(false);

  // no body scroll lock to avoid layout shifts; panel floats over content
  useEffect(() => { setMounted(true); }, []);

  const buildQuery = (patch: Record<string, string | undefined>) => {
    const params = new URLSearchParams(sp.toString());
    if (patch.category !== undefined) {
      if (patch.category) params.set("category", patch.category); else params.delete("category");
    }
    if (patch.brand !== undefined) {
      if (patch.brand) params.set("brand", patch.brand); else params.delete("brand");
    }
    if (patch.sort !== undefined) {
      if (patch.sort) params.set("sort", patch.sort); else params.delete("sort");
    }
    if (q) params.set("q", q);
    params.set("page", "1");
    params.set("limit", String(limit));
    return `/products?${params.toString()}`;
  };

  const applyAndClose = (patch: Record<string, string | undefined>) => {
    setOpen(null);
    router.push(buildQuery(patch));
  };

  return (
    <>
      <div className="md:hidden relative flex items-center gap-2">
        {(() => {
          const sortActive = Boolean(sort);
          const filterCount = (category ? 1 : 0) + (brand ? 1 : 0);
          const filterActive = filterCount > 0;
          return (
            <>
              <button
                type="button"
                aria-pressed={sortActive}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm ${sortActive ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 bg-white/80'}`}
                onClick={() => setOpen("sort")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7h16M7 12h10M10 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                Sort
                {sortActive && (<span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-white/90" />)}
              </button>
              <button
                type="button"
                aria-pressed={filterActive}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm ${filterActive ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 bg-white/80'}`}
                onClick={() => setOpen("filter")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16l-6 7v5l-4 2v-7L4 6z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Filter
                {filterActive && (
                  <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[11px] bg-white/90 text-slate-900">{filterCount}</span>
                )}
              </button>
            </>
          );
        })()}
      </div>

      {/* Mobile dropdown (portal to body, high z-index, no dim background) */}
      {open && mounted && createPortal(
        (
          <div className="md:hidden">
            <div className="fixed left-3 right-3 top-24 z-[10000] rounded-2xl border border-slate-200 bg-white shadow-2xl p-4 animate-fade-in">
              <div className="max-h-[70vh] overflow-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold">{open === 'sort' ? 'Sort' : 'Filter'}</h3>
                  <button className="rounded-full px-3 py-1 text-sm hover:bg-slate-100" onClick={() => setOpen(null)} aria-label="Close">Close</button>
                </div>
                {open === 'sort' ? (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {[
                      { label: 'Default', value: undefined },
                      { label: 'Price: Low to High', value: 'price' },
                      { label: 'Price: High to Low', value: '-price' },
                      { label: 'Most Popular', value: '-sold' },
                      { label: 'Newest', value: '-createdAt' },
                    ].map((s) => (
                      <button key={s.label} className={`px-3 py-2 rounded-full border text-sm ${sort === s.value ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 bg-white hover:shadow-sm'}`} onClick={() => applyAndClose({ sort: s.value })}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Categories</div>
                      <div className="grid grid-cols-2 gap-2 max-h-56 overflow-auto">
                        <button className={`px-3 py-2 rounded-full border text-sm ${!category ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 bg-white hover:shadow-sm'}`} onClick={() => applyAndClose({ category: undefined })}>All</button>
                        {categories.map((c) => (
                          <button key={c._id} className={`px-3 py-2 rounded-full border text-sm ${category === c._id ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 bg-white hover:shadow-sm'}`} onClick={() => applyAndClose({ category: c._id })}>
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Brands</div>
                      <div className="grid grid-cols-2 gap-2 max-h-56 overflow-auto">
                        <button className={`px-3 py-2 rounded-full border text-sm ${!brand ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 bg-white hover:shadow-sm'}`} onClick={() => applyAndClose({ brand: undefined })}>All</button>
                        {brands.map((b) => (
                          <button key={b._id} className={`px-3 py-2 rounded-full border text-sm ${brand === b._id ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 bg-white hover:shadow-sm'}`} onClick={() => applyAndClose({ brand: b._id })}>
                            {b.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="h-2" />
              </div>
            </div>
          </div>
        ),
        document.body
      )}
    </>
  );
}
