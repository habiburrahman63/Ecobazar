import { useParams, useNavigate, Link } from "react-router";
import ProductForm from "../../components/product/ProductForm";
import { useEffect, useState } from "react";
import { fetchProductById } from "../../api/productApi";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchProductById(id);
        if (active) setProduct(data);
      } catch (err) {
        if (active) setError(err.message || "Failed to load product details");
      } finally {
        if (active) setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center bg-white rounded-3xl border border-ink/10 shadow-sm">
        <div className="w-10 h-10 border-3 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate font-semibold uppercase tracking-wider">
          Loading Product Details...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-ink/10 shadow-sm">
        <p className="text-xs text-slate">{error || "Product not found."}</p>
        <Link
          to="/admin/products"
          className="text-amber font-bold text-xs hover:underline mt-3 inline-block"
        >
          ← Return to Products List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-ink/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-ink">
              Edit Product
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-ink/5 text-ink/70">
              SKU: {product.sku || "N/A"}
            </span>
          </div>
          <p className="text-xs text-slate mt-1">
            Updating catalog specifications for "{product.title}".
          </p>
        </div>

        <Link
          to="/admin/products"
          className="px-4 py-2 rounded-xl border border-ink/15 text-xs font-bold text-slate hover:text-ink transition-all self-start sm:self-auto"
        >
          ← Back to Catalog
        </Link>
      </div>

      <ProductForm
        initialData={product}
        submitLabel="Save Changes"
        onSubmit={() => navigate("/admin/products")}
      />
    </div>
  );
}
