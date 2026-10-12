import axiosInstance from "./axiosInstance";

export async function loginApi(email, password) {
  const { data } = await axiosInstance.post("/login", { email, password });
  if (!data.success) {
    throw new Error(data.message || "Login failed");
  }
  return data;
}

export async function registerApi(formData) {
  const { data } = await axiosInstance.post("/registration", formData);
  if (!data.success) {
    throw new Error(data.message || "Registration failed");
  }
  return data;
}

export async function forgotPasswordApi(email) {
  const { data } = await axiosInstance.post("/forgotpassword", { email });
  if (!data.success) {
    throw new Error(data.message || "Failed to process forgot password request");
  }
  return data;
}

export async function resetPasswordApi(token, password, confirmPassword) {
  const { data } = await axiosInstance.post(`/resetpassword/${token}`, {
    password,
    confirmPassword,
  });
  if (!data.success) {
    throw new Error(data.message || "Failed to reset password");
  }
  return data;
}

export async function verifyEmailApi(token) {
  const { data } = await axiosInstance.post(`/verifyemail/${token}`);
  if (!data.success) {
    throw new Error(data.message || "Email verification failed");
  }
  return data;
}

export async function resendVerificationApi(email) {
  const { data } = await axiosInstance.post("/resendveryfication", { email });
  if (!data.success) {
    throw new Error(data.message || "Failed to resend verification email");
  }
  return data;
}

export async function getMeApi() {
  const { data } = await axiosInstance.get("/me");
  return data;
}

