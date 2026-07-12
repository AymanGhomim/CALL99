import api from "./axios";

export const login = async (phone, password) => {
  const { data } = await api.post("/auth/login", {
    phone,
    password,
  });

  return data;
};

// TODO: غيّر المسار ده بالـ endpoint الحقيقي من Swagger لو مختلف.
// Swagger الحالي اللي اتبعت فيه response فقط بدون Endpoint.
export const requestRegistrationOtp = async (phone) => {
  const { data } = await api.post("/auth/register/request-otp", {
    phone,
  });

  return data;
};

export const verifyOtp = (data) => api.post("/auth/verify-otp", data);

export const resendOtp = (phone) => requestRegistrationOtp(phone);

export const logout = async () => {
  const sessionId = localStorage.getItem("sessionId");

  const { data } = await api.post("/auth/logout", {
    sessionId,
  });

  return data;
};
