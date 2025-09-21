export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-12 text-sm text-slate-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-slate-900 font-semibold tracking-wide">NeoShop</h3>
            <p className="mt-3 leading-relaxed">Shop smarter with NeoShop — sleek, fast, and effortless. Quality you want, speed you expect.</p>
          </div>
          <div>
            <h4 className="text-slate-900 font-medium">Links</h4>
            <ul className="mt-3 space-y-2">
              <li><a href="/products" className="hover:text-slate-900 transition-colors">Products</a></li>
              <li><a href="/categories" className="hover:text-slate-900 transition-colors">Categories</a></li>
              <li><a href="/brands" className="hover:text-slate-900 transition-colors">Brands</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-medium">Support</h4>
            <ul className="mt-3 space-y-2">
              <li><a href="/contact" className="hover:text-slate-900 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="section-divider my-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} NeoShop. All rights reserved.</p>
          <p className="opacity-80">Route Front-End Final Project - Youssef Sami yehia</p>
        </div>
      </div>
    </footer>
  );
}
