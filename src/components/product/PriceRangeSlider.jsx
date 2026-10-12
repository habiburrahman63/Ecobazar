import { useState, useEffect, useRef, useCallback } from "react";
import { Tag } from "../common/Icons";

export default function PriceRangeSlider({ min = 0, max = 10000, value, onChange, step = 100 }) {
    const [localMin, setLocalMin] = useState(value?.[0] ?? min);
    const [localMax, setLocalMax] = useState(value?.[1] ?? max);
    const [dragging, setDragging] = useState(null); // "min" | "max" | null
    const trackRef = useRef(null);

    useEffect(() => {
        setLocalMin(value?.[0] ?? min);
        setLocalMax(value?.[1] ?? max);
    }, [value, min, max]);

    const percent = (val) => ((val - min) / (max - min)) * 100;

    const getValueFromPosition = useCallback(
        (clientX) => {
            const track = trackRef.current;
            if (!track) return min;
            const rect = track.getBoundingClientRect();
            const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
            const rawValue = min + ratio * (max - min);
            return Math.round(rawValue / step) * step;
        },
        [min, max, step]
    );

    const handleMove = useCallback(
        (clientX) => {
            const val = getValueFromPosition(clientX);
            if (dragging === "min") {
                setLocalMin(Math.min(val, localMax - step));
            } else if (dragging === "max") {
                setLocalMax(Math.max(val, localMin + step));
            }
        },
        [dragging, localMin, localMax, step, getValueFromPosition]
    );

    useEffect(() => {
        if (!dragging) return;

        const onMouseMove = (e) => handleMove(e.clientX);
        const onTouchMove = (e) => handleMove(e.touches[0].clientX);
        const onEnd = () => {
            setDragging(null);
            onChange([localMin, localMax]);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("touchmove", onTouchMove);
        window.addEventListener("mouseup", onEnd);
        window.addEventListener("touchend", onEnd);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("mouseup", onEnd);
            window.removeEventListener("touchend", onEnd);
        };
    }, [dragging, handleMove, localMin, localMax, onChange]);

    const handleMinInput = (e) => {
        const val = Math.min(Number(e.target.value) || min, localMax - step);
        setLocalMin(Math.max(val, min));
    };
    const handleMaxInput = (e) => {
        const val = Math.max(Number(e.target.value) || max, localMin + step);
        setLocalMax(Math.min(val, max));
    };
    const commitInputChange = () => onChange([localMin, localMax]);

    return (
        <div className="bg-white rounded-xl border border-ink/10 p-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                    <Tag size={14} className="text-amber" />
                </div>
                <h3 className="text-sm font-semibold text-ink">Price Range</h3>
            </div>

            {/* Slider track */}
            <div className="px-1 pt-1 pb-2">
                <div ref={trackRef} className="relative h-2 rounded-full bg-ink/8">
                    <div
                        className="absolute h-full rounded-full bg-gray-400"
                        style={{
                            left: `${percent(localMin)}%`,
                            right: `${100 - percent(localMax)}%`,
                        }}
                    />

                    {/* Min handle */}
                    <div
                        onMouseDown={() => setDragging("min")}
                        onTouchStart={() => setDragging("min")}
                        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-[3px] border-gray-400
              shadow-sm cursor-grab active:cursor-grabbing transition-transform touch-none
              ${dragging === "min" ? "scale-125 ring-4 ring-gray-300/40" : "hover:scale-110"}`}
                        style={{ left: `${percent(localMin)}%` }}
                    />

                    {/* Max handle */}
                    <div
                        onMouseDown={() => setDragging("max")}
                        onTouchStart={() => setDragging("max")}
                        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-[3px] border-gray-400
              shadow-sm cursor-grab active:cursor-grabbing transition-transform touch-none
              ${dragging === "max" ? "scale-125 ring-4 ring-gray-300/40" : "hover:scale-110"}`}
                        style={{ left: `${percent(localMax)}%` }}
                    />
                </div>
            </div>

            {/* Editable number inputs — no borders */}
            <div className="flex items-center gap-2 mt-3">
                <div className="flex-1">
                    <label className="text-[10px] font-medium text-slate/60 uppercase tracking-wide">Min</label>
                    <div className="flex items-center gap-1 mt-1 px-2.5 py-1.5 rounded-lg bg-ink/[0.04] focus-within:bg-ink/[0.07] transition-colors">
                        <span className="text-xs text-slate/50">৳</span>
                        <input
                            type="number"
                            value={localMin}
                            onChange={handleMinInput}
                            onBlur={commitInputChange}
                            className="w-full text-sm text-ink bg-transparent focus:outline-none"
                        />
                    </div>
                </div>

                <span className="text-slate/30 mt-4">—</span>

                <div className="flex-1">
                    <label className="text-[10px] font-medium text-slate/60 uppercase tracking-wide">Max</label>
                    <div className="flex items-center gap-1 mt-1 px-2.5 py-1.5 rounded-lg bg-ink/[0.04] focus-within:bg-ink/[0.07] transition-colors">
                        <span className="text-xs text-slate/50">৳</span>
                        <input
                            type="number"
                            value={localMax}
                            onChange={handleMaxInput}
                            onBlur={commitInputChange}
                            className="w-full text-sm text-ink bg-transparent focus:outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};