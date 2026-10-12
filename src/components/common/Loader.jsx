import { Loader2 } from "./Icons";

export function PageLoader() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
            <Loader2 size={28} className="text-amber animate-spin" />
            <p className="text-sm text-slate">Loading...</p>
        </div>
    );
}

export function InlineLoader({ size = 16, className = "" }) {
    return <Loader2 size={size} className={`animate-spin ${className}`} />;
};