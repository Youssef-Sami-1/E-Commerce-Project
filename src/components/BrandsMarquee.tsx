import Image from 'next/image';
import Link from 'next/link';

export default function BrandsMarquee({ brands }: { brands: Array<{ _id: string; name: string; image: string }> }) {
  if (!brands || brands.length === 0) return null;
  return (
    <div className="marquee relative select-none" style={{ ['--marquee-duration' as any]: '60s', ['--marquee-fix' as any]: '-1px' }}>
      {/* Edge masks for premium fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />
      <div className="marquee__track items-center will-change-transform" style={{ ['--marquee-duration' as any]: '60s' }}>
        {/* Group 1 */}
        <div className="flex items-center shrink-0">
          {brands.map((b) => (
            <Link
              href={`/products?brand=${b._id}`}
              key={`g1-${b._id}`}
              className="px-6 py-4 block opacity-80 hover:opacity-100 transition-opacity"
              aria-label={`Brand ${b.name}`}
            >
              <div className="h-12 w-[120px] flex items-center justify-center">
                <Image src={b.image} alt={b.name} width={120} height={48} className="object-contain w-auto h-10" />
              </div>
            </Link>
          ))}
        </div>
        {/* Group 2 (duplicate) */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {brands.map((b) => (
            <Link
              href={`/products?brand=${b._id}`}
              key={`g2-${b._id}`}
              className="px-6 py-4 block opacity-80 hover:opacity-100 transition-opacity"
              aria-label={`Brand ${b.name}`}
            >
              <div className="h-12 w-[120px] flex items-center justify-center">
                <Image src={b.image} alt={b.name} width={120} height={48} className="object-contain w-auto h-10" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
