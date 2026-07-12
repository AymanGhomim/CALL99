import { create } from "zustand";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("accessToken"),
  user: getStoredUser(),

  setAuth: ({ accessToken, refreshToken, sessionId, user }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("sessionId", sessionId);
    localStorage.setItem("user", JSON.stringify(user));

    set({ token: accessToken, user });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("user");
    localStorage.removeItem("temp_token");
    localStorage.removeItem("login_phone");
    sessionStorage.removeItem("pending_auth");
    sessionStorage.removeItem("login_phone");
    sessionStorage.removeItem("login_otp");
    sessionStorage.removeItem("otp_expires_in");

    set({ token: null, user: null });
  },
}));
