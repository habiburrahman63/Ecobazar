import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Package } from "../../components/common/Icons";
import OrderCard from "../../components/order/OrderCard";
import { fetchUserOrders } from "../../api/orderApi";
import { useAuth } from "../../context/AuthContext";

const filters = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      if (!user?._id) return;
      try {
        setLoading(true);
        setError("");
        const data = await fetchUserOrders(user._id);
        if (active) setOrders(data);
      } catch (err) {
        if (active) setError(err.message || "Failed to load orders");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      active = false;
    };
  }, [user?._id]);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">
        My Orders
      </h1>
      <p className="text-sm text-slate mb-6">
        Track and manage your real order history.
      </p>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors capitalize ${
              filter === f
                ? "bg-ink text-paper"
                : "bg-ink/5 text-ink/60 hover:bg-ink/10"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 bg-white rounded-xl border border-ink/10">
          <div className="w-8 h-8 border-4 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm text-center">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-ink/10">
          <div className="w-14 h-14 rounded-full bg-ink/5 flex items-center justify-center mx-auto mb-4">
            <Package size={22} className="text-ink/30" />
          </div>
          <p className="text-slate text-sm">
            No {filter !== "all" ? filter : ""} orders found.
          </p>
          <Link
            to="/products"
            className="text-amber text-sm font-medium hover:underline mt-2 inline-block"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}