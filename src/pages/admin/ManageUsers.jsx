import { useState, useEffect } from "react";
import { Search, AlertCircle } from "../../components/common/Icons";
import UserTable from "../../components/admin/UserTable";
import Modal from "../../components/common/Modal";
import {
  fetchAllUsers,
  fetchDeletedUsers,
  searchUsers,
  updateUser,
  deleteUser,
} from "../../api/userApi";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all' | 'deleted'
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      setUsers(data || []);
      setFilterType("all");
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteUser(id);
      setDeleteTarget(null);
      fetchUsers();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleShowDeleted = async () => {
    try {
      setLoading(true);
      const data = await fetchDeletedUsers();
      setUsers(data || []);
      setFilterType("deleted");
    } catch (error) {
      console.error("Error fetching deleted users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActive = async (id) => {
    try {
      await updateUser(id, { isDelete: false });
      fetchUsers();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchUsers();
      return;
    }
    try {
      setLoading(true);
      const data = await searchUsers(search.trim());
      setUsers(data || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (!val.trim()) {
      fetchUsers();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-ink/10 shadow-sm">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Users & Staff
          </h1>
          <p className="text-xs text-slate mt-1">
            {users.length} {filterType === "deleted" ? "archived / deleted" : "registered"} accounts found
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 rounded-xl border border-ink/15 text-xs font-bold text-ink hover:bg-ink/[0.03] transition-all self-start sm:self-auto cursor-pointer"
        >
          ↻ Refresh List
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onKeyDown={handleKeyDown}
              onChange={handleSearchChange}
              placeholder="Search by name, email, or telephone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink/15 bg-white text-xs text-ink placeholder:text-slate/40 focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2.5 bg-ink text-paper text-xs font-bold rounded-xl hover:bg-ink/90 transition-all shrink-0 cursor-pointer shadow-xs"
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={fetchUsers}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              filterType === "all"
                ? "bg-ink text-paper shadow-xs"
                : "bg-white border border-ink/15 text-slate hover:text-ink hover:bg-ink/[0.03]"
            }`}
          >
            Active Users
          </button>
          <button
            onClick={handleShowDeleted}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              filterType === "deleted"
                ? "bg-ink text-paper shadow-xs"
                : "bg-white border border-ink/15 text-slate hover:text-ink hover:bg-ink/[0.03]"
            }`}
          >
            Deleted Users
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-ink/10 shadow-sm">
          <div className="w-10 h-10 border-3 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate font-semibold uppercase tracking-wider">
            Loading Customer Directory...
          </p>
        </div>
      ) : (
        <UserTable
          users={users}
          handleDelete={handleDelete}
          onDeleteClick={setDeleteTarget}
          handleActive={handleActive}
        />
      )}

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Suspend / Delete User?"
        footer={
          <>
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate hover:bg-ink/[0.04] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteTarget?._id)}
              disabled={deleting}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {deleting ? "Deactivating..." : "Deactivate User"}
            </button>
          </>
        }
      >
        <p className="text-xs text-slate">
          Are you sure you want to deactivate{" "}
          <strong className="text-ink">
            {deleteTarget?.fullname || deleteTarget?.name || "this user"}
          </strong>
          ? The account will be archived and can be restored at any time from the Deleted Users tab.
        </p>
      </Modal>
    </div>
  );
}
