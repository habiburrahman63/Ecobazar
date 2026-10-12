import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import { Search, Plus, Upload, AlertCircle } from "../../components/common/Icons";
import ProductTable from "../../components/admin/ProductTable";
import Modal from "../../components/common/Modal";
import { fetchAllProducts, deleteProductApi } from "../../api/productApi";

const statusFilters = ["all", "active", "pending", "inactive"];

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAllProducts();
      setProducts(data || []);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const titleMatches = p.title?.toLowerCase().includes(search.toLowerCase());
      const skuMatches = p.sku?.toLowerCase().includes(search.toLowerCase());
      const matchesSearch = titleMatches || skuMatches;
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProductApi(deleteTarget._id);
      setDeleteTarget(null);
      await loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-ink/10 shadow-sm">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Store Products
          </h1>
          <p className="text-xs text-slate mt-1">
            {products.length} total items listed in your live catalog
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/admin/products/bulk-upload"
            className="flex items-center gap-2 bg-white border border-ink/15 text-ink text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-ink/[0.03] transition-all"
          >
            <Upload size={14} /> Bulk Upload
          </Link>
          <Link
            to="/admin/products/create"
            className="flex items-center gap-2 bg-ink text-paper text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-ink/90 transition-all shadow-sm"
          >
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product title or SKU..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink/15 bg-white text-xs text-ink placeholder:text-slate/40 focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === s
                  ? "bg-ink text-paper shadow-xs"
                  : "bg-white border border-ink/15 text-slate hover:text-ink hover:bg-ink/[0.03]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-ink/10 shadow-sm">
          <div className="w-10 h-10 border-3 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate font-semibold uppercase tracking-wider">
            Loading Catalog Products...
          </p>
        </div>
      ) : (
        <ProductTable products={filtered} onDeleteClick={setDeleteTarget} />
      )}

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product?"
        footer={
          <>
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate hover:bg-ink/[0.04] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {deleting ? "Deleting..." : "Delete Permanently"}
            </button>
          </>
        }
      >
        <p className="text-xs text-slate">
          Are you sure you want to delete{" "}
          <strong className="text-ink">{deleteTarget?.title}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
