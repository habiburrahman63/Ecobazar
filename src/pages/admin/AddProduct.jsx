import { Link, useNavigate } from "react-router";
import ProductForm from "../../components/product/ProductForm";
import { Upload } from "../../components/common/Icons";

export default function AddProduct() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-ink/10 shadow-sm">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Add New Product
          </h1>
          <p className="text-xs text-slate mt-1">
            Configure pricing, category, image assets, and promotional discounts.
          </p>
        </div>

        <Link
          to="/admin/products/bulk-upload"
          className="flex items-center gap-2 bg-white border border-ink/15 text-ink text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-ink/[0.03] transition-all self-start sm:self-auto"
        >
          <Upload size={14} className="text-amber" /> Bulk Excel Upload
        </Link>
      </div>

      <ProductForm
        submitLabel="Publish Product"
        onSubmit={() => navigate("/admin/products")}
      />
    </div>
  );
}