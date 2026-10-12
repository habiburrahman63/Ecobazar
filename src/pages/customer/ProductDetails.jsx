import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  Check,
  Zap,
  Sparkles,
  ArrowRight,
} from "../../components/common/Icons";
import ProductImageGallery from "../../components/product/ProductImageGallery";
import Button from "../../components/common/Button";
import { fetchProductById } from "../../api/productApi";
import { useCart } from "../../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart, isPending } = useCart();

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        const data = await fetchProductById(id);
        if (active) {
          setProduct(data);
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
      } catch (err) {
        if (active) setError(err.message || "Failed to load product");
      } finally {
        if (active) setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }

    return () => {
      active = false;
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product, selectedQty);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2500);
    } catch (err) {
      alert(err.message || "Could not add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      await addToCart(product, selectedQty);
      navigate("/checkout");
    } catch (err) {
      alert(err.message || "Could not proceed to checkout");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-4 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate text-sm font-medium">Loading product presentation...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
        <p className="text-slate font-medium text-base">
          {error || "Product not found."}
        </p>
        <Link
          to="/products"
          className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-ink text-paper text-xs font-bold rounded-xl hover:bg-ink/90 transition-colors"
        >
          <ArrowRight size={14} className="rotate-180" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;
  const savings = Math.max(0, product.price - product.salePrice);
  const discount =
    product.price > product.salePrice
      ? Math.round((1 - product.salePrice / product.price) * 100)
      : 0;
  const pending = isPending(product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate mb-8 flex-wrap">
        <Link to="/" className="hover:text-amber transition-colors">
          Home
        </Link>
        <span className="text-slate/40">/</span>
        <Link to="/products" className="hover:text-amber transition-colors">
          Products
        </Link>
        {product.category && (
          <>
            <span className="text-slate/40">/</span>
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="hover:text-amber transition-colors"
            >
              {product.category}
            </Link>
          </>
        )}
        <span className="text-slate/40">/</span>
        <span className="text-ink font-semibold truncate max-w-xs">
          {product.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Left: Product Image Gallery */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-sm">
          <ProductImageGallery images={product.images || []} />
        </div>

        {/* Right: Product Purchase Details */}
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2.5">
            {product.category && (
              <span className="text-[11px] font-bold text-amber uppercase tracking-wider bg-amber/10 border border-amber/20 px-3 py-0.5 rounded-full">
                {product.category}
              </span>
            )}
            {product.brand && (
              <span className="text-xs font-semibold text-slate/70">
                Brand: <strong className="text-ink">{product.brand}</strong>
              </span>
            )}
            {product.sku && (
              <span className="text-xs text-slate/40">
                · SKU: <span className="font-mono">{product.sku}</span>
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink leading-tight tracking-tight">
            {product.title}
          </h1>

          {/* Rating Summary */}
          {product.numReviews > 0 ? (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-0.5 text-amber">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={15}
                    className={
                      n <= Math.round(product.averageRating)
                        ? "text-amber"
                        : "text-slate-200"
                    }
                    fill="currentColor"
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-ink">
                {product.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-slate">
                ({product.numReviews} verified customer reviews)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate/60 mt-3">
              <Sparkles size={13} className="text-amber" />
              <span>Authentic Guaranteed • Brand New Item</span>
            </div>
          )}

          {/* Price & Savings Display */}
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-4 mt-5 flex items-baseline gap-3 flex-wrap">
            <span className="font-display text-3xl sm:text-4xl font-bold text-ink">
              ৳{product.salePrice.toLocaleString()}
            </span>
            {discount > 0 && (
              <>
                <span className="text-base text-slate/50 line-through">
                  ৳{product.price.toLocaleString()}
                </span>
                <span className="text-xs font-extrabold text-white bg-gradient-to-r from-red-600 to-rose-500 px-3 py-1 rounded-full shadow-sm">
                  Save {discount}% (৳{savings.toLocaleString()})
                </span>
              </>
            )}
          </div>

          {/* Stock Availability Pill */}
          <div className="mt-4 flex items-center gap-2">
            {outOfStock ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                Currently Out of Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                In Stock ({product.stock} items ready to ship)
              </span>
            )}
          </div>

          {/* Short Excerpt */}
          <p className="text-slate text-sm leading-relaxed mt-4 font-normal">
            {product.shortDescription || product.description}
          </p>

          {/* Buy Box & Action Controls */}
          <div className="mt-6 p-6 rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate/70">
                Quantity Selector
              </span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-inner">
                <button
                  type="button"
                  onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-ink font-bold hover:bg-slate-200/80 transition-colors text-base"
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-bold text-ink">
                  {selectedQty}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedQty((q) => Math.min(product.stock, q + 1))
                  }
                  disabled={selectedQty >= product.stock}
                  className="w-10 h-10 flex items-center justify-center text-ink font-bold hover:bg-slate-200/80 transition-colors disabled:opacity-30 text-base"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="accent"
                loading={pending}
                disabled={outOfStock}
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold rounded-2xl shadow-md"
              >
                {addedToast ? (
                  <>
                    <Check size={18} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Add to Cart
                  </>
                )}
              </Button>

              <button
                type="button"
                disabled={outOfStock}
                onClick={handleBuyNow}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber to-amber-hover text-ink font-bold text-sm py-3.5 px-6 rounded-2xl shadow-md shadow-amber/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap size={17} /> Instant Checkout
              </button>

              <button
                type="button"
                className="w-12 h-12 shrink-0 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
                aria-label="Add to wishlist"
              >
                <Heart size={19} />
              </button>
            </div>
          </div>

          {/* Trust Value Badges Strip */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { icon: Truck, label: "Fast Nationwide Delivery", sub: "2-5 Days" },
              { icon: ShieldCheck, label: "AamarPay Verified", sub: "256-Bit SSL" },
              { icon: RotateCcw, label: "Hassle-Free Returns", sub: "7 Days" },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <Icon size={20} className="text-amber mb-1" />
                <span className="text-[11px] font-bold text-ink">{label}</span>
                <span className="text-[10px] text-slate/70 mt-0.5">{sub}</span>
              </div>
            ))}
          </div>

          {/* Information Tabs */}
          {(product.description || product.additionalInfo) && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex gap-4 border-b border-slate-200 pb-2">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all ${
                    activeTab === "description"
                      ? "text-amber border-amber"
                      : "text-slate border-transparent hover:text-ink"
                  }`}
                >
                  Full Description
                </button>
                {product.additionalInfo && (
                  <button
                    onClick={() => setActiveTab("specs")}
                    className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all ${
                      activeTab === "specs"
                        ? "text-amber border-amber"
                        : "text-slate border-transparent hover:text-ink"
                    }`}
                  >
                    Specifications
                  </button>
                )}
              </div>

              <div className="pt-4">
                {activeTab === "description" ? (
                  <p className="text-sm text-slate leading-relaxed">
                    {product.description || "No full description provided."}
                  </p>
                ) : (
                  <p className="text-sm text-slate leading-relaxed">
                    {product.additionalInfo}
                  </p>
                )}

                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}