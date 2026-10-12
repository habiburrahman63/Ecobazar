import { X } from "../common/Icons";
import PriceRangeSlider from "./PriceRangeSlider";

export default function MobileFilterDrawer({
  open,
  onClose,
  categories,
  categoryParam,
  setCategory,
  activeCategory,
  subParam,
  setSub,
  priceRange,
  onPriceChange,
  priceFloor,
  priceCeil,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-ink/10 shrink-0">
          <h3 className="font-display text-lg font-semibold text-ink">
            Filters
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink/50 hover:bg-ink/5 hover:text-ink transition-colors"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scroleable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">
          {/* Category */}
          <div>
            <h4 className="text-xs font-semibold text-slate/60 uppercase tracking-wide mb-3">
              Category
            </h4>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setCategory("")}
                className={`text-left text-sm px-3 py-2.5 rounded-lg transition-colors ${
                  !categoryParam
                    ? "bg-ink text-paper"
                    : "text-ink/70 hover:bg-ink/5"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`text-left text-sm px-3 py-2.5 rounded-lg transition-colors ${
                    categoryParam === cat.name
                      ? "bg-ink text-paper"
                      : "text-ink/70 hover:bg-ink/5"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="pt-1 border-t border-ink/10">
            <div className="pt-5">
              <PriceRangeSlider
                min={priceFloor}
                max={priceCeil}
                value={priceRange}
                onChange={onPriceChange}
              />
            </div>
          </div>

          {/* Subcategories */}
          {activeCategory && (
            <div className="pt-1 border-t border-ink/10">
              <h4 className="text-xs font-semibold text-slate/60 uppercase tracking-wide mb-3 pt-5">
                {activeCategory.name} — Refine
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeCategory.subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSub(sub)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                      subParam === sub
                        ? "bg-amber text-ink"
                        : "bg-ink/5 text-ink/60 hover:bg-ink/10"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-ink/10 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg bg-ink text-paper text-sm font-semibold hover:bg-ink/90 transition-colors"
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
}
