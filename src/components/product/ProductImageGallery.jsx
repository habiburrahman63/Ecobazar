import { useState, useMemo, memo } from "react";

function ProductImageGallery({ images = [] }) {
    // Main Image সবসময় প্রথমে দেখানো হয় (isMain না থাকলে প্রথম image)
    const mainFirst = useMemo(
        () => [...images].sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0)),
        [images]
    );
    const [active, setActive] = useState(mainFirst[0]?.url || "/placeholder-product.svg");

    if (!images.length) {
        return (
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center">
                <img
                    src="/placeholder-product.svg"
                    alt="Product placeholder"
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    // images বদলালে (যেমন নতুন main image নির্বাচন) active নিজে থেকে main image হয়
    const activeUrl = images.some((img) => img.url === active) ? active : mainFirst[0]?.url || "/placeholder-product.svg";

    return (
        <div className="flex flex-col-reverse sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-3">
                {images.map((img, i) => (
                    <button
                        key={img._id || img.url || i}
                        onClick={() => setActive(img.url)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${activeUrl === img.url ? "border-amber" : "border-transparent hover:border-ink/20"
                            }`}
                    >
                        <img
                            src={img.url || "/placeholder-product.svg"}
                            alt={`View ${i + 1}`}
                            decoding="async"
                            onError={(e) => {
                                if (!e.currentTarget.src.endsWith("/placeholder-product.svg")) {
                                    e.currentTarget.src = "/placeholder-product.svg";
                                }
                            }}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>

            <div className="flex-1 aspect-square rounded-xl overflow-hidden bg-slate-50">
                <img
                    src={activeUrl}
                    alt="Product"
                    fetchPriority="high"
                    decoding="async"
                    onError={(e) => {
                        if (!e.currentTarget.src.endsWith("/placeholder-product.svg")) {
                            e.currentTarget.src = "/placeholder-product.svg";
                        }
                    }}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}

export default memo(ProductImageGallery);