import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "../common/Icons";
import HeroProductSlider from "./HeroProductSlider";

function getMainImage(product) {
    return product.images?.find((img) => img.isMain)?.url || product.images?.[0]?.url;
}

function getDiscountPercent(product) {
    return product.price > product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
}

export default function HeroSlider({ slides, offers = [] }) {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;
        const timer = setInterval(() => {
            setActive((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length, paused]);

    if (!slides.length) return null;
    const slide = slides[active];

    const goTo = (i) => setActive(i);
    const goPrev = () => setActive((prev) => (prev - 1 + slides.length) % slides.length);
    const goNext = () => setActive((prev) => (prev + 1) % slides.length);

    return (
        <section
            className="bg-ink relative overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Layered background accents */}
            <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,_theme(colors.amber)_1px,_transparent_0)] bg-[length:28px_28px]" />
            <div className="absolute top-0 right-0 w-125 h-125 bg-amber/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-100 h-100 bg-amber/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
                {slide.type === "promo" ? (
                    <PromoSlide slide={slide} offers={offers} />
                ) : (
                    <ProductSlide slide={slide} />
                )}
            </div>

            {/* Nav arrows */}
            <button
                onClick={goPrev}
                className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-paper/10 hover:bg-paper/20 items-center justify-center text-paper transition-colors z-20"
                aria-label="Previous slide"
            >
                <ChevronLeft size={18} />
            </button>
            <button
                onClick={goNext}
                className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-paper/10 hover:bg-paper/20 items-center justify-center text-paper transition-colors z-20"
                aria-label="Next slide"
            >
                <ChevronRight size={18} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                {slides.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-amber" : "w-1.5 bg-paper/25 hover:bg-paper/40"
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}

function PromoSlide({ slide, offers }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 bg-paper/10 border border-paper/15 rounded-full px-4 py-1.5 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
                    <span className="text-xs font-medium text-paper/80">{slide.tag}</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-paper leading-[1.1]">
                    {slide.title}
                </h1>

                <p className="text-paper/60 text-base sm:text-lg mt-5 max-w-md leading-relaxed">
                    {slide.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Link
                        to={slide.ctaLink}
                        className="inline-flex items-center justify-center gap-2 bg-amber text-ink font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-amber/90 hover:gap-3 transition-all duration-200"
                    >
                        {slide.ctaLabel} <ArrowRight size={16} />
                    </Link>
                    {slide.secondaryCtaLabel && (
                        <Link
                            to={slide.secondaryCtaLink}
                            className="inline-flex items-center justify-center gap-2 bg-paper/5 text-paper border border-paper/15 font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-paper/10 transition-colors"
                        >
                            {slide.secondaryCtaLabel}
                        </Link>
                    )}
                </div>

                {/* Inline stat row */}
                {slide.stats && (
                    <div className="flex items-center gap-6 sm:gap-8 mt-10 pt-8 border-t border-paper/10">
                        {slide.stats.map((stat) => (
                            <div key={stat.label}>
                                <p className="font-display text-2xl font-semibold text-paper">{stat.value}</p>
                                <p className="text-xs text-paper/50 mt-0.5">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right: rotating product showcase */}
            <div className="hidden lg:block">
                <HeroProductSlider products={offers} />
            </div>
        </div>
    );
}

function ProductSlide({ slide }) {
    const { product, tag, title, subtitle, ctaLabel } = slide;
    const image = getMainImage(product);
    const discount = getDiscountPercent(product);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 bg-paper/10 border border-paper/15 rounded-full px-4 py-1.5 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
                    <span className="text-xs font-medium text-paper/80">{tag}</span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-paper leading-[1.15]">
                    {title}
                </h1>
                <p className="text-paper/60 text-base mt-4 max-w-md">{subtitle}</p>

                <div className="flex items-center gap-3 mt-6">
                    <span className="font-display text-3xl font-semibold text-amber">৳{product.salePrice.toLocaleString()}</span>
                    {discount > 0 && (
                        <>
                            <span className="text-lg text-paper/40 line-through">৳{product.price.toLocaleString()}</span>
                            <span className="text-xs font-semibold text-ink bg-amber px-2.5 py-1 rounded-full">-{discount}%</span>
                        </>
                    )}
                </div>

                <Link
                    to={`/products/${product._id}`}
                    className="inline-flex items-center justify-center gap-2 bg-amber text-ink font-semibold text-sm px-7 py-3.5 rounded-xl mt-7 hover:bg-amber/90 hover:gap-3 transition-all duration-200"
                >
                    {ctaLabel || "Shop Now"} <ArrowRight size={16} />
                </Link>
            </div>

            <div className="hidden lg:flex justify-center">
                <div className="relative w-full max-w-sm">
                    <div className="absolute -inset-6 bg-amber/20 rounded-full blur-3xl" />
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-paper/5 border border-paper/10">
                        <img src={image} alt={product.title} className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </div>
    );
};