import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  Clock,
  Star,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from "../../components/common/Icons";
import OrderStatusBadge from "../../components/common/OrderStatusBadge";
import { fetchAllProducts } from "../../api/productApi";
import { fetchAllOrders } from "../../api/orderApi";
import { fetchAllUsers } from "../../api/userApi";

function getMainImage(product) {
  return (
    product.images?.find((img) => img.isMain)?.url ||
    product.images?.[0]?.url ||
    ""
  );
}

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboardData() {
      try {
        setLoading(true);
        setError("");
        const [prodsRes, ordersRes, usersRes] = await Promise.allSettled([
          fetchAllProducts(),
          fetchAllOrders(),
          fetchAllUsers(),
        ]);

        if (active) {
          if (prodsRes.status === "fulfilled") {
            setProducts(prodsRes.value || []);
          } else {
            console.error("Failed to load products:", prodsRes.reason);
          }

          if (ordersRes.status === "fulfilled") {
            setOrders(ordersRes.value || []);
          } else {
            console.error("Failed to load orders:", ordersRes.reason);
          }

          if (usersRes.status === "fulfilled") {
            setUsersCount((usersRes.value || []).length);
          } else {
            console.error("Failed to load users:", usersRes.reason);
          }

          if (
            prodsRes.status === "rejected" &&
            ordersRes.status === "rejected"
          ) {
            setError(
              ordersRes.reason?.message ||
                prodsRes.reason?.message ||
                "Failed to load dashboard metrics"
            );
          }
        }
      } catch (err) {
        if (active) setError(err.message || "Failed to load dashboard data");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboardData();
    return () => {
      active = false;
    };
  }, []);

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled" && o.paymentStatus !== "failed")
    .reduce((sum, o) => sum + (Number(o.total || o.totalPrice) || 0), 0);

  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10);
  const outOfStock = products.filter((p) => p.stock === 0);
  const recentOrders = [...orders].slice(0, 5);
  const topProducts = [...products]
    .sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0))
    .slice(0, 4);

  const stats = [
    {
      label: "Gross Revenue",
      value: `৳${totalRevenue.toLocaleString()}`,
      sub: "From verified paid orders",
      icon: TrendingUp,
      tone: "amber",
    },
    {
      label: "Catalog Products",
      value: products.length,
      sub: `${products.filter((p) => p.status === "active").length} active in store`,
      icon: Package,
      tone: "blue",
    },
    {
      label: "Registered Users",
      value: usersCount,
      sub: "Verified buyer accounts",
      icon: Users,
      tone: "green",
    },
    {
      label: "Customer Orders",
      value: orders.length,
      sub: `${orders.filter((o) => o.status === "delivered").length} delivered successfully`,
      icon: ShoppingBag,
      tone: "purple",
    },
  ];

  const toneStyles = {
    amber: "bg-amber/15 text-amber border-amber/25",
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    green: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    purple: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  };

  if (loading) {
    return (
      <div className="py-28 text-center bg-white rounded-3xl border border-ink/10 shadow-sm">
        <div className="w-10 h-10 border-3 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate text-xs font-semibold uppercase tracking-wider">
          Syncing Live Store Metrics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-ink/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-ink">
              Executive Dashboard
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live DB
            </span>
          </div>
          <p className="text-xs text-slate mt-1">
            Real-time sales performance, inventory alerts, and latest customer orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/products/create"
            className="px-4 py-2 rounded-xl bg-ink text-paper text-xs font-bold hover:bg-ink/90 transition-all shadow-sm"
          >
            + Add Product
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 rounded-xl border border-ink/15 text-ink text-xs font-bold hover:bg-ink/[0.03] transition-all"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, tone }) => (
          <div
            key={label}
            className="bg-white rounded-3xl border border-ink/10 p-5 shadow-[0_4px_20px_-4px_rgba(10,15,29,0.04)] hover:border-amber/40 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate uppercase tracking-wider">
                {label}
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${toneStyles[tone]}`}
              >
                <Icon size={17} />
              </div>
            </div>
            <p className="font-display text-2xl xl:text-3xl font-bold text-ink tracking-tight">
              {value}
            </p>
            <p className="text-[11px] text-slate/60 mt-1.5 truncate">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-ink/10 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                Recent Orders
              </h2>
              <p className="text-xs text-slate">
                Latest customer purchases requiring fulfillment
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber hover:text-amber/80 transition-colors"
            >
              View all ({orders.length}) <ArrowRight size={13} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-16 text-center text-slate text-xs bg-[#f8fafc] rounded-2xl border border-dashed border-ink/10">
              No orders have been recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-ink/10 text-slate uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {recentOrders.map((order) => {
                    const customerName =
                      order.customer?.name ||
                      order.shippingAddress?.fullName ||
                      order.user?.name ||
                      "Customer";
                    const total = Number(order.total || order.totalPrice) || 0;
                    return (
                      <tr
                        key={order._id}
                        className="hover:bg-ink/[0.02] transition-colors"
                      >
                        <td className="py-3 font-mono font-semibold text-ink">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="py-3 text-ink/80 font-medium">
                          {customerName}
                        </td>
                        <td className="py-3 font-bold text-ink">
                          ৳{total.toLocaleString()}
                        </td>
                        <td className="py-3">
                          <OrderStatusBadge status={order.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Inventory alerts (1 col) */}
        <div className="bg-white rounded-3xl border border-ink/10 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-amber" />
              <h2 className="font-display text-lg font-bold text-ink">
                Stock Alerts
              </h2>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
              {outOfStock.length + lowStock.length} alerts
            </span>
          </div>

          {outOfStock.length === 0 && lowStock.length === 0 ? (
            <div className="py-12 text-center text-slate text-xs bg-[#f8fafc] rounded-2xl border border-dashed border-ink/10">
              All inventory items are currently well-stocked.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 divide-y divide-ink/5">
              {outOfStock.map((p) => (
                <Link
                  key={p._id}
                  to={`/admin/products/edit/${p._id}`}
                  className="flex items-center gap-3 group pt-2.5 first:pt-0"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-ink/5 shrink-0 border border-ink/10">
                    <img
                      src={getMainImage(p)}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-ink truncate group-hover:text-amber transition-colors">
                      {p.title}
                    </p>
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-0.5">
                      Out of stock
                    </p>
                  </div>
                  <span className="text-slate/40 group-hover:text-ink transition-colors">
                    →
                  </span>
                </Link>
              ))}

              {lowStock.map((p) => (
                <Link
                  key={p._id}
                  to={`/admin/products/edit/${p._id}`}
                  className="flex items-center gap-3 group pt-2.5 first:pt-0"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-ink/5 shrink-0 border border-ink/10">
                    <img
                      src={getMainImage(p)}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-ink truncate group-hover:text-amber transition-colors">
                      {p.title}
                    </p>
                    <p className="text-[10px] text-amber font-bold mt-0.5">
                      Only {p.stock} units left
                    </p>
                  </div>
                  <span className="text-slate/40 group-hover:text-ink transition-colors">
                    →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Products Grid */}
      <div className="bg-white rounded-3xl border border-ink/10 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">
              Top Catalog Highlights
            </h2>
            <p className="text-xs text-slate">
              Most reviewed and popular store items
            </p>
          </div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber hover:text-amber/80 transition-colors"
          >
            Manage all products ({products.length}) <ArrowRight size={13} />
          </Link>
        </div>

        {topProducts.length === 0 ? (
          <p className="text-xs text-slate py-8 text-center">
            No products found in the catalog.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {topProducts.map((p) => (
              <Link
                key={p._id}
                to={`/admin/products/edit/${p._id}`}
                className="group p-3 rounded-2xl border border-ink/10 bg-[#f8fafc]/50 hover:bg-white hover:border-amber/40 hover:shadow-sm transition-all"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-ink/5 mb-2.5 relative border border-ink/5">
                  <img
                    src={getMainImage(p)}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-xs font-semibold text-ink truncate group-hover:text-amber transition-colors">
                  {p.title}
                </p>
                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <span className="font-bold text-ink">
                    ৳{p.salePrice.toLocaleString()}
                  </span>
                  <span className="text-slate/60">{p.stock} in stock</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
