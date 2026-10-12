import { useParams, Link } from "react-router";
import {
  Mail,
  Phone,
  User as UserIcon,
  Package,
} from "../../components/common/Icons";
import OrderStatusBadge from "../../components/common/OrderStatusBadge";
import { useEffect, useState } from "react";
import { fetchUserById } from "../../api/userApi";
import { fetchUserOrders } from "../../api/orderApi";

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function getData() {
      try {
        setLoading(true);
        setError("");
        const [userData, userOrders] = await Promise.all([
          fetchUserById(id),
          fetchUserOrders(id),
        ]);
        if (mounted) {
          setUser(userData);
          setOrders(userOrders || []);
        }
      } catch (err) {
        console.error("Failed to load user details:", err);
        if (mounted) {
          setError(err.message || "Failed to load user data");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (id) {
      getData();
    }
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl border border-ink/10 shadow-sm">
        <div className="w-10 h-10 border-3 border-amber border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate font-semibold uppercase tracking-wider">
          Loading User Profile...
        </p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-ink/10 shadow-sm">
        <p className="text-slate text-xs">{error || "User account not found."}</p>
        <Link
          to="/admin/users"
          className="text-amber font-bold text-xs hover:underline mt-3 inline-block"
        >
          ← Return to Users Directory
        </Link>
      </div>
    );
  }

  const displayName = user.fullname || user.name || "Customer";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      <Link
        to="/admin/users"
        className="text-xs font-bold text-slate hover:text-ink transition-colors inline-flex items-center gap-1.5"
      >
        <span>← Back to Users Directory</span>
      </Link>

      {/* Profile banner */}
      <div className="flex items-center gap-5 bg-white p-6 rounded-3xl border border-ink/10 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ink to-[#1a2942] text-amber flex items-center justify-center font-display text-2xl font-bold shrink-0 border border-white/10 shadow-sm">
          {userInitial}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            {displayName}
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize border ${
                user.role === "admin"
                  ? "text-amber bg-amber/10 border-amber/25"
                  : "text-slate bg-ink/5 border-ink/10"
              }`}
            >
              {user.role || "user"}
            </span>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize border ${
                user.isEmailVerified
                  ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                  : "text-amber bg-amber/10 border-amber/20"
              }`}
            >
              {user.isEmailVerified ? "Verified Email" : "Unverified"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact info */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-ink/10 p-6 shadow-sm">
          <h2 className="font-display text-base font-bold text-ink mb-4">
            Contact Information
          </h2>
          <div className="flex flex-col gap-3.5 text-xs">
            <div className="flex items-center gap-3 text-slate">
              <Mail size={15} className="text-slate/60 shrink-0" />
              <span>{user.email || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3 text-slate">
              <Phone size={15} className="text-slate/60 shrink-0" />
              <span>{user.telephone || user.phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3 text-slate">
              <UserIcon size={15} className="text-slate/60 shrink-0" />
              <span>
                Registered{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-ink/10 p-6 shadow-sm">
          <h2 className="font-display text-base font-bold text-ink mb-4">
            Purchase History ({orders.length})
          </h2>
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-[#f8fafc] rounded-2xl border border-dashed border-ink/10">
              <Package size={22} className="text-slate/40 mx-auto mb-1.5" />
              <p className="text-xs text-slate">No orders placed by this customer yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 divide-y divide-ink/5">
              {orders.map((order) => {
                const total = Number(order.totalPrice || order.total) || 0;
                const orderDate = order.createdAt || order.date;
                return (
                  <div
                    key={order._id}
                    className="flex items-center justify-between pt-2.5 first:pt-0"
                  >
                    <div>
                      <p className="text-xs font-mono font-bold text-ink">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-[11px] text-slate mt-0.5">
                        {orderDate
                          ? new Date(orderDate).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-ink">
                        ৳{total.toLocaleString()}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
