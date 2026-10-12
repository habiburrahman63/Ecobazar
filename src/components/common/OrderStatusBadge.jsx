import { Check, Truck, Clock, X } from "./Icons";

const statusConfig = {
    processing: { label: "Processing", color: "text-amber bg-amber/10", icon: Clock },
    shipped: { label: "Shipped", color: "text-blue-600 bg-blue-50", icon: Truck },
    delivered: { label: "Delivered", color: "text-green-600 bg-green-50", icon: Check },
    cancelled: { label: "Cancelled", color: "text-red-500 bg-red-50", icon: X },
};

export default function OrderStatusBadge({ status }) {
    const config = statusConfig[status] || statusConfig.processing;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${config.color}`}>
            <Icon size={12} />
            {config.label}
        </span>
    );
};