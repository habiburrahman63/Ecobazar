import ProductCard from "./ProductCard";

export default function ProductGrid({ products, className = "" }) {
    if (!products.length) {
        return (
            <div className="text-center py-20">
                <p className="text-slate">No products found.</p>
                <p className="text-sm text-slate/60 mt-1">Try adjusting your filters or search term.</p>
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5 ${className}`}>
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};