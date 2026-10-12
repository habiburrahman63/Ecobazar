import axiosInstance from "./axiosInstance";
import { toAbsoluteImageUrl } from "./productApi";

export async function fetchCart(userId) {
  if (!userId) return [];
  try {
    const { data } = await axiosInstance.get(`/getcart/${userId}`);
    if (!data.success) return [];
    return (data.cart || []).map((item) => ({
      _id: item._id,
      productId: item.productId || item.product?._id,
      title: item.title,
      price: item.price,
      stock: item.stock || item.product?.stock || 0,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      image: toAbsoluteImageUrl(item.image),
    }));
  } catch (error) {
    console.error("fetchCart error:", error);
    return [];
  }
}

export async function addToCartApi(userId, product, quantity = 1) {
  const { data } = await axiosInstance.post("/cart/create", {
    proId: product._id,
    userId: userId,
    quantity: quantity,
  });
  if (!data.success) {
    throw new Error(data.message || "Failed to add product to cart");
  }
  return await fetchCart(userId);
}

export async function updateCartQuantityApi(userId, itemId, action) {
  const type = action === "increment" ? "plus" : "minus";
  const { data } = await axiosInstance.post(`/cart/update/${itemId}`, {
    type,
    userId,
  });
  if (!data.success) {
    throw new Error(data.message || "Failed to update item quantity");
  }
  return await fetchCart(userId);
}

export async function removeCartItemApi(userId, itemId) {
  const { data } = await axiosInstance.delete(`/deletecart/${itemId}`);
  if (!data.success) {
    throw new Error(data.message || "Failed to remove item from cart");
  }
  return await fetchCart(userId);
}

export async function clearCartApi(userId) {
  if (!userId) return [];
  const { data } = await axiosInstance.delete(`/clearcart/${userId}`);
  return [];
}