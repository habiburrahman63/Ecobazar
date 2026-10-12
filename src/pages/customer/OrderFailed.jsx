import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { AlertCircle, RotateCcw, ArrowRight, Headphones } from "../../components/common/Icons";

export default function OrderFailed() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason") || "payment_failed";

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const getReasonMessage = () => {
    switch (reason) {
      case "payment_cancelled":
        return "The checkout process was cancelled on the AamarPay gateway page.";
      case "payment_verification_failed":
        return "Transaction verification with AamarPay gateway could not be validated. If money was deducted, it will auto-refund.";
      case "order_not_found":
        return "Could not match the transaction reference to an existing order in our records.";
      default:
        return "Payment could not be processed at this time. Don't worry, your cart items are securely preserved.";
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/10">
        <AlertCircle size={36} className="text-red-500 stroke-[2.5]" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold mb-3">
        Transaction Incomplete
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
        Payment Was Not Completed
      </h1>
      <p className="text-slate text-sm sm:text-base mt-2.5 max-w-md mx-auto leading-relaxed">
        {getReasonMessage()}
      </p>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 mt-8 shadow-sm text-center">
        <p className="text-xs font-bold text-slate uppercase tracking-wider mb-1">
          Need immediate assistance?
        </p>
        <p className="text-xs text-slate">
          Contact our 24/7 customer care team via phone or email:
        </p>
        <div className="flex items-center justify-center gap-4 mt-3 text-xs font-bold text-ink">
          <a href="tel:+8801816677503" className="hover:text-amber flex items-center gap-1">
            <Headphones size={13} className="text-amber" /> +880 18166 77503
          </a>
          <span>•</span>
          <a href="mailto:support@ecobazar.com" className="hover:text-amber">
            support@ecobazar.com
          </a>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3.5 mt-8">
        <button
          onClick={() => navigate("/checkout")}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber to-amber-hover text-ink text-sm font-bold shadow-md shadow-amber/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <RotateCcw size={16} /> Try Checkout Again
        </button>
        <Link
          to="/cart"
          className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl border border-slate-200 bg-white text-ink text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
        >
          Return to Cart <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}