import { memo, useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Heart, ShoppingCart, Star, Loader2 } from "../common/Icons";
import { useCart } from "../../context/CartContext";

function getMainImage(product) {
  return product.images?.find((img) => img.isMain)?.url || product.images?.[0]?.url;
}

function getDiscountPercent(product) {
  return product.price > product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
}

function ProductCard({ product }) {
  const { addToCart, isPending } = useCart();
  const image = getMainImage(product);
  const outOfStock = product.stock === 0;
  const discount = getDiscountPercent(product);
  const pending = isPending(product._id);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, [image]);

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:border-amber/40 hover:shadow-xl hover:-translate-y-1 transition-[transform,box-shadow,border-color] duration-300 will-change-transform flex flex-col justify-between">
      <div>
        <Link to={`/products/${product._id}`} className="block relative aspect-square overflow-hidden bg-slate-100">
          {!isLoaded && (
            <div className="absolute inset-0 bg-slate-100 animate-pulse" />
          )}
          <img
            ref={imgRef}
            src={image || "/placeholder-product.svg"}
            alt={product.title}
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
              setIsLoaded(true);
              if (!e.currentTarget.src.endsWith("/placeholder-product.svg")) {
                e.currentTarget.src = "/placeholder-product.svg";
              }
            }}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ease-out ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-rose-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
              -{discount}%
            </span>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-ink/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-paper text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 bg-ink/90 rounded-full shadow-lg">
                Out of Stock
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center
              text-slate hover:text-red-500 hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
            aria-label="Add to wishlist"
          >
            <Heart size={15} />
          </button>
        </Link>

        <div className="p-4 pb-2">
          <p className="text-[10px] font-bold text-amber uppercase tracking-wider line-clamp-1">
            {product.category || "General"}
          </p>
          <Link to={`/products/${product._id}`}>
            <h3 className="text-sm font-semibold text-ink mt-1 line-clamp-2 hover:text-amber transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>

          {product.numReviews > 0 ? (
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center text-amber">
                <Star size={12} fill="currentColor" />
              </div>
              <span className="text-xs font-semibold text-ink/80">
                {product.averageRating.toFixed(1)}
              </span>
              <span className="text-[11px] text-slate/60">
                ({product.numReviews})
              </span>
            </div>
          ) : (
            <div className="h-4 mt-2" />
          )}
        </div>
      </div>

      <div className="p-3.5 sm:p-4 pt-1">
        <div className="flex items-center justify-between gap-1.5 pt-2.5 border-t border-slate-100 min-w-0">
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="font-display text-sm sm:text-base font-bold text-ink">
              ৳{product.salePrice.toLocaleString()}
            </span>
            {discount > 0 && (
              <span className="text-[10px] sm:text-[11px] text-slate/50 line-through">
                ৳{product.price.toLocaleString()}
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={outOfStock || pending}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className={`inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold transition-all duration-200 shrink-0 shadow-xs ${
              outOfStock
                ? "bg-slate-100 text-slate/60 cursor-not-allowed"
                : "bg-ink text-paper hover:bg-amber hover:text-ink active:scale-95"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
            aria-label="Add to cart"
          >
            {pending ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span className="whitespace-nowrap">Adding...</span>
              </>
            ) : outOfStock ? (
              <span className="whitespace-nowrap">Out of Stock</span>
            ) : (
              <>
                <ShoppingCart size={13} />
                <span className="whitespace-nowrap">Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);