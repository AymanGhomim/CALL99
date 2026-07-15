import { create } from "zustand";

export type AuthRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "GROUND_TEAM"
  | "CUSTOMER_SERVICE"
  | "MANAGER"
  | "USER"
  | "CUSTOMER"
  | "PROVIDER";

export interface AuthUser {
  id: string;
  phone: string | null;
  fullName: string | null;
  avatarFileId: string | null;
  avatarDataUrl?: string | null;
  role: AuthRole;
  status: string;
  roles: AuthRole[];
  permissions: string[];
}

const BACKOFFICE_ROLES: ReadonlySet<AuthRole> = new Set([
  "SUPER_ADMIN",
  "ADMIN",
  "GROUND_TEAM",
  "CUSTOMER_SERVICE",
  "MANAGER",
]);

export function isBackofficeUser(user: AuthUser | null): boolean {
  return Boolean(user && (BACKOFFICE_ROLES.has(user.role) || user.roles.some((role) => BACKOFFICE_ROLES.has(role))));
}

const AUTH_ROLES: ReadonlySet<string> = new Set<AuthRole>([
  "SUPER_ADMIN", "ADMIN", "GROUND_TEAM", "CUSTOMER_SERVICE", "MANAGER", "USER", "CUSTOMER", "PROVIDER",
]);

function isAuthRole(value: unknown): value is AuthRole {
  return typeof value === "string" && AUTH_ROLES.has(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== "object") return false;
  const user = value as Record<string, unknown>;
  return typeof user.id === "string"
    && isNullableString(user.phone)
    && isNullableString(user.fullName)
    && isNullableString(user.avatarFileId)
    && (user.avatarDataUrl === undefined || isNullableString(user.avatarDataUrl))
    && isAuthRole(user.role)
    && typeof user.status === "string"
    && Array.isArray(user.roles)
    && user.roles.every(isAuthRole)
    && isStringArray(user.permissions);
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
  expiresIn?: number;
  user: AuthUser;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (session: AuthSession) => void;
  updateUser: (updates: Pick<AuthUser, "fullName" | "phone"> & { avatarDataUrl?: string | null }) => void;
  logout: () => void;
}

function getStoredUser(): AuthUser | null {
  const serializedUser = localStorage.getItem("user");
  if (!serializedUser) return null;

  try {
    const parsed: unknown = JSON.parse(serializedUser);
    return isAuthUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function parseAuthSession(value: string | null): AuthSession | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return null;

    const session = parsed as Record<string, unknown>;
    if (
      typeof session.accessToken !== "string"
      || typeof session.refreshToken !== "string"
      || typeof session.sessionId !== "string"
      || !isAuthUser(session.user)
      || (session.expiresIn !== undefined && typeof session.expiresIn !== "number")
    ) {
      return null;
    }

    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      sessionId: session.sessionId,
      ...(typeof session.expiresIn === "number" ? { expiresIn: session.expiresIn } : {}),
      user: session.user,
    };
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("accessToken"),
  user: getStoredUser(),

  setAuth: ({ accessToken, refreshToken, sessionId, user }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("sessionId", sessionId);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token: accessToken, user });
  },

  updateUser: (updates) => {
    set((state) => {
      if (!state.user) return state;
      const user = { ...state.user, ...updates };
      localStorage.setItem("user", JSON.stringify(user));
      return { user };
    });
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
    sessionStorage.removeItem("otp_flow");
    set({ token: null, user: null });
  },
}));
