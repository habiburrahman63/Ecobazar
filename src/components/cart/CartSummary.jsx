import { Link } from "react-router";
import { ShieldCheck, Truck, Lock, ArrowRight } from "../common/Icons";
import PromoCodeInput from "./PromoCodeInput";

export default function CartSummary({ subtotal, itemCount = 0 }) {
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 100;
  const total = subtotal + shipping;
  const amountToFreeShipping = 2000 - subtotal;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 sticky top-24 overflow-hidden shadow-sm">
      <div className="p-6 sm:p-7">
        <h3 className="font-display text-xl font-bold text-ink mb-5">
          Order Summary
        </h3>

        {/* Free Shipping Progress Indicator */}
        {subtotal > 0 && subtotal < 2000 ? (
          <div className="mb-6 p-3.5 bg-amber/10 border border-amber/20 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink mb-2">
              <Truck size={14} className="text-amber shrink-0" />
              <span>Add ৳{amountToFreeShipping.toLocaleString()} more for Free Delivery</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber to-amber-hover transition-all duration-500"
                style={{ width: `${Math.min((subtotal / 2000) * 100, 100)}%` }}
              />
            </div>
          </div>
        ) : subtotal >= 2000 ? (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800">
            <Truck size={15} className="text-emerald-600" />
            <span>🎉 You qualify for Free Nationwide Shipping!</span>
          </div>
        ) : null}

        <div className="mb-5">
          <PromoCodeInput />
        </div>

        <div className="flex flex-col gap-3 text-xs sm:text-sm pt-4 border-t border-slate-100">
          <div className="flex justify-between text-slate">
            <span>
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
            <span className="text-ink font-bold">
              ৳{subtotal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-slate">
            <span>Estimated Shipping</span>
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
            <p className="text-[11px] text-slate/70">
              {shipping === 0 ? "Includes Free Delivery & all taxes" : "All taxes & delivery fee included"}
            </p>
          </div>
          <span className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            ৳{total.toLocaleString()}
          </span>
        </div>

        <Link
          to="/checkout"
          className={`flex items-center justify-center gap-2.5 text-center w-full py-4 rounded-2xl text-xs sm:text-sm font-bold mt-6 shadow-md transition-all duration-200 ${
            itemCount === 0
              ? "bg-slate-100 text-slate/40 pointer-events-none"
              : "bg-gradient-to-r from-amber to-amber-hover text-ink shadow-amber/20 hover:scale-[1.02] active:scale-95"
          }`}
        >
          <Lock size={15} /> Proceed to Secure Checkout <ArrowRight size={15} />
        </Link>
      </div>

      <div className="bg-slate-50/80 px-6 py-3.5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-semibold text-slate/70">
        <ShieldCheck size={14} className="text-emerald-600" />
        <span>AamarPay Verified • 256-bit SSL Protection</span>
      </div>
    </div>
  );
}