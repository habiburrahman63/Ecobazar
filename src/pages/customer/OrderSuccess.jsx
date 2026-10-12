import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Check, Package, ShieldCheck, ArrowRight, Sparkles } from "../../components/common/Icons";
import { verifyOrder } from "../../api/orderApi";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const tranId = searchParams.get("tranId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(tranId));

  useEffect(() => {
    // Immediately lock viewport to top on order success page load
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const rafId = requestAnimationFrame(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    });

    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    async function loadOrder() {
      if (!tranId) return;
      try {
        const data = await verifyOrder(tranId);
        setOrder(data);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo(0, 0);
      } catch (err) {
        console.error("Failed to load order info:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [tranId]);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center">
      {/* Animated Success Badge */}
      <div className="relative w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
        <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping pointer-events-none" />
        <Check size={36} className="text-emerald-600 stroke-[3]" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
        <Sparkles size={12} /> Payment Verified & Recorded
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
        Order Successfully Confirmed!
      </h1>
      <p className="text-slate text-sm sm:text-base mt-2.5 max-w-md mx-auto leading-relaxed">
        Thank you for shopping with EcoBazaar. We have received your order and our dispatch team is preparing it for shipment.
      </p>

      {/* Order Invoice Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 mt-8 text-left shadow-sm divide-y divide-slate-100">
        <div className="flex items-center gap-4 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center shrink-0 text-amber">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate/70 uppercase tracking-wider">
              Order Reference Number
            </p>
            <p className="text-sm sm:text-base font-bold text-ink font-mono mt-0.5">
              {orderId || order?._id || "Confirmed"}
            </p>
          </div>
        </div>

        <div className="py-4 flex flex-col gap-2.5 text-xs sm:text-sm">
          {tranId && (
            <div className="flex justify-between items-center text-slate">
              <span>AamarPay Transaction ID</span>
              <span className="font-mono text-ink font-bold">{tranId}</span>
            </div>
          )}

          {order?.totalPrice && (
            <div className="flex justify-between items-center text-slate">
              <span>Total Amount Paid</span>
              <span className="text-ink font-bold text-base">
                ৳{order.totalPrice.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-slate">
            <span>Payment Status</span>
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {order?.paymentStatus || "Paid"}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate">
            <span>Estimated Delivery</span>
            <span className="text-ink font-semibold">2 - 5 Business Days</span>
          </div>
        </div>

        <div className="pt-4 flex items-center gap-2 text-xs text-slate/70">
          <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
          <span>Server-to-server transaction verification confirmed via AamarPay</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3.5 mt-8">
        <Link
          to="/my-orders"
          className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber to-amber-hover text-ink text-sm font-bold shadow-md shadow-amber/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Track in My Orders <ArrowRight size={16} />
        </Link>
        <Link
          to="/products"
          className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl border border-slate-200 bg-white text-ink text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}