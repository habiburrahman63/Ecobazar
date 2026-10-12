import { memo, useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { ShoppingCart, Loader2 } from "../common/Icons";
import { useCart } from "../../context/CartContext";

function getMainImage(product) {
  return product.images?.find((img) => img.isMain)?.url || product.images?.[0]?.url;
}

function getDiscountPercent(product) {
  return product.price > product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
}

function OfferProductCard({ product }) {
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
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:border-amber/40 hover:shadow-xl hover:-translate-y-1 transition-[transform,box-shadow,border-color] duration-300 will-change-transform shrink-0 w-48 sm:w-60 flex flex-col justify-between">
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
              -{discount}% OFF
            </span>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-ink/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-paper text-xs font-bold uppercase tracking-wider px-3 py-1 bg-ink/80 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        <div className="p-4 pb-2">
          <p className="text-[10px] font-bold text-amber uppercase tracking-wider line-clamp-1">
            {product.category || "Hot Deal"}
          </p>
          <Link to={`/products/${product._id}`}>
            <h3 className="text-sm font-semibold text-ink line-clamp-2 hover:text-amber transition-colors mt-1 leading-snug">
              {product.title}
            </h3>
          </Link>

          <div className="flex items-baseline gap-2 mt-2.5">
            <span className="font-display text-base sm:text-lg font-bold text-ink">
              ৳{product.salePrice.toLocaleString()}
            </span>
            {discount > 0 && (
              <span className="text-xs text-slate/50 line-through">
                ৳{product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 pt-1">
        <button
          type="button"
          disabled={outOfStock || pending}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product, 1);
          }}
          className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm ${
            outOfStock
              ? "bg-slate-100 text-slate/60 cursor-not-allowed"
              : "bg-ink text-paper hover:bg-amber hover:text-ink active:scale-95"
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {pending ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Adding...</span>
            </>
          ) : outOfStock ? (
            <span>Out of Stock</span>
          ) : (
            <>
              <ShoppingCart size={13} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default memo(OfferProductCard);