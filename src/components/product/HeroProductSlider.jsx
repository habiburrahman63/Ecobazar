import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, Sparkles } from "../common/Icons";

function getMainImage(product) {
  return product.images?.find((img) => img.isMain)?.url || product.images?.[0]?.url;
}

function getDiscountPercent(product) {
  return product.price > product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
}

export default function HeroProductSlider({ products }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % products.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [products.length]);

  if (!products.length) return null;
  const product = products[active];
  const image = getMainImage(product);
  const discount = getDiscountPercent(product);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Background ambient lighting glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-amber/30 to-amber/5 rounded-3xl blur-3xl opacity-70" />

      <div className="relative bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl">
        {/* Spotlight Pill */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber/15 border border-amber/30 text-amber text-[11px] font-semibold tracking-wide">
            <Sparkles size={12} className="animate-spin" style={{ animationDuration: "6s" }} />
            <span>Trending Spotlight</span>
          </div>
          <span className="text-[11px] font-medium text-paper/50">
            {active + 1} of {products.length}
          </span>
        </div>

        <Link to={`/products/${product._id}`} className="block group">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/5 shadow-inner">
            <img
              key={product._id}
              src={image || "/placeholder-product.svg"}
              alt={product.title}
              fetchPriority="high"
              decoding="async"
              onError={(e) => {
                if (!e.currentTarget.src.endsWith("/placeholder-product.svg")) {
                  e.currentTarget.src = "/placeholder-product.svg";
                }
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {discount > 0 && (
              <span className="absolute top-3.5 left-3.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg">
                Save {discount}%
              </span>
            )}
          </div>
        </Link>

        <div className="flex items-center justify-between mt-5 gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-amber uppercase tracking-wider">
              {product.category || "Exclusive"}
            </p>
            <Link to={`/products/${product._id}`} className="block">
              <p className="text-paper text-base font-semibold line-clamp-1 hover:text-amber transition-colors mt-0.5">
                {product.title}
              </p>
            </Link>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-xl font-bold text-amber">
                ৳{product.salePrice.toLocaleString()}
              </span>
              {discount > 0 && (
                <span className="text-xs text-paper/40 line-through">
                  ৳{product.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <Link
            to={`/products/${product._id}`}
            className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber to-amber-hover text-ink font-bold flex items-center justify-center hover:scale-105 hover:shadow-lg hover:shadow-amber/25 active:scale-95 transition-all duration-200"
            aria-label="View spotlight product"
          >
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Carousel indicators */}
        {products.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-white/10">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-8 bg-amber"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Jump to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}