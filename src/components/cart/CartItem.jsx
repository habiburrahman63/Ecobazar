import { memo } from "react";
import { Link } from "react-router";
import { Trash2, Loader2 } from "../common/Icons";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "../../context/CartContext";

function CartItem({ item }) {
  const { incrementQuantity, decrementQuantity, removeFromCart, isPending } = useCart();
  const pending = isPending(item.productId);
  const atMaxStock = item.quantity >= item.stock;

  return (
    <div className="flex gap-4 sm:gap-6 p-4 sm:p-6 group items-center">
      {/* Product Image Thumbnail */}
      <Link
        to={`/products/${item.productId}`}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-200/60 shadow-inner"
      >
        <img
          src={item.image || "/placeholder-product.svg"}
          alt={item.title}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            if (!e.currentTarget.src.endsWith("/placeholder-product.svg")) {
              e.currentTarget.src = "/placeholder-product.svg";
            }
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Details & Price */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-3">
            <Link
              to={`/products/${item.productId}`}
              className="text-sm sm:text-base font-bold text-ink hover:text-amber transition-colors line-clamp-2 leading-snug"
            >
              {item.title}
            </Link>
            <button
              onClick={() => removeFromCart(item.productId)}
              disabled={pending}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate/50 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 disabled:opacity-30"
              aria-label="Remove item from cart"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <p className="text-xs font-semibold text-slate/70 mt-1">
            ৳{item.price.toLocaleString()} each
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <QuantitySelector
              value={item.quantity}
              onIncrement={() => incrementQuantity(item.productId)}
              onDecrement={() => decrementQuantity(item.productId)}
              disabled={pending}
            />
            {pending && (
              <Loader2 size={14} className="animate-spin text-amber" />
            )}
          </div>
          <span className="font-display text-base sm:text-lg font-bold text-ink">
            ৳{(item.price * item.quantity).toLocaleString()}
          </span>
        </div>

        {atMaxStock && (
          <p className="text-[11px] font-semibold text-amber mt-2">
            Maximum available stock reached ({item.stock} in stock)
          </p>
        )}
      </div>
    </div>
  );
}

export default memo(CartItem);