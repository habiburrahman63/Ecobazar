import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import { SlidersHorizontal, X, ArrowRight, Sparkles } from "../../components/common/Icons";
import ProductGrid from "../../components/product/ProductGrid";
import Pagination from "../../components/common/Pagination";
import PriceRangeSlider from "../../components/product/PriceRangeSlider";
import MobileFilterDrawer from "../../components/product/MobileFilterDrawer";
import { fetchActiveProducts, preloadProductImages } from "../../api/productApi";
import { fetchCategories } from "../../api/categoryApi";

const PER_PAGE = 8;
const PRICE_FLOOR = 0;
const PRICE_CEIL = 200000;

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";
  const subParam = searchParams.get("sub") || "";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([
    minPrice ? Number(minPrice) : PRICE_FLOOR,
    maxPrice ? Number(maxPrice) : PRICE_CEIL,
  ]);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const [prods, cats] = await Promise.all([
          fetchActiveProducts(),
          fetchCategories(),
        ]);
        if (active) {
          setProducts(prods || []);
          setCategories((cats || []).filter((c) => c.status !== "inactive"));
        }
      } catch (err) {
        if (active) setError(err.message || "Failed to load products");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, []);

  const activeCategory = categories.find((c) => c.name === categoryParam);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => {
        const titleMatch = p.title?.toLowerCase().includes(q);
        const skuMatch = p.sku?.toLowerCase().includes(q);
        const categoryMatch = p.category?.toLowerCase().includes(q);
        const brandMatch = p.brand?.toLowerCase().includes(q);
        const tagsMatch = p.tags?.some((tag) => tag.toLowerCase().includes(q));
        return titleMatch || skuMatch || categoryMatch || brandMatch || tagsMatch;
      });
    }

    if (categoryParam) {
      result = result.filter(
        (p) => p.category?.toLowerCase() === categoryParam.toLowerCase()
      );
    }

    if (subParam) {
      const subLower = subParam.toLowerCase();
      result = result.filter(
        (p) =>
          p.tags?.some((t) => t.toLowerCase() === subLower) ||
          p.shortDescription?.toLowerCase().includes(subLower) ||
          p.description?.toLowerCase().includes(subLower) ||
          p.title?.toLowerCase().includes(subLower)
      );
    }

    result = result.filter(
      (p) => p.salePrice >= priceRange[0] && p.salePrice <= priceRange[1]
    );

    if (sort === "price-low") result.sort((a, b) => a.salePrice - b.salePrice);
    if (sort === "price-high") result.sort((a, b) => b.salePrice - a.salePrice);
    if (sort === "name") result.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "newest")
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return result;
  }, [products, search, categoryParam, subParam, sort, priceRange]);

  useEffect(() => setPage(1), [search, categoryParam, subParam, sort, priceRange]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / PER_PAGE)),
    [filtered.length]
  );

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [filtered, page]
  );

  useEffect(() => {
    if (paginated.length > 0) {
      preloadProductImages(paginated);
    }
  }, [paginated]);

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage === page || newPage < 1 || newPage > totalPages) return;
      setPage(newPage);

      // Smoothly scroll to the top of the catalog content area so newly loaded products are immediately in view
      requestAnimationFrame(() => {
        const target =
          document.getElementById("catalog-content-start") ||
          document.getElementById("catalog-toolbar");
        if (target) {
          const yOffset = -90; // offset for sticky navbar
          const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({
            top: Math.max(0, y),
            behavior: "smooth",
          });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    },
    [page, totalPages]
  );

  const setCategory = useCallback(
    (catName) => {
      const next = new URLSearchParams(searchParams);
      if (catName) next.set("category", catName);
      else next.delete("category");
      next.delete("sub");
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const setSub = useCallback(
    (sub) => {
      const next = new URLSearchParams(searchParams);
      if (sub && sub !== subParam) next.set("sub", sub);
      else next.delete("sub");
      setSearchParams(next);
    },
    [searchParams, setSearchParams, subParam]
  );

  const handlePriceChange = useCallback(
    (range) => {
      setPriceRange(range);
      const next = new URLSearchParams(searchParams);
      next.set("minPrice", range[0]);
      next.set("maxPrice", range[1]);
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const clearAllFilters = useCallback(() => {
    setSearchParams({});
    setPriceRange([PRICE_FLOOR, PRICE_CEIL]);
  }, [setSearchParams]);

  const hasActiveFilters = Boolean(
    categoryParam || subParam || search || priceRange[0] > PRICE_FLOOR || priceRange[1] < PRICE_CEIL
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Toolbar */}
      <div
        id="catalog-toolbar"
        className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <span className="text-[11px] font-bold text-amber uppercase tracking-wider">
            Explore Store Catalog
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight mt-0.5">
            {subParam ||
              categoryParam ||
              (search ? `Results for "${search}"` : "All Products")}
          </h1>
          <p className="text-xs sm:text-sm text-slate mt-1.5 flex items-center gap-2">
            <span>Showing authentic merchandise</span>
            <span>•</span>
            <span className="font-semibold text-ink">
              {loading ? "Searching..." : `${filtered.length} items available`}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 text-xs font-bold border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-ink shadow-sm"
          >
            <SlidersHorizontal size={15} className="text-amber" /> Filter Results
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-semibold text-slate">Sort By:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs font-semibold border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 text-ink focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all shadow-sm"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Product Title: A–Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <span className="text-xs font-semibold text-slate mr-1">Active filters:</span>
          {categoryParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber/10 text-ink border border-amber/25">
              Category: {categoryParam}
              <button onClick={() => setCategory("")} className="hover:text-red-500">
                <X size={12} />
              </button>
            </span>
          )}
          {subParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber/10 text-ink border border-amber/25">
              Sub: {subParam}
              <button onClick={() => setSub("")} className="hover:text-red-500">
                <X size={12} />
              </button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-ink border border-slate-200">
              Keyword: "{search}"
              <button
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.delete("search");
                  setSearchParams(next);
                }}
                className="hover:text-red-500"
              >
                <X size={12} />
              </button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-red-600 hover:underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-8 items-start">
        {/* Sidebar Filters — Desktop Card */}
        <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm divide-y divide-slate-100 sticky top-28 self-start">
          {/* Category Filter */}
          <div className="pb-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate/70 mb-3">
              Departments
            </h3>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setCategory("")}
                className={`text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all ${
                  !categoryParam
                    ? "bg-ink text-paper shadow-sm"
                    : "text-ink/80 hover:bg-slate-50"
                }`}
              >
                All Departments
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id || cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                    categoryParam === cat.name
                      ? "bg-amber text-ink shadow-sm"
                      : "text-ink/80 hover:bg-slate-50"
                  }`}
                >
                  <span className="line-clamp-1">{cat.name}</span>
                  {cat.subcategories?.length > 0 && (
                    <span className="text-[10px] opacity-70">
                      ({cat.subcategories.length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategories */}
          {activeCategory && activeCategory.subcategories?.length > 0 && (
            <div className="py-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate/70 mb-3">
                {activeCategory.name} Collections
              </h3>
              <div className="flex flex-col gap-1">
                {activeCategory.subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSub(sub)}
                    className={`text-left text-xs font-medium px-3 py-1.5 rounded-xl transition-all ${
                      subParam === sub
                        ? "bg-amber/20 text-ink font-bold border border-amber/30"
                        : "text-slate hover:bg-slate-50"
                    }`}
                  >
                    • {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          <div className="pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate/70 mb-3">
              Price Filter (৳)
            </h3>
            <PriceRangeSlider
              min={PRICE_FLOOR}
              max={PRICE_CEIL}
              value={priceRange}
              onChange={handlePriceChange}
            />
          </div>
        </aside>

        {/* Product Grid & Pagination Area */}
        <div
          id="catalog-content-start"
          className="flex-1 min-w-0 flex flex-col justify-between min-h-[580px] sm:min-h-[680px]"
        >
          {loading ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 border-4 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate text-sm font-medium">Fetching real products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-red-200 p-8">
              <p className="text-red-600 text-sm font-semibold">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-amber/10 flex items-center justify-center text-amber mx-auto mb-4">
                <Sparkles size={26} />
              </div>
              <h3 className="font-display text-2xl font-bold text-ink">No products match your criteria</h3>
              <p className="text-slate text-sm mt-2 max-w-sm mx-auto">
                Try widening your price range or clearing selected category filters.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="mt-6 px-6 py-2.5 bg-ink text-paper text-xs font-bold rounded-xl hover:bg-ink/90 transition-colors shadow-sm"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex-1">
                <ProductGrid products={paginated} />
              </div>
              {totalPages > 1 && (
                <div className="mt-10 pt-4">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        categories={categories}
        categoryParam={categoryParam}
        setCategory={setCategory}
        activeCategory={activeCategory}
        subParam={subParam}
        setSub={setSub}
        priceRange={priceRange}
        onPriceChange={handlePriceChange}
        priceFloor={PRICE_FLOOR}
        priceCeil={PRICE_CEIL}
      />
    </div>
  );
}