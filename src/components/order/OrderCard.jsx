import { useState } from "react";
import { Link } from "react-router";
import { ChevronDown, Package, ShieldCheck } from "../common/Icons";
import OrderStatusBadge from "../common/OrderStatusBadge";
import { toAbsoluteImageUrl } from "../../api/productApi";

export default function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  const orderDate = order.date || order.createdAt;
  const orderTotal = Number(order.total || order.totalPrice) || 0;
  const items = order.items || order.products || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all duration-200">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-slate-50/70 transition-colors"
      >
        <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
          <div>
            <p className="text-[10px] font-bold text-slate/70 uppercase tracking-wider">
              Order ID
            </p>
            <p className="text-xs sm:text-sm font-bold text-ink font-mono mt-0.5">
              {order._id}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate/70 uppercase tracking-wider">
              Date Placed
            </p>
            <p className="text-xs sm:text-sm font-semibold text-ink mt-0.5">
              {orderDate
                ? new Date(orderDate).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Recent"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate/70 uppercase tracking-wider">
              Total Amount
            </p>
            <p className="text-xs sm:text-sm font-bold text-ink mt-0.5">
              ৳{orderTotal.toLocaleString()}
            </p>
          </div>
          <div>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        <ChevronDown
          size={18}
          className={`text-slate/60 shrink-0 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="border-t border-slate-100 p-5 sm:p-6 bg-slate-50/40">
          <div className="flex justify-between items-center text-xs text-slate mb-4 flex-wrap gap-2 pb-3 border-b border-slate-100">
            <span>
              Payment Method:{" "}
              <strong className="text-ink uppercase font-bold">
                {order.paymentMethod || "AamarPay"}
              </strong>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              Status:{" "}
              <strong className="text-emerald-700 uppercase font-bold">
                {order.paymentStatus || "Verified"}
              </strong>
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {items.map((item, idx) => {
              const title = item.name || item.title || "Product";
              const price = Number(item.price) || 0;
              const quantity = Number(item.quantity) || 1;
              const imageUrl = toAbsoluteImageUrl(item.image);

              return (
                <div
                  key={item._id || idx}
                  className="flex items-center gap-3.5 bg-white p-3 rounded-xl border border-slate-200/60 shadow-inner"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={title}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          if (!e.currentTarget.src.endsWith("/placeholder-product.svg")) {
                            e.currentTarget.src = "/placeholder-product.svg";
                          }
                        }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate/40">
                        <Package size={16} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-ink font-semibold line-clamp-1">
                      {title}
                    </p>
                    <p className="text-xs text-slate mt-0.5">Quantity: {quantity}</p>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-ink shrink-0">
                    ৳{(price * quantity).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}