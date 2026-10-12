import { Loader2 } from "lucide-react";

export default function Button({
    children,
    variant = "primary",
    loading,
    className = "",
    ...rest
}) {
    const base =
        "w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 " +
        "active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100 disabled:cursor-not-allowed " +
        "flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-ink text-paper hover:bg-ink/90 shadow-sm hover:shadow",
        accent: "bg-gradient-to-r from-amber to-amber-hover text-ink font-bold shadow-md shadow-amber/20 hover:scale-[1.01]",
        outline: "border border-ink/15 text-ink hover:bg-ink/5",
    };

    return (
        <button className={`${base} ${variants[variant]} ${className}`} disabled={loading} {...rest}>
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Please wait" : children}
        </button>
    );
};