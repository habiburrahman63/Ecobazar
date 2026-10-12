import { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  Shield,
  Key,
  Plus,
  Edit,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Search,
} from "../../components/common/Icons";
import Modal from "../../components/common/Modal";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import {
  fetchAdminsApi,
  createAdminApi,
  updateAdminApi,
  toggleAdminStatusApi,
  deleteAdminApi,
  changeAdminPasswordApi,
  fetchAdminAuditLogsApi,
} from "../../api/adminApi";

export default function AdminSettings() {
  const { user: currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState("admins"); // 'admins' | 'security' | 'audit'

  // Admins state
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [adminError, setAdminError] = useState("");
  const [search, setSearch] = useState("");

  // Create Admin Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "manager",
  });
  const [createErrors, setCreateErrors] = useState({});
  const [creating, setCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState("");

  // Edit Admin Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    role: "manager",
  });
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState("");

  // Confirmation Modal State (Toggle status or Delete)
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: "", // 'toggle' | 'delete'
    targetAdmin: null,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  // Change Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordApiError, setPasswordApiError] = useState("");

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Load admins
  const loadAdmins = async () => {
    try {
      setLoadingAdmins(true);
      setAdminError("");
      const data = await fetchAdminsApi();
      setAdmins(data || []);
    } catch (err) {
      setAdminError(err.response?.data?.message || err.message || "Failed to load admins");
    } finally {
      setLoadingAdmins(false);
    }
  };

  // Load audit logs
  const loadLogs = async () => {
    try {
      setLoadingLogs(true);
      const data = await fetchAdminAuditLogsApi();
      setAuditLogs(data || []);
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  useEffect(() => {
    if (activeTab === "audit") {
      loadLogs();
    }
  }, [activeTab]);

  // Handle Create Admin Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!createForm.name.trim()) errs.name = "Full name is required.";
    if (!createForm.email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(createForm.email.trim()))
      errs.email = "Enter a valid email.";
    if (!createForm.password) errs.password = "Password is required.";
    else if (createForm.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    if (createForm.password !== createForm.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";

    if (Object.keys(errs).length) {
      setCreateErrors(errs);
      return;
    }

    setCreating(true);
    setCreateErrors({});
    setCreateSuccess("");

    try {
      const res = await createAdminApi(createForm);
      setCreateSuccess(res.message || "Administrator account created successfully.");
      setCreateForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "manager",
      });
      await loadAdmins();
      setTimeout(() => {
        setCreateModalOpen(false);
        setCreateSuccess("");
      }, 1500);
    } catch (err) {
      setCreateErrors({
        server:
          err.response?.data?.message ||
          err.message ||
          "Failed to create administrator account.",
      });
    } finally {
      setCreating(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setEditForm({
      name: admin.name || "",
      phone: admin.phone || "",
      role: admin.role || "manager",
    });
    setEditError("");
    setEditModalOpen(true);
  };

  // Handle Edit Admin Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      setEditError("Name cannot be empty.");
      return;
    }

    setEditing(true);
    setEditError("");

    try {
      await updateAdminApi(editingAdmin._id, editForm);
      setEditModalOpen(false);
      await loadAdmins();
    } catch (err) {
      setEditError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update administrator."
      );
    } finally {
      setEditing(false);
    }
  };

  // Handle Confirm Action (Toggle Status or Delete)
  const handleExecuteAction = async () => {
    const { type, targetAdmin } = confirmModal;
    if (!targetAdmin) return;

    setActionLoading(true);
    setActionError("");

    try {
      if (type === "toggle") {
        await toggleAdminStatusApi(targetAdmin._id);
      } else if (type === "delete") {
        await deleteAdminApi(targetAdmin._id);
      }
      setConfirmModal({ open: false, type: "", targetAdmin: null });
      await loadAdmins();
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Action could not be completed."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Change Password Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwordForm.currentPassword)
      errs.currentPassword = "Current password is required.";
    if (!passwordForm.newPassword)
      errs.newPassword = "New password is required.";
    else if (passwordForm.newPassword.length < 6)
      errs.newPassword = "New password must be at least 6 characters.";
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";

    if (Object.keys(errs).length) {
      setPasswordErrors(errs);
      return;
    }

    setPasswordLoading(true);
    setPasswordErrors({});
    setPasswordSuccess("");
    setPasswordApiError("");

    try {
      const res = await changeAdminPasswordApi(passwordForm);
      setPasswordSuccess(res.message || "Password updated successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordApiError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const filteredAdmins = admins.filter((a) => {
    const searchLow = search.toLowerCase();
    return (
      a.name?.toLowerCase().includes(searchLow) ||
      a.email?.toLowerCase().includes(searchLow) ||
      a.role?.toLowerCase().includes(searchLow)
    );
  });

  const activeAdminsCount = admins.filter((a) => !a.isHold && !a.isDelete).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-ink/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-ink">
              System Settings & Admin Security
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber/10 text-amber border border-amber/20 text-[11px] font-bold">
              <ShieldCheck size={13} />
              Protected
            </span>
          </div>
          <p className="text-xs text-slate mt-1">
            Manage administrative credentials, role-based access permissions, and system audit logs.
          </p>
        </div>

        {/* Tab selection pills */}
        <div className="flex items-center gap-1.5 bg-[#f8fafc] p-1.5 rounded-2xl border border-ink/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("admins")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "admins"
                ? "bg-ink text-paper shadow-xs"
                : "text-slate hover:text-ink hover:bg-ink/[0.04]"
            }`}
          >
            Administrators ({admins.length})
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "security"
                ? "bg-ink text-paper shadow-xs"
                : "text-slate hover:text-ink hover:bg-ink/[0.04]"
            }`}
          >
            Password & Security
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "audit"
                ? "bg-ink text-paper shadow-xs"
                : "text-slate hover:text-ink hover:bg-ink/[0.04]"
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: ADMINISTRATORS MANAGEMENT */}
      {/* ============================================================== */}
      {activeTab === "admins" && (
        <div className="space-y-6">
          {/* Quick stats strip & Add Admin button */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl border border-ink/10 p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate uppercase tracking-wider">
                  Total Staff Accounts
                </p>
                <p className="font-display text-2xl font-bold text-ink mt-0.5">
                  {admins.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber/15 text-amber border border-amber/25 flex items-center justify-center">
                <Users size={18} />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-ink/10 p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate uppercase tracking-wider">
                  Active Administrators
                </p>
                <p className="font-display text-2xl font-bold text-emerald-600 mt-0.5">
                  {activeAdminsCount}
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-ink/10 p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate uppercase tracking-wider">
                  Deactivated / Hold
                </p>
                <p className="font-display text-2xl font-bold text-slate mt-0.5">
                  {admins.length - activeAdminsCount}
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center">
                <Clock size={18} />
              </div>
            </div>
          </div>

          {/* Action bar: Search & Add button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search staff by name, email, or role..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink/15 bg-white text-xs text-ink placeholder:text-slate/40 focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all"
              />
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={loadAdmins}
                className="px-3.5 py-2 rounded-xl border border-ink/15 text-xs font-bold text-slate hover:text-ink hover:bg-ink/[0.04] transition-all cursor-pointer"
              >
                ↻ Refresh
              </button>
              <button
                onClick={() => {
                  setCreateErrors({});
                  setCreateSuccess("");
                  setCreateModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ink text-paper text-xs font-bold hover:bg-ink/90 transition-all shadow-sm cursor-pointer"
              >
                <Plus size={15} className="text-amber" />
                <span>Add Administrator</span>
              </button>
            </div>
          </div>

          {adminError && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{adminError}</span>
            </div>
          )}

          {/* Administrators Table */}
          {loadingAdmins ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-ink/10 shadow-sm">
              <div className="w-10 h-10 border-3 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate font-semibold uppercase tracking-wider">
                Loading Administrator Directory...
              </p>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-ink/10 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-ink/5 flex items-center justify-center mx-auto mb-3">
                <Shield size={22} className="text-ink/40" />
              </div>
              <p className="text-xs font-bold text-ink">
                No matching administrators found
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-ink/10 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-ink/10 text-left text-[11px] text-slate font-bold uppercase tracking-wider bg-[#f8fafc]">
                      <th className="px-5 py-3.5">Administrator</th>
                      <th className="px-5 py-3.5">System Role</th>
                      <th className="px-5 py-3.5">Account Status</th>
                      <th className="px-5 py-3.5">Last Console Login</th>
                      <th className="px-5 py-3.5">Provisioned By</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {filteredAdmins.map((admin) => {
                      const isSelf =
                        currentUser?._id?.toString() === admin._id?.toString() ||
                        currentUser?.id?.toString() === admin._id?.toString();

                      const isMasterAdmin =
                        admin.email === "admin@gmail.com";

                      return (
                        <tr
                          key={admin._id}
                          className="hover:bg-[#f8fafc]/70 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ink to-[#1a2942] text-amber flex items-center justify-center text-xs font-bold shrink-0 border border-white/10">
                                {admin.name?.[0]?.toUpperCase() || "A"}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-ink">
                                    {admin.name}
                                  </p>
                                  {isSelf && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber/15 text-amber border border-amber/25">
                                      You (Current)
                                    </span>
                                  )}
                                  {isMasterAdmin && !isSelf && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                                      Master Root
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate/70">
                                  {admin.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-3.5">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize border ${
                                admin.role === "admin"
                                  ? "text-amber bg-amber/10 border-amber/25"
                                  : admin.role === "manager"
                                  ? "text-blue-600 bg-blue-50 border-blue-200"
                                  : "text-purple-600 bg-purple-50 border-purple-200"
                              }`}
                            >
                              {admin.role}
                            </span>
                          </td>

                          <td className="px-5 py-3.5">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                admin.isHold
                                  ? "text-red-600 bg-red-50 border-red-200"
                                  : "text-emerald-700 bg-emerald-50 border-emerald-200"
                              }`}
                            >
                              {admin.isHold ? "Deactivated" : "Active"}
                            </span>
                          </td>

                          <td className="px-5 py-3.5 text-slate">
                            {admin.lastLogin
                              ? new Date(admin.lastLogin).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : "No record yet"}
                          </td>

                          <td className="px-5 py-3.5 text-slate">
                            {admin.createdBy?.name || "System Root"}
                          </td>

                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit details */}
                              <button
                                onClick={() => openEditModal(admin)}
                                className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate hover:bg-ink/[0.04] hover:text-ink transition-colors cursor-pointer"
                                title="Edit staff details"
                              >
                                <Edit size={14} />
                              </button>

                              {/* Toggle active status */}
                              <button
                                disabled={isSelf}
                                onClick={() => {
                                  setActionError("");
                                  setConfirmModal({
                                    open: true,
                                    type: "toggle",
                                    targetAdmin: admin,
                                  });
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                  isSelf
                                    ? "opacity-30 cursor-not-allowed text-slate bg-ink/5"
                                    : admin.isHold
                                    ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                                    : "text-amber bg-amber/10 hover:bg-amber/20"
                                }`}
                                title={
                                  isSelf
                                    ? "Cannot deactivate current session"
                                    : admin.isHold
                                    ? "Re-activate account"
                                    : "Deactivate account"
                                }
                              >
                                {admin.isHold ? "Activate" : "Deactivate"}
                              </button>

                              {/* Delete admin */}
                              <button
                                disabled={isSelf}
                                onClick={() => {
                                  setActionError("");
                                  setConfirmModal({
                                    open: true,
                                    type: "delete",
                                    targetAdmin: admin,
                                  });
                                }}
                                className={`w-8 h-8 rounded-lg inline-flex items-center justify-center transition-colors cursor-pointer ${
                                  isSelf
                                    ? "opacity-30 cursor-not-allowed text-slate"
                                    : "text-red-500/70 hover:bg-red-50 hover:text-red-600"
                                }`}
                                title={
                                  isSelf
                                    ? "Cannot delete current session"
                                    : "Remove administrator"
                                }
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
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PASSWORD & SECURITY SETTINGS */}
      {/* ============================================================== */}
      {activeTab === "security" && (
        <div className="max-w-2xl bg-white rounded-3xl border border-ink/10 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ink/10">
            <div className="w-10 h-10 rounded-2xl bg-amber/15 text-amber border border-amber/25 flex items-center justify-center">
              <Key size={18} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                Update Administrator Password
              </h2>
              <p className="text-xs text-slate">
                Securely change the login credentials for your active session ({currentUser?.email}).
              </p>
            </div>
          </div>

          {passwordSuccess && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordApiError && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{passwordApiError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-ink block mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50"
                />
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Enter your current password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink/15 text-xs text-ink placeholder:text-slate/40 focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all"
                />
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-[11px] text-red-500 mt-1">
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-ink block mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Key
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50"
                />
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink/15 text-xs text-ink placeholder:text-slate/40 focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all"
                />
              </div>
              {passwordErrors.newPassword && (
                <p className="text-[11px] text-red-500 mt-1">
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-ink block mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Key
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50"
                />
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Repeat new password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink/15 text-xs text-ink placeholder:text-slate/40 focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all"
                />
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-[11px] text-red-500 mt-1">
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                loading={passwordLoading}
                className="w-auto px-6 text-xs font-bold"
              >
                Save New Password
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: SYSTEM AUDIT LOGS */}
      {/* ============================================================== */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate">
              Showing recent security actions and administrator sessions ({auditLogs.length} entries).
            </p>
            <button
              onClick={loadLogs}
              className="px-3.5 py-1.5 rounded-xl border border-ink/15 text-xs font-bold text-slate hover:text-ink hover:bg-ink/[0.04] transition-all cursor-pointer"
            >
              ↻ Refresh Logs
            </button>
          </div>

          {loadingLogs ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-ink/10 shadow-sm">
              <div className="w-8 h-8 border-3 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate font-semibold uppercase tracking-wider">
                Loading Audit Trail...
              </p>
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-ink/10 shadow-sm">
              <p className="text-xs text-slate">No audit records logged yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-ink/10 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-ink/10 text-left text-[11px] text-slate font-bold uppercase tracking-wider bg-[#f8fafc]">
                      <th className="px-5 py-3.5">Timestamp</th>
                      <th className="px-5 py-3.5">Action Event</th>
                      <th className="px-5 py-3.5">Initiator / Actor</th>
                      <th className="px-5 py-3.5">Target Account</th>
                      <th className="px-5 py-3.5">Details</th>
                      <th className="px-5 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {auditLogs.map((log) => (
                      <tr
                        key={log._id}
                        className="hover:bg-[#f8fafc]/70 transition-colors"
                      >
                        <td className="px-5 py-3 text-slate font-mono text-[11px] whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>
                        <td className="px-5 py-3 font-mono font-semibold text-ink text-[11px]">
                          {log.action}
                        </td>
                        <td className="px-5 py-3 text-ink/80 font-medium">
                          {log.actorEmail || log.actorName || "System"}
                        </td>
                        <td className="px-5 py-3 text-slate">
                          {log.targetEmail || "—"}
                        </td>
                        <td className="px-5 py-3 text-slate max-w-xs truncate">
                          {log.details || "—"}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              log.status === "SUCCESS"
                                ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                : log.status === "FAILED"
                                ? "text-red-600 bg-red-50 border-red-200"
                                : "text-amber bg-amber/10 border-amber/20"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CREATE ADMINISTRATOR */}
      {/* ============================================================== */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Provision New Administrator"
      >
        <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
          <p className="text-xs text-slate -mt-2">
            Create an authorized administrator or manager account. Password will be hashed using salt rounds on the server.
          </p>

          {createSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{createSuccess}</span>
            </div>
          )}

          {createErrors.server && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{createErrors.server}</span>
            </div>
          )}

          <InputField
            label="Full Name"
            name="name"
            value={createForm.name}
            onChange={(e) =>
              setCreateForm({ ...createForm, name: e.target.value })
            }
            error={createErrors.name}
            placeholder="e.g. Tariq Rahman"
          />

          <InputField
            label="Administrator Email"
            name="email"
            type="email"
            value={createForm.email}
            onChange={(e) =>
              setCreateForm({ ...createForm, email: e.target.value })
            }
            error={createErrors.email}
            placeholder="staff@ecobazar.com"
          />

          <div>
            <label className="text-xs font-semibold text-ink block mb-1.5">
              Assigned Administrative Role
            </label>
            <select
              value={createForm.role}
              onChange={(e) =>
                setCreateForm({ ...createForm, role: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-ink/15 text-xs text-ink bg-white focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all cursor-pointer"
            >
              <option value="admin">Admin (Full Control & User Management)</option>
              <option value="manager">Manager (Orders & Products)</option>
              <option value="editor">Editor (Catalog & Categories)</option>
            </select>
          </div>

          <InputField
            label="Initial Password"
            name="password"
            type="password"
            value={createForm.password}
            onChange={(e) =>
              setCreateForm({ ...createForm, password: e.target.value })
            }
            error={createErrors.password}
            placeholder="At least 6 characters"
          />

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={createForm.confirmPassword}
            onChange={(e) =>
              setCreateForm({ ...createForm, confirmPassword: e.target.value })
            }
            error={createErrors.confirmPassword}
            placeholder="••••••••••••"
          />

          <div className="flex justify-end gap-2.5 pt-3 border-t border-ink/10">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate hover:bg-ink/[0.04] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" loading={creating} className="px-5 text-xs">
              Provision Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL: EDIT ADMINISTRATOR */}
      {/* ============================================================== */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Administrator Details"
      >
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
          {editError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{editError}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate block mb-1">
              Email Address (Immutable)
            </label>
            <p className="text-xs font-mono font-bold text-ink bg-[#f8fafc] px-3.5 py-2.5 rounded-xl border border-ink/10">
              {editingAdmin?.email}
            </p>
          </div>

          <InputField
            label="Full Name"
            name="name"
            value={editForm.name}
            onChange={(e) =>
              setEditForm({ ...editForm, name: e.target.value })
            }
            placeholder="Full Name"
          />

          <InputField
            label="Telephone / Phone"
            name="phone"
            value={editForm.phone}
            onChange={(e) =>
              setEditForm({ ...editForm, phone: e.target.value })
            }
            placeholder="+8801..."
          />

          <div>
            <label className="text-xs font-semibold text-ink block mb-1.5">
              Assigned Role
            </label>
            <select
              value={editForm.role}
              onChange={(e) =>
                setEditForm({ ...editForm, role: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-ink/15 text-xs text-ink bg-white focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all cursor-pointer"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-ink/10">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate hover:bg-ink/[0.04] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" loading={editing} className="px-5 text-xs">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL: CONFIRM ACTION (DEACTIVATE OR DELETE) */}
      {/* ============================================================== */}
      <Modal
        open={confirmModal.open}
        onClose={() =>
          setConfirmModal({ open: false, type: "", targetAdmin: null })
        }
        title={
          confirmModal.type === "delete"
            ? "Confirm Administrator Deletion"
            : confirmModal.targetAdmin?.isHold
            ? "Re-activate Administrator Account"
            : "Deactivate Administrator Access"
        }
        footer={
          <>
            <button
              onClick={() =>
                setConfirmModal({ open: false, type: "", targetAdmin: null })
              }
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate hover:bg-ink/[0.04] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleExecuteAction}
              disabled={actionLoading}
              className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-60 cursor-pointer ${
                confirmModal.type === "delete"
                  ? "bg-red-500 hover:bg-red-600"
                  : confirmModal.targetAdmin?.isHold
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-amber hover:bg-amber/90"
              }`}
            >
              {actionLoading
                ? "Processing..."
                : confirmModal.type === "delete"
                ? "Delete Permanently"
                : confirmModal.targetAdmin?.isHold
                ? "Confirm Activation"
                : "Confirm Deactivation"}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          {actionError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{actionError}</span>
            </div>
          )}

          <p className="text-xs text-slate">
            Are you sure you want to{" "}
            {confirmModal.type === "delete"
              ? "permanently remove"
              : confirmModal.targetAdmin?.isHold
              ? "activate"
              : "deactivate"}{" "}
            administrator access for{" "}
            <strong className="text-ink">
              {confirmModal.targetAdmin?.name} ({confirmModal.targetAdmin?.email})
            </strong>
            ?
          </p>

          {confirmModal.targetAdmin?.role === "admin" && (
            <div className="p-3 rounded-xl bg-amber/10 border border-amber/25 text-amber text-[11px]">
              ⚠️ Critical Account Notice: The system enforces a safeguard that
              prevents removal of the last remaining active administrator.
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

