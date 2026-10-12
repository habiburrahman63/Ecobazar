import axiosInstance from "./axiosInstance";

export async function fetchCategories() {
  const { data } = await axiosInstance.get("/get-category");
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch categories");
  }
  return data.categories || [];
}

export async function createCategory(categoryData) {
  const { data } = await axiosInstance.post("/product-catgory", categoryData);
  if (!data.success) {
    throw new Error(data.message || "Failed to create category");
  }
  return data.category;
}

export async function updateCategory(id, categoryData) {
  const { data } = await axiosInstance.put(`/category/${id}`, categoryData);
  if (!data.success) {
    throw new Error(data.message || "Failed to update category");
  }
  return data.category;
}

export async function deleteCategory(id) {
  const { data } = await axiosInstance.delete(`/category/${id}`);
  if (!data.success) {
    throw new Error(data.message || "Failed to delete category");
  }
  return data;
}

