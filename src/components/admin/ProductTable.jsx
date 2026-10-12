import { Link } from "react-router";
import { Edit, Trash2 } from "../common/Icons";
import { toAbsoluteImageUrl } from "../../api/productApi";

function getMainImage(product) {
  const url =
    product.images?.find((img) => img.isMain)?.url || product.images?.[0]?.url;
  return toAbsoluteImageUrl(url);
}

function StatusBadge({ status }) {
  const styles = {
    active: "text-emerald-700 bg-emerald-50 border-emerald-200",
    pending: "text-amber bg-amber/10 border-amber/20",
    inactive: "text-slate bg-ink/5 border-ink/10",
  };
  return (
    <span
      className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize border ${
        styles[status] || styles.pending
      }`}
    >
      {status}
    </span>
  );
}

function SectionBadge({ section }) {
  if (!section) {
    return <span className="text-xs text-slate/40">—</span>;
  }
  return (
    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber/10 text-amber whitespace-nowrap border border-amber/20">
      {section}
    </span>
  );
}

export default function ProductTable({ products, onDeleteClick }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-ink/10 shadow-sm">
        <p className="text-slate text-xs font-semibold uppercase tracking-wider">
          No matching products found in catalog
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-ink/10 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-ink/10 text-left text-[11px] text-slate font-bold uppercase tracking-wider bg-[#f8fafc]">
              <th className="px-5 py-3.5">Product Title</th>
              <th className="px-5 py-3.5">SKU</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Section</th>
              <th className="px-5 py-3.5">Price</th>
              <th className="px-5 py-3.5">Stock</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {products.map((product) => {
              const currentPrice =
                Number(product.salePrice) ||
                (product.discountType === "flat"
                  ? product.price - product.discount
                  : product.discountType === "percentage"
                  ? product.price - (product.price * product.discount) / 100
                  : product.price);
              const hasDiscount = product.price > currentPrice;

              return (
                <tr
                  key={product._id}
                  className="hover:bg-[#f8fafc]/70 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-ink/5 shrink-0 border border-ink/10">
                        {getMainImage(product) && (
                          <img
                            src={getMainImage(product)}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span className="font-semibold text-ink line-clamp-1 max-w-xs">
                        {product.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate font-mono text-[11px]">
                    {product.sku || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-slate font-medium">
                    {product.category || "Uncategorized"}
                  </td>
                  <td className="px-5 py-3.5">
                    <SectionBadge section={product.section} />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-ink font-bold">
                      ৳{Number(currentPrice).toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-[10px] text-slate/40 line-through ml-1.5">
                        ৳{Number(product.price).toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {product.stock === 0 ? (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                        Out of stock
                      </span>
                    ) : product.stock <= 10 ? (
                      <span className="text-[10px] font-bold text-amber bg-amber/10 border border-amber/20 px-2 py-0.5 rounded-full">
                        {product.stock} (Low)
                      </span>
                    ) : (
                      <span className="text-ink font-semibold">
                        {product.stock}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate hover:bg-ink/[0.04] hover:text-ink transition-colors"
                        title="Edit product"
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        onClick={() => onDeleteClick(product)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500/70 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
