import { Minus, Plus, Loader2 } from "../common/Icons";

export default function QuantitySelector({ value, onIncrement, onDecrement, disabled, min = 1 }) {
    return (
        <div className="flex items-center border border-ink/15 rounded-lg overflow-hidden bg-white">
            <button
                onClick={onDecrement}
                disabled={disabled || value <= min}
                className="w-8 h-8 flex items-center justify-center text-ink/60 border-r border-ink/15
          hover:bg-ink hover:text-paper transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-ink/60"
            >
                <Minus size={13} />
            </button>
            <span className="w-9 flex items-center justify-center text-sm font-semibold text-ink">
                {disabled ? <Loader2 size={13} className="animate-spin text-ink/40" /> : value}
            </span>
            <button
                onClick={onIncrement}
                disabled={disabled}
                className="w-8 h-8 flex items-center justify-center text-ink/60 border-l border-ink/15
          hover:bg-ink hover:text-paper transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-ink/60"
            >
                <Plus size={13} />
            </button>
        </div>
    );
};