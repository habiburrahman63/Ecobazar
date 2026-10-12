import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Package,
  Clock,
  Truck,
  Check,
  TrendingUp,
} from "../../components/common/Icons";
import OrderTable from "../../components/admin/OrderTable";
import OrderDetailsDrawer from "../../components/admin/OrderDetailsDrawer";
import { fetchAllOrders, updateOrderStatus } from "../../api/orderApi";

const statusFilters = [
  "all",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAllOrders();
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== "cancelled" && o.paymentStatus !== "failed")
      .reduce((sum, o) => sum + (Number(o.total || o.totalPrice) || 0), 0);
    const pending = orders.filter(
      (o) => o.status === "processing" || o.status === "pending"
    ).length;
    const shipped = orders.filter((o) => o.status === "shipped").length;
    return [
      {
        label: "Total Orders",
        value: orders.length,
        icon: Package,
        tone: "amber",
      },
      {
        label: "Pending Dispatch",
        value: pending,
        icon: Clock,
        tone: "blue",
      },
      {
        label: "Shipped & In Transit",
        value: shipped,
        icon: Truck,
        tone: "purple",
      },
      {
        label: "Gross Sales Revenue",
        value: `৳${revenue.toLocaleString()}`,
        icon: TrendingUp,
        tone: "green",
      },
    ];
  }, [orders]);

  const toneStyles = {
    amber: "bg-amber/15 text-amber border-amber/25",
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    green: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const id = o._id ? String(o._id).toLowerCase() : "";
      const customerName = (
        o.customer?.name ||
        o.shippingAddress?.fullName ||
        o.user?.name ||
        ""
      ).toLowerCase();
      const matchesSearch =
        id.includes(search.toLowerCase()) ||
        customerName.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      setSelectedOrder((prev) =>
        prev && prev._id === orderId ? { ...prev, status: newStatus } : prev
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to update order status"
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-ink/10 shadow-sm">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Customer Orders
          </h1>
          <p className="text-xs text-slate mt-1">
            Track nationwide shipments, verify transactions, and update delivery statuses.
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="px-4 py-2 rounded-xl border border-ink/15 text-xs font-bold text-ink hover:bg-ink/[0.03] transition-all self-start sm:self-auto cursor-pointer"
        >
          ↻ Refresh Orders
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div
            key={label}
            className="bg-white rounded-3xl border border-ink/10 p-5 shadow-xs flex items-center gap-3.5"
          >
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${toneStyles[tone]}`}
            >
              <Icon size={19} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate uppercase tracking-wider">
                {label}
              </p>
              <p className="font-display text-xl font-bold text-ink truncate mt-0.5">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
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
            placeholder="Search by Order ID or customer name..."
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
        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={loadOrders}
            className="text-xs font-bold underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-ink/10 shadow-sm">
          <div className="w-10 h-10 border-3 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate font-semibold uppercase tracking-wider">
            Loading Customer Orders...
          </p>
        </div>
      ) : (
        <OrderTable orders={filtered} onViewClick={setSelectedOrder} />
      )}

      <OrderDetailsDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}