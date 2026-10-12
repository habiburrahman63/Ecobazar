import { useState, useEffect } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categoryApi";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Package,
  AlertCircle,
} from "../../components/common/Icons";
import Modal from "../../components/common/Modal";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({
    name: "",
    subcategories: "",
    icon: "Package",
    status: "active",
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete modal states
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchCategories();
      setCategories(data || []);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm({
      name: "",
      subcategories: "",
      icon: "Package",
      status: "active",
    });
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      subcategories: (cat.subcategories || []).join(", "),
      icon: cat.icon || "Package",
      status: cat.status || "active",
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError("Category name is required");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const payload = {
        name: form.name.trim(),
        subcategories: form.subcategories
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        icon: form.icon,
        status: form.status,
      };

      if (editingCategory) {
        await updateCategory(editingCategory._id, payload);
      } else {
        await createCategory(payload);
      }

      setModalOpen(false);
      await loadCategories();
    } catch (err) {
      setFormError(
        err.response?.data?.message || err.message || "Failed to save category"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget._id);
      setDeleteTarget(null);
      await loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-ink/10 shadow-sm">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Product Categories
          </h1>
          <p className="text-xs text-slate mt-1">
            Organize the storefront navigation and filterable product tags.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-ink text-paper text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-ink/90 transition-all shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink/15 bg-white text-xs text-ink placeholder:text-slate/40 focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 text-xs text-red-600 bg-red-50 rounded-2xl border border-red-200 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-ink/10 shadow-sm">
          <div className="w-10 h-10 border-3 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate font-semibold uppercase tracking-wider">
            Loading Categories...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-ink/10 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-ink/5 flex items-center justify-center mx-auto mb-3">
            <Package size={22} className="text-ink/40" />
          </div>
          <p className="text-ink text-xs font-bold">No categories found</p>
          <p className="text-[11px] text-slate/60 mt-1">
            Create your first category to organize your store catalog.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-ink/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-ink/10 text-left text-[11px] text-slate font-bold uppercase tracking-wider bg-[#f8fafc]">
                  <th className="px-5 py-3.5">Category Name</th>
                  <th className="px-5 py-3.5">Subcategories</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filtered.map((cat) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-[#f8fafc]/70 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-bold text-ink">
                      {cat.name}
                    </td>
                    <td className="px-5 py-3.5">
                      {cat.subcategories && cat.subcategories.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {cat.subcategories.map((sub) => (
                            <span
                              key={sub}
                              className="text-[10px] font-semibold bg-ink/5 text-ink/75 px-2.5 py-0.5 rounded-full border border-ink/10"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize border ${
                          cat.status === "active"
                            ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                            : "text-slate bg-ink/5 border-ink/10"
                        }`}
                      >
                        {cat.status || "active"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate hover:bg-ink/[0.04] hover:text-ink transition-colors cursor-pointer"
                          title="Edit category"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-red-500/70 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? "Edit Category" : "New Category"}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <InputField
            label="Category Name"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Electronics, Organic Groceries"
            error={formError}
          />

          <div>
            <label className="text-xs font-semibold text-ink block mb-1.5">
              Subcategories (comma separated)
            </label>
            <input
              type="text"
              value={form.subcategories}
              onChange={(e) =>
                setForm({ ...form, subcategories: e.target.value })
              }
              placeholder="e.g. Smart Watches, Audio Gear, Accessories"
              className="w-full px-3.5 py-2.5 rounded-xl border border-ink/15 text-xs text-ink placeholder:text-slate/40 focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink block mb-1.5">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-ink/15 text-xs text-ink bg-white focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all cursor-pointer"
            >
              <option value="active">Active (Visible in Store)</option>
              <option value="inactive">Inactive (Hidden)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2.5 mt-4 pt-4 border-t border-ink/10">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate hover:bg-ink/[0.04] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" loading={saving} className="px-5 text-xs">
              {editingCategory ? "Save Changes" : "Create Category"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Category?"
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
          Are you sure you want to delete category{" "}
          <strong className="text-ink">{deleteTarget?.name}</strong>?
          Products assigned to this category will become uncategorized.
        </p>
      </Modal>
    </div>
  );
}
