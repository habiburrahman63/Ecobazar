import { X, MapPin, Phone, Mail, ShieldCheck } from "../common/Icons";
import OrderStatusBadge from "../common/OrderStatusBadge";

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrderDetailsDrawer({
  order,
  onClose,
  onStatusChange,
}) {
  if (!order) return null;

  const customerName =
    order.customer?.name ||
    order.shippingAddress?.fullName ||
    order.user?.name ||
    "Customer";
  const customerEmail =
    order.customer?.email || order.user?.email || "No email provided";
  const customerPhone =
    order.customer?.phone ||
    order.shippingAddress?.phone ||
    order.user?.telephone ||
    "No phone provided";

  const addressObj = order.shippingAddress;
  const formattedAddress =
    typeof order.address === "string"
      ? order.address
      : addressObj
      ? [
          addressObj.street || addressObj.address,
          addressObj.city,
          addressObj.postalCode,
          addressObj.country,
        ]
          .filter(Boolean)
          .join(", ")
      : "No address recorded";

  const orderItems = order.items || order.orderItems || [];
  const orderTotal = Number(order.total ?? order.totalPrice) || 0;
  const dateVal = order.date || order.createdAt;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-[#090e1a]/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#f8fafc] overflow-y-auto shadow-2xl flex flex-col z-10 border-l border-ink/10">
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-ink/10 bg-white sticky top-0 z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate/60">
              Order Receipt
            </span>
            <h2 className="font-mono text-sm font-bold text-ink">
              #{order._id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border border-ink/10 flex items-center justify-center text-slate hover:text-ink hover:bg-ink/[0.04] transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Status Control Card */}
          <div className="bg-white rounded-2xl border border-ink/10 p-4 shadow-xs">
            <p className="text-[11px] font-bold text-slate uppercase tracking-wider mb-2.5">
              Fulfillment Status
            </p>
            <div className="flex items-center justify-between gap-3">
              <OrderStatusBadge status={order.status} />
              <select
                value={order.status}
                onChange={(e) => onStatusChange(order._id, e.target.value)}
                className="text-xs font-semibold border border-ink/15 rounded-xl px-3 py-2 bg-white capitalize focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber cursor-pointer"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="bg-white rounded-2xl border border-ink/10 p-4 shadow-xs">
            <p className="text-[11px] font-bold text-slate uppercase tracking-wider mb-2.5">
              Customer & Delivery Address
            </p>
            <p className="text-sm font-bold text-ink mb-2">{customerName}</p>
            <div className="flex flex-col gap-2 text-xs text-slate">
              <div className="flex items-center gap-2.5">
                <Mail size={13} className="text-slate/60 shrink-0" />
                <span>{customerEmail}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={13} className="text-slate/60 shrink-0" />
                <span>{customerPhone}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={13} className="text-slate/60 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{formattedAddress}</span>
              </div>
            </div>
          </div>

          {/* Items breakdown */}
          <div className="bg-white rounded-2xl border border-ink/10 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-slate uppercase tracking-wider">
                Order Items ({orderItems.length})
              </p>
            </div>
            <div className="flex flex-col divide-y divide-ink/5">
              {orderItems.map((item, index) => {
                const itemTitle = item.title || item.name || "Product";
                const itemImg =
                  item.image ||
                  item.productId?.images?.[0]?.url ||
                  item.images?.[0]?.url ||
                  "";
                const itemPrice = Number(item.price || item.salePrice) || 0;
                const itemQty = Number(item.quantity) || 1;

                return (
                  <div key={item._id || index} className="flex items-center gap-3 py-2.5">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-ink/5 shrink-0 border border-ink/10">
                      {itemImg ? (
                        <img
                          src={itemImg}
                          alt={itemTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate/50">
                          Item
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-ink line-clamp-1">
                        {itemTitle}
                      </p>
                      <p className="text-[11px] text-slate/70">
                        Qty: {itemQty} × ৳{itemPrice.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-ink shrink-0">
                      ৳{(itemPrice * itemQty).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment & Audit Info */}
          <div className="bg-white rounded-2xl border border-ink/10 p-4 shadow-xs space-y-2 text-xs">
            <div className="flex justify-between text-slate">
              <span>Payment Gateway</span>
              <span className="text-ink font-semibold capitalize">
                {order.paymentMethod === "aamarpay"
                  ? "AamarPay (Online)"
                  : order.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : order.paymentMethod || "Direct"}
              </span>
            </div>

            {order.paymentStatus && (
              <div className="flex justify-between text-slate">
                <span>Payment Status</span>
                <span
                  className={`font-bold capitalize px-2 py-0.5 rounded text-[10px] ${
                    order.paymentStatus === "paid" || order.paymentStatus === "completed"
                      ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                      : order.paymentStatus === "failed"
                      ? "text-red-600 bg-red-50 border border-red-200"
                      : "text-amber bg-amber/10 border border-amber/20"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            )}

            {order.transactionId && (
              <div className="flex justify-between text-slate">
                <span>Transaction Ref</span>
                <span className="font-mono text-ink font-semibold">
                  {order.transactionId}
                </span>
              </div>
            )}

            <div className="flex justify-between text-slate">
              <span>Date Placed</span>
              <span className="text-ink font-medium">
                {dateVal
                  ? new Date(dateVal).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-ink/10">
              <span className="text-xs font-bold text-ink">Total Order Amount</span>
              <span className="font-display text-lg font-bold text-ink">
                ৳{orderTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}