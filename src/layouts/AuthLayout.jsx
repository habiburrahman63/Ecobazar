import { Link } from "react-router";
import {
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  Star,
} from "../components/common/Icons";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-paper selection:bg-amber selection:text-ink">
      {/* Brand panel (Desktop 5 cols) */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-gradient-to-br from-[#0c1424] via-[#080d19] to-[#040711] text-paper p-12 relative overflow-hidden border-r border-white/[0.08]">
        {/* Ambient atmospheric orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber to-amber/70 flex items-center justify-center font-bold text-ink shadow-[0_0_20px_rgba(235,161,28,0.35)] group-hover:scale-105 transition-transform">
              E
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-paper">
              Eco<span className="text-amber">Bazaar</span>
            </span>
          </Link>

          <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-amber">
            Official Store
          </span>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative z-10 max-w-md my-12 space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber/10 border border-amber/25 text-amber text-xs font-semibold mb-4">
              <Sparkles size={13} />
              <span>Premium Shopping Experience</span>
            </div>
            <h2 className="font-display text-3xl xl:text-4xl font-bold text-paper leading-tight">
              Curated Luxury, Seamless Delivery & Trusted Payments.
            </h2>
            <p className="text-paper/60 text-sm mt-3 leading-relaxed">
              Join thousands of discerning shoppers across Bangladesh enjoying
              verified authentic items, zero-risk returns, and direct AamarPay
              checkout.
            </p>
          </div>

          {/* Value Props */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-amber shrink-0">
                <Truck size={17} />
              </div>
              <div>
                <p className="text-sm font-semibold text-paper">
                  Swift Nationwide Fulfillment
                </p>
                <p className="text-xs text-paper/50">
                  Tracked doorstep delivery across all 64 districts in 24-72 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-amber shrink-0">
                <ShieldCheck size={17} />
              </div>
              <div>
                <p className="text-sm font-semibold text-paper">
                  Verified Payment Security
                </p>
                <p className="text-xs text-paper/50">
                  Bank-level encrypted transactions via AamarPay, bKash & Nagad.
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof Quote */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
            <div className="flex items-center gap-1 text-amber mb-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-paper/75 italic">
              "Best online ordering experience in Dhaka. Fast delivery and genuine
              products every single time."
            </p>
            <p className="text-[11px] text-paper/40 mt-2 font-medium">
              — Verified Customer, Dhaka
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-paper/40 border-t border-white/[0.08] pt-6">
          <span>© {new Date().getFullYear()} EcoBazaar Ltd.</span>
          <Link
            to="/products"
            className="hover:text-amber transition-colors flex items-center gap-1 text-paper/60"
          >
            Explore Catalog <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Form panel (Mobile full, Desktop 7 cols) */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-12 lg:p-16 min-h-screen">
        {/* Top return link */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate hover:text-ink transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            <span>Back to Store</span>
          </Link>

          <div className="lg:hidden">
            <Link to="/" className="font-display text-xl font-bold text-ink">
              Eco<span className="text-amber">Bazaar</span>
            </Link>
          </div>
        </div>

        {/* Central form card */}
        <div className="w-full max-w-md mx-auto my-auto">
          <div className="bg-white rounded-3xl border border-ink/10 p-7 sm:p-10 shadow-[0_10px_35px_-10px_rgba(10,15,29,0.08)]">
            <div className="mb-6">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-slate text-sm mt-2 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {children}
          </div>
        </div>

        {/* Bottom subtle assurance */}
        <div className="w-full max-w-md mx-auto mt-6 text-center text-xs text-slate/50">
          <span>Protected by 256-bit encryption. Safe & confidential.</span>
        </div>
      </div>
    </div>
  );
}