import axiosInstance, { API_BASE } from "./axiosInstance";

export { API_BASE };

/**
 * Normalizes backend product object for frontend components.
 */
export function normalizeProduct(raw) {
  if (!raw) return null;

  const price = Number(raw.price) || 0;
  const discount = Number(raw.discount) || 0;

  // Calculate sale price
  let salePrice = price;
  if (raw.discountType === "flat") {
    salePrice = price - discount;
  } else if (
    raw.discountType === "percent" ||
    raw.discountType === "percentage"
  ) {
    salePrice = price - (price * discount) / 100;
  }
  salePrice = Math.max(0, Math.round(salePrice));

  const images = (raw.images || []).map((img) => ({
    ...img,
    url: toAbsoluteImageUrl(img && img.url),
  }));

  return {
    ...raw,
    price,
    salePrice,
    stock: Number(raw.stock) || 0,
    images,
    averageRating: Number(raw.averageRating) || 0,
    numReviews: Number(raw.numReviews) || 0,
    tags: raw.tags || raw.tag || [],
  };
}

/**
 * Convert relative image path to absolute URL
 */
export function toAbsoluteImageUrl(url) {
  if (typeof url !== "string" || !url.trim()) return "";
  const value = url.trim().replace(/\\/g, "/");
  if (/^https?:\/\//i.test(value)) return value;
  return `${API_BASE}/${value.replace(/^\/+/, "")}`;
}

// In-memory set to prevent redundant image preloads
const preloadedImages = new Set();

/**
 * Preload product images into browser memory cache.
 * When user scrolls, images render in 0ms directly from cache without network latency.
 */
export function preloadProductImages(products = [], limit = 36) {
  if (typeof window === "undefined" || !Array.isArray(products)) return;
  const list = products.slice(0, limit);
  list.forEach((p) => {
    const url = p?.images?.find((img) => img.isMain)?.url || p?.images?.[0]?.url;
    if (url && !preloadedImages.has(url)) {
      preloadedImages.add(url);
      const img = new Image();
      img.decoding = "async";
      img.src = url;
    }
  });
}

export async function fetchAllProducts(params = {}) {
  const { data } = await axiosInstance.get("/getallproduct", { params });
  if (!data.success) throw new Error(data.message || "Failed to load products");
  const normalized = (data.product || []).map(normalizeProduct);
  preloadProductImages(normalized);
  return normalized;
}

export async function fetchActiveProducts(params = {}) {
  const products = await fetchAllProducts({ ...params, status: "active" });
  const active = products.filter((p) => p.status === "active");
  preloadProductImages(active);
  return active;
}

export async function fetchProductById(id) {
  const { data } = await axiosInstance.get(`/getsingleproduct/${id}`);
  if (!data.success) throw new Error(data.message || "Failed to load product");
  const normalized = normalizeProduct(data.singleProduct);
  if (normalized) preloadProductImages([normalized]);
  return normalized;
}

export async function createProductApi(formData) {
  const { data } = await axiosInstance.post("/createporduct", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!data.success) throw new Error(data.message || "Failed to create product");
  return data;
}

export async function updateProductApi(id, formData) {
  const { data } = await axiosInstance.put(`/getupdate/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!data.success) throw new Error(data.message || "Failed to update product");
  return data;
}

export async function deleteProductApi(id) {
  const { data } = await axiosInstance.delete(`/delete-product/${id}`);
  if (!data.success) throw new Error(data.message || "Failed to delete product");
  return data;
}
