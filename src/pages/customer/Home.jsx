import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Star,
  Sparkles,
  Zap,
} from "../../components/common/Icons";
import ProductCard from "../../components/product/ProductCard";
import OfferSlider from "../../components/product/OfferSlider";
import HeroProductSlider from "../../components/product/HeroProductSlider";
import CategoryGrid from "../../components/product/CategoryGrid";
import { fetchActiveProducts } from "../../api/productApi";
import { fetchCategories } from "../../api/categoryApi";
import { pickBySection } from "../../utils/productSections";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [prodsData, catsData] = await Promise.all([
          fetchActiveProducts(),
          fetchCategories(),
        ]);
        if (!cancelled) {
          setProducts(prodsData || []);
          setCategories(
            (catsData || []).filter((c) => c.status !== "inactive")
          );
        }
      } catch (err) {
        if (!cancelled) setLoadError(err.message || "Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeProducts = products;

  const {
    activeOffers,
    todaysDeals,
    sectionFeatured,
    sectionBestSellers,
    sectionNewArrivals,
  } = useMemo(() => {
    const offers = activeProducts.filter(
      (p) =>
        p.discountType === "flat" ||
        p.discountType === "percent" ||
        p.discountType === "percentage"
    );

    const feat = [...activeProducts]
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 4);
    const best = [...activeProducts]
      .sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0))
      .slice(0, 4);
    const arrivals = [...activeProducts].slice(-4).reverse();

    return {
      activeOffers: offers,
      todaysDeals: pickBySection(activeProducts, "Today's Deals", offers),
      sectionFeatured: pickBySection(activeProducts, "Featured Products", feat),
      sectionBestSellers: pickBySection(activeProducts, "Best Sellers", best),
      sectionNewArrivals: pickBySection(activeProducts, "New Arrivals", arrivals),
    };
  }, [activeProducts]);

  return (
    <div className="bg-paper min-h-screen">
      {/* Hero Section — Luxury Deep Indigo & Gold Ambience */}
      <section className="bg-gradient-to-b from-ink via-slate-950 to-ink text-paper relative overflow-hidden">
        {/* Subtle decorative mesh gradients */}
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,_#e8a33d_1px,_transparent_0)] bg-[length:32px_32px]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber/15 rounded-full blur-[120px] pointer-events-none [transform:translate3d(0,0,0)] [will-change:transform]" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber/10 rounded-full blur-[90px] pointer-events-none [transform:translate3d(0,0,0)] [will-change:transform]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: Headline & Actions */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/15 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-semibold text-paper/90 tracking-wide flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber" />
                  Premium Collection 2026 — Live in Bangladesh
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-paper leading-[1.12] tracking-tight">
                Everything you desire,{" "}
                <span className="bg-gradient-to-r from-amber via-amber-light to-amber bg-clip-text text-transparent">
                  delivered
                </span>{" "}
                with perfection.
              </h1>

              <p className="text-paper/70 text-base sm:text-lg mt-5 max-w-lg leading-relaxed font-normal">
                Discover curated authentic goods with transparent pricing, instant AamarPay checkout, and rapid nationwide delivery.
              </p>

              <div className="flex flex-col sm:flex-row gap-3.5 mt-8">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber to-amber-hover text-ink font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-amber/20 hover:shadow-amber/30 hover:gap-3.5 active:scale-95 transition-all duration-200"
                >
                  Explore Catalog <ArrowRight size={17} />
                </Link>
                <Link
                  to="/products?discount=true"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-paper border border-white/20 backdrop-blur-sm font-semibold text-sm px-7 py-3.5 rounded-2xl transition-all duration-200"
                >
                  <Zap size={16} className="text-amber" /> Special Offers
                </Link>
              </div>

              {/* Verified Trust Stats Strip */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-12 pt-8 border-t border-white/10">
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-paper">
                    {products.length > 0 ? `${products.length}+` : "100+"}
                  </p>
                  <p className="text-xs text-paper/60 mt-0.5">Real Products</p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-amber">
                    {categories.length > 0 ? `${categories.length}` : "5+"}
                  </p>
                  <p className="text-xs text-paper/60 mt-0.5">Departments</p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-emerald-400">
                    100%
                  </p>
                  <p className="text-xs text-paper/60 mt-0.5">Verified Secure</p>
                </div>
              </div>
            </div>

            {/* Right: Interactive Showcase Spotlight Slider */}
            <div className="hidden lg:block">
              {activeOffers.length > 0 ? (
                <HeroProductSlider products={activeOffers} />
              ) : activeProducts.length > 0 ? (
                <HeroProductSlider products={activeProducts.slice(0, 4)} />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Floating Trust Benefits Strip */}
      <section className="relative z-20 -mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[
            {
              icon: Truck,
              title: "Nationwide Delivery",
              subtitle: "2-5 Days to your doorstep",
            },
            {
              icon: ShieldCheck,
              title: "100% Secure Payments",
              subtitle: "AamarPay, Cards & MFS",
            },
            {
              icon: RotateCcw,
              title: "7-Day Return Guarantee",
              subtitle: "Hassle-free replacement",
            },
            {
              icon: Headphones,
              title: "Dedicated Support",
              subtitle: "Call: +880 18166 77503",
            },
          ].map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-amber/40 transition-all duration-300 flex items-center gap-3.5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center shrink-0 group-hover:bg-amber group-hover:scale-105 transition-all duration-300">
                <Icon size={20} className="text-amber group-hover:text-ink transition-colors" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-ink truncate">
                  {title}
                </h4>
                <p className="text-[11px] text-slate/70 mt-0.5 truncate">
                  {subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Storefront Body */}
      <main className="py-10">
        {loading ? (
          <div className="max-w-7xl mx-auto px-4 py-24 text-center">
            <div className="w-10 h-10 border-4 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate text-sm font-medium">Loading live catalog...</p>
          </div>
        ) : loadError ? (
          <div className="max-w-md mx-auto my-16 p-6 bg-red-50 rounded-2xl border border-red-200 text-center">
            <p className="text-red-700 text-sm font-semibold">{loadError}</p>
            <p className="text-slate text-xs mt-1">Please ensure backend server is running.</p>
          </div>
        ) : activeProducts.length === 0 ? (
          <div className="max-w-xl mx-auto my-16 text-center bg-white rounded-3xl border border-slate-200/80 p-10 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber/10 flex items-center justify-center text-amber mx-auto mb-4">
              <Sparkles size={28} />
            </div>
            <h3 className="font-display text-2xl font-bold text-ink">Catalog Getting Stocked</h3>
            <p className="text-slate text-sm mt-2">
              Products uploaded via the Admin Dashboard appear instantly.
            </p>
            <Link
              to="/products"
              className="inline-block mt-6 px-6 py-3 rounded-xl bg-ink text-paper text-xs font-bold hover:bg-ink/90 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            {/* Today's Flash Deals Carousel */}
            {todaysDeals.length > 0 && (
              <OfferSlider
                products={todaysDeals}
                title="Today's Flash Deals"
                subtitle="Limited-time price cuts on certified top items"
              />
            )}

            {/* Shop By Category */}
            {categories.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <span className="text-[11px] font-bold text-amber uppercase tracking-wider">
                      Collections
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-0.5">
                      Shop by Department
                    </h2>
                    <p className="text-xs sm:text-sm text-slate mt-1">
                      Explore authentic products categorized for easy shopping
                    </p>
                  </div>
                  <Link
                    to="/products"
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-amber hover:underline underline-offset-4"
                  >
                    View all departments <ArrowRight size={14} />
                  </Link>
                </div>

                <CategoryGrid categories={categories} />
              </section>
            )}

            {/* Featured Products Showcase */}
            {sectionFeatured.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <span className="text-[11px] font-bold text-amber uppercase tracking-wider">
                      Handpicked
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-0.5">
                      Featured Products
                    </h2>
                    <p className="text-xs sm:text-sm text-slate mt-1">
                      Our highest-rated customer favorites
                    </p>
                  </div>
                  <Link
                    to="/products"
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-amber hover:underline underline-offset-4"
                  >
                    Browse full list <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {sectionFeatured.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Luxury Limited-Time Promotional Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-ink to-slate-900 border border-slate-800 p-8 sm:p-12 shadow-xl">
                <div className="absolute right-0 top-0 w-96 h-96 bg-amber/10 rounded-full blur-3xl pointer-events-none [transform:translate3d(0,0,0)]" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left max-w-xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber/15 text-amber text-[11px] font-bold tracking-wider uppercase mb-3">
                      <Sparkles size={12} /> Seasonal Offer
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-paper leading-snug">
                      Free Nationwide Shipping on orders over ৳2,000
                    </h3>
                    <p className="text-paper/70 text-sm mt-2">
                      Zero shipping fee applied automatically at checkout. Pay securely via AamarPay or Cash on Delivery.
                    </p>
                  </div>

                  <Link
                    to="/products"
                    className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-amber to-amber-hover text-ink font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-amber/20 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    Start Shopping <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </section>

            {/* Best Sellers */}
            {sectionBestSellers.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-end justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center shrink-0">
                      <Star size={18} className="text-amber" fill="currentColor" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                        Best Sellers
                      </h2>
                      <p className="text-xs sm:text-sm text-slate mt-0.5">
                        Top trending products based on verified customer orders
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/products"
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-amber hover:underline underline-offset-4"
                  >
                    View all <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {sectionBestSellers.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* New Arrivals */}
            {sectionNewArrivals.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <span className="text-[11px] font-bold text-amber uppercase tracking-wider">
                      Fresh Additions
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-0.5">
                      New Arrivals
                    </h2>
                    <p className="text-xs sm:text-sm text-slate mt-1">
                      Newly added to our online inventory
                    </p>
                  </div>
                  <Link
                    to="/products"
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-amber hover:underline underline-offset-4"
                  >
                    Explore all <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {sectionNewArrivals.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}