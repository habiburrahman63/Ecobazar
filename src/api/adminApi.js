import axiosInstance from "./axiosInstance";

/**
 * Dedicated Admin Login API
 */
export async function adminLoginApi(email, password) {
  const { data } = await axiosInstance.post("/admin/login", {
    email,
    password,
  });
  return data;
}

/**
 * Fetch all registered administrators and staff members
 */
export async function fetchAdminsApi() {
  const { data } = await axiosInstance.get("/admin/list");
  return data.admins || [];
}

/**
 * Create a new administrator / staff account
 */
export async function createAdminApi(adminData) {
  const { data } = await axiosInstance.post("/admin/create", adminData);
  return data;
}

/**
 * Update an existing administrator account
 */
export async function updateAdminApi(id, updateData) {
  const { data } = await axiosInstance.put(`/admin/update/${id}`, updateData);
  return data;
}

/**
 * Activate or Deactivate an administrator account
 */
export async function toggleAdminStatusApi(id) {
  const { data } = await axiosInstance.patch(`/admin/toggle-status/${id}`);
  return data;
}

/**
 * Remove an administrator account safely
 */
export async function deleteAdminApi(id) {
  const { data } = await axiosInstance.delete(`/admin/delete/${id}`);
  return data;
}

/**
 * Change current administrator password
 */
export async function changeAdminPasswordApi(passwordData) {
  const { data } = await axiosInstance.post(
    "/admin/change-password",
    passwordData
  );
  return data;
}

/**
 * Fetch system audit logs
 */
export async function fetchAdminAuditLogsApi() {
  const { data } = await axiosInstance.get("/admin/audit-logs");
  return data.logs || [];
}

