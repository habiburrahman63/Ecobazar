import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useCart } from "../../context/CartContext";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import ProductCard from "../../components/product/ProductCard";
import { ShoppingCart, ArrowRight, Sparkles, Trash2 } from "../../components/common/Icons";
import { fetchActiveProducts } from "../../api/productApi";

export default function Cart() {
  const {
    items,
    subtotal,
    loading,
    error,
    clearCart,
  } = useCart();

  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    async function loadRecommended() {
      try {
        const prods = await fetchActiveProducts();
        const inCartIds = items.map((i) => i.productId);
        const filtered = prods.filter((p) => !inCartIds.includes(p._id));
        setRecommended(filtered.slice(0, 4));
      } catch {
        // quiet fallback
      }
    }
    loadRecommended();
  }, [items]);

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-4 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate text-sm font-medium">Loading shopping bag...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-3xl bg-amber/10 border border-amber/20 flex items-center justify-center text-amber mx-auto mb-6 shadow-sm">
          <ShoppingCart size={36} />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-slate text-sm sm:text-base mt-3 max-w-md mx-auto leading-relaxed">
          Looks like you haven't added any products to your bag yet. Explore our curated collections for fresh deals!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber to-amber-hover text-ink text-sm font-bold shadow-lg shadow-amber/20 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Discover Products <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title Header */}
      <div className="mb-8">
        <span className="text-[11px] font-bold text-amber uppercase tracking-wider">
          Review Your Selections
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight mt-0.5">
          Shopping Cart ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-semibold rounded-2xl border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Item Cards List & Bottom Summary Bar */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <CartItem
                key={item._id || item.productId}
                item={item}
              />
            ))}
          </div>

          {/* Cart Items Footer / Total Price Display (Red-marked area) */}
          <div className="bg-slate-50/80 px-6 py-5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-auto">
            <div className="flex items-center gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-ink hover:border-amber hover:text-amber transition-all shadow-xs"
              >
                ← Continue Shopping
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear your cart?")) {
                    clearCart();
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate/70 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
              >
                <Trash2 size={13} />
                Clear Cart
              </button>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 bg-white sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-0 border-slate-200/60">
              <div className="text-left sm:text-right">
                <span className="text-[11px] font-bold text-slate/60 uppercase tracking-wider block">
                  Total Items
                </span>
                <span className="text-xs font-bold text-ink">
                  {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="text-right pl-5 sm:pl-6 border-l border-slate-200">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate block">
                  Total Price
                </span>
                <span className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Drawer */}
        <div>
          <CartSummary subtotal={subtotal} itemCount={totalQuantity} />
        </div>
      </div>

      {/* Recommended items strip */}
      {recommended.length > 0 && (
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[11px] font-bold text-amber uppercase tracking-wider">
                Recommendations
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-0.5">
                You Might Also Love
              </h2>
            </div>
            <Link
              to="/products"
              className="text-xs font-bold text-amber hover:underline flex items-center gap-1"
            >
              See all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {recommended.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}