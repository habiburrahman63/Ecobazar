import axiosInstance from "./axiosInstance";
import { toAbsoluteImageUrl } from "./productApi";

export function normalizeOrder(order) {
  if (!order) return null;
  const customerName =
    order.shippingAddress?.fullName ||
    (order.shippingAddress?.firstName || order.shippingAddress?.lastName
      ? `${order.shippingAddress.firstName || ""} ${order.shippingAddress.lastName || ""}`.trim()
      : order.user?.name || order.user?.fullname || "Customer");

  const customerEmail =
    order.shippingAddress?.email || order.user?.email || "N/A";
  const customerPhone =
    order.shippingAddress?.phone || order.user?.phone || order.user?.telephone || "N/A";

  const address = order.shippingAddress
    ? [
        order.shippingAddress.address,
        order.shippingAddress.city,
        order.shippingAddress.district,
        order.shippingAddress.postalCode || order.shippingAddress.postCode,
      ]
        .filter(Boolean)
        .join(", ")
    : "N/A";

  const items = (order.products || []).map((p, idx) => ({
    _id: p._id || p.product || idx,
    name: p.title || p.name || "Product",
    price: Number(p.price) || 0,
    quantity: Number(p.quantity) || 1,
    image: toAbsoluteImageUrl(p.image) || "/placeholder.png",
  }));

  const total = Number(order.totalPrice || order.total) || 0;

  return {
    ...order,
    customer: {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
    },
    address,
    items,
    total,
    date: order.createdAt || order.date || new Date().toISOString(),
    status: order.status || "processing",
    paymentMethod: (order.paymentMethod || "cod").toUpperCase(),
    paymentStatus: order.paymentStatus || "unpaid",
  };
}

export async function placeOrderApi(orderData) {
  const currentOrigin =
    typeof window !== "undefined" ? window.location.origin : "";
  const payload = {
    ...orderData,
    frontendUrl: currentOrigin,
  };
  const { data } = await axiosInstance.post("/payment", payload);
  if (!data.success) {
    throw new Error(data.message || "Failed to process order placement");
  }
  return data;
}

export async function fetchUserOrders(userId) {
  if (!userId) return [];
  const { data } = await axiosInstance.get(`/getorder/${userId}`);
  if (!data.success) {
    return [];
  }
  return (data.data || []).map(normalizeOrder);
}

export async function fetchAllOrders() {
  const { data } = await axiosInstance.get("/allorders");
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch all orders");
  }
  return (data.orders || data.data || []).map(normalizeOrder);
}

export async function updateOrderStatus(orderId, status) {
  const { data } = await axiosInstance.patch(`/order/status/${orderId}`, {
    status,
  });
  if (!data.success) {
    throw new Error(data.message || "Failed to update order status");
  }
  return data.order;
}

export async function verifyOrder(tranId) {
  const { data } = await axiosInstance.get(`/order/verify/${tranId}`);
  if (!data.success) {
    throw new Error(data.message || "Order verification failed");
  }
  return data.order;
}
