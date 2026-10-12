import { ShieldCheck } from "../common/Icons";

export default function OrderSummary({ items, subtotal, children }) {
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 100;
  const total = subtotal + shipping;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="p-6 sm:p-7">
        <h3 className="font-display text-xl font-bold text-ink mb-5">
          Order Review ({items.length} {items.length === 1 ? "item" : "items"})
        </h3>

      <div className="flex flex-col gap-3.5 max-h-72 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item._id || item.productId} className="flex gap-3.5 items-center">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/60">
                <img
                  src={item.image}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -top-1.5 -right-1.5 bg-ink text-paper text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-ink line-clamp-1">
                {item.title || item.name}
              </p>
              <p className="text-[11px] text-slate/70 mt-0.5">
                ৳{item.price.toLocaleString()} × {item.quantity}
              </p>
            </div>
            <span className="text-xs sm:text-sm font-bold text-ink shrink-0">
              ৳{(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 text-xs sm:text-sm pt-5 mt-5 border-t border-slate-100">
        <div className="flex justify-between text-slate">
          <span>Subtotal</span>
          <span className="text-ink font-bold">
            ৳{subtotal.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-slate">
          <span>Delivery Fee</span>
          <span className="text-ink font-bold">
            {shipping === 0 ? (
              <span className="text-emerald-700 font-extrabold">FREE</span>
            ) : (
              `৳${shipping}`
            )}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-baseline pt-5 mt-5 border-t border-slate-200">
        <div>
          <span className="text-base font-bold text-ink">Total Price</span>
          <p className="text-[10px] text-slate/70">Includes VAT & Taxes</p>
        </div>
        <span className="font-display text-2xl font-bold text-ink">
          ৳{total.toLocaleString()}
        </span>
      </div>

      {children && <div className="mt-6 pt-5 border-t border-slate-100">{children}</div>}
    </div>

    <div className="bg-slate-50/80 px-6 py-3.5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-semibold text-slate/70">
      <ShieldCheck size={14} className="text-emerald-600" />
      <span>Verified by AamarPay • Encrypted Transaction Protection</span>
    </div>
  </div>
  );
}