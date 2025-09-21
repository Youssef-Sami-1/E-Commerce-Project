import Image from 'next/image';
import Link from 'next/link';

export default function CategoryCard({ id, name, image }: { id: string; name: string; image?: string }) {
  return (
    <Link aria-label={`Category ${name}`} href={`/products?category=${id}`} className="group block p-5 rounded-2xl border border-slate-200 bg-white card-hover glow-ring soft-shadow">
      <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 grid place-items-center overflow-hidden">
        {image ? (
          // placeholder, can replace with next/image and remote patterns
          <Image src={image} alt={name} width={600} height={450} className="w-full h-full object-cover zoom-on-hover rounded-xl" sizes="(max-width: 768px) 50vw, 25vw" />
        ) : (
          <span className="text-4xl">🗂️</span>
        )}
      </div>
      <h3 className="mt-3 font-medium tracking-wide">{name}</h3>
    </Link>
  );
}
