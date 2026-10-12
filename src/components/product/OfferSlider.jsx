import { useRef, useCallback, memo } from "react";
import { ChevronLeft, ChevronRight, Zap } from "../common/Icons";
import OfferProductCard from "./OfferProductCard";

function OfferSlider({
  products,
  title = "Today's Deals",
  subtitle,
}) {
  const scrollRef = useRef(null);

  // Smooth button click scrolling with card-width stepping
  const handleScroll = useCallback((direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const step = Math.min(container.clientWidth * 0.75, 480);
    container.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-end justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-red-500 flex items-center justify-center shrink-0 shadow-sm">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-slate mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-ink/70 hover:text-ink hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-xs active:scale-95 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-ink/70 hover:text-ink hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-xs active:scale-95 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 scroll-smooth
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {products.map((product) => (
          <div key={product._id} className="shrink-0">
            <OfferProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(OfferSlider);
