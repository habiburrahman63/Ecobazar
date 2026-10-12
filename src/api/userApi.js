import axiosInstance from "./axiosInstance";

export async function fetchAllUsers() {
  const { data } = await axiosInstance.get("/allusers");
  if (!data.success && !data.userData) {
    throw new Error(data.message || "Failed to fetch users");
  }
  return data.userData || [];
}

export async function fetchDeletedUsers() {
  const { data } = await axiosInstance.get("/alldelete");
  return data.userData || [];
}

export async function searchUsers(name) {
  const { data } = await axiosInstance.post("/getsearch", { name });
  return data.userData || [];
}

export async function fetchUserById(id) {
  const { data } = await axiosInstance.get(`/singleuserid/${id}`);
  return data.userData;
}

export async function updateUser(id, updateData) {
  const { data } = await axiosInstance.post(`/update/${id}`, updateData);
  if (!data.success && !data.data) {
    throw new Error(data.message || "Failed to update user");
  }
  return data.data;
}

export async function deleteUser(id) {
  const { data } = await axiosInstance.delete(`/delete/${id}`);
  return data;
}

