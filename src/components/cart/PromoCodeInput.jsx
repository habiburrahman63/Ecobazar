import { useState } from "react";
import { Tag, Check, X } from "../common/Icons";

export default function PromoCodeInput({ onApply }) {
    const [code, setCode] = useState("");
    const [applied, setApplied] = useState(null);
    const [error, setError] = useState("");

    const handleApply = (e) => {
        e.preventDefault();
        if (!code.trim()) return;

        // TODO: connect to a real promo/coupon validation endpoint once backend supports it
        setError("");
        setError("Invalid or expired promo code");
    };

    const handleRemove = () => {
        setApplied(null);
        setCode("");
        onApply?.(0);
    };

    if (applied) {
        return (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                    <Check size={14} className="text-green-600" />
                    <span className="text-sm text-green-700 font-medium">{applied.code} applied</span>
                </div>
                <button onClick={handleRemove} className="text-green-600 hover:text-green-800">
                    <X size={14} />
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleApply} className="flex flex-col gap-1.5">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate/40" />
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                            setError("");
                        }}
                        placeholder="Promo code"
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-ink/15 bg-white text-sm placeholder:text-slate/40
              focus:outline-none focus:ring-2 focus:ring-amber/20 focus:border-amber transition-all"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 rounded-lg border border-ink/20 text-ink text-sm font-semibold
            hover:bg-ink hover:text-paper hover:border-ink transition-colors shrink-0"
                >
                    Apply
                </button>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </form>
    );
};