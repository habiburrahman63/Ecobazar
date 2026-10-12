import { Eye } from "../common/Icons";
import OrderStatusBadge from "../common/OrderStatusBadge";

export default function OrderTable({ orders, onViewClick }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-ink/10 shadow-sm">
        <p className="text-slate text-xs font-semibold uppercase tracking-wider">
          No orders found matching the filter criteria
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
              <th className="px-5 py-3.5">Order ID</th>
              <th className="px-5 py-3.5">Customer</th>
              <th className="px-5 py-3.5">Date Placed</th>
              <th className="px-5 py-3.5">Total Amount</th>
              <th className="px-5 py-3.5">Payment Method</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {orders.map((order) => {
              const customerName =
                order.customer?.name ||
                order.shippingAddress?.fullName ||
                order.user?.name ||
                "Customer";
              const customerEmail =
                order.customer?.email || order.user?.email || "—";
              const orderTotal =
                Number(order.total ?? order.totalPrice) || 0;
              const dateVal = order.date || order.createdAt;

              return (
                <tr
                  key={order._id}
                  className="hover:bg-[#f8fafc]/70 transition-colors"
                >
                  <td className="px-5 py-3.5 font-mono font-semibold text-ink">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-ink font-semibold">{customerName}</p>
                    <p className="text-[11px] text-slate/70">{customerEmail}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate">
                    {dateVal
                      ? new Date(dateVal).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-ink font-bold">
                    ৳{orderTotal.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-ink/5 text-ink/80 border border-ink/10">
                      {order.paymentMethod === "aamarpay"
                        ? "AamarPay (Online)"
                        : order.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : order.paymentMethod || "Direct"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onViewClick(order)}
                      className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate hover:bg-ink/[0.04] hover:text-ink transition-colors cursor-pointer"
                      title="Inspect order details"
                    >
                      <Eye size={15} />
                    </button>
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