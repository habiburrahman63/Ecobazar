import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, Star } from "../common/Icons";

function getMainImage(product) {
    return product.images?.find((img) => img.isMain)?.url || product.images?.[0]?.url;
}

function getDiscountPercent(product) {
    return product.price > product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
}

export default function HeroMiniShowcase({ products }) {
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (products.length <= 1) return;
        const timer = setInterval(() => {
            setActive((prev) => (prev + 1) % products.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [products.length]);

    if (!products.length) return null;
    const product = products[active];
    const image = getMainImage(product);
    const discount = getDiscountPercent(product);

    return (
        <div className="relative w-full max-w-70 mx-auto">
            {/* Soft glow behind card */}
            <div className="absolute -inset-4 bg-amber/15 rounded-3xl blur-2xl" />

            <div className="relative bg-paper/[0.06] border border-paper/15 rounded-2xl p-4 backdrop-blur-sm shadow-2xl">
                <Link to={`/products/${product._id}`} className="block">
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-paper/5">
                        <img
                            key={product._id}
                            src={image}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                        {discount > 0 && (
                            <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                -{discount}%
                            </span>
                        )}
                    </div>
                </Link>

                <div className="mt-3">
                    <p className="text-paper text-xs font-semibold line-clamp-1">{product.title}</p>

                    {product.numReviews > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                            <Star size={10} className="text-amber" fill="currentColor" />
                            <span className="text-[10px] text-paper/50">{product.averageRating.toFixed(1)} ({product.numReviews})</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                            <span className="font-display text-base font-semibold text-amber">৳{product.salePrice.toLocaleString()}</span>
                            {discount > 0 && (
                                <span className="text-[10px] text-paper/40 line-through">৳{product.price.toLocaleString()}</span>
                            )}
                        </div>
                        <Link
                            to={`/products/${product._id}`}
                            className="w-7 h-7 rounded-full bg-amber text-ink flex items-center justify-center hover:bg-amber/90 transition-colors shrink-0"
                            aria-label="View product"
                        >
                            <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>

                {/* Mini dots */}
                {products.length > 1 && (
                    <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-paper/10">
                        {products.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`h-1 rounded-full transition-all duration-300 ${i === active ? "w-4 bg-amber" : "w-1 bg-paper/25"
                                    }`}
                                aria-label={`Show product ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Small floating badge */}
            <div className="absolute -top-3 -right-3 bg-amber text-ink text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg rotate-3">
                Hot Deal 🔥
            </div>
        </div>
    );
};