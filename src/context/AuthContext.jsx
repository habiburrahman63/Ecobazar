import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { loginApi, registerApi, getMeApi } from "../api/authApi";
import { adminLoginApi } from "../api/adminApi";

const AuthContext = createContext(null);
const USER_KEY = "userinfo";
const TOKEN_KEY = "token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });

  const [loading, setLoading] = useState(true);

  // Sync session on mount
  useEffect(() => {
    let mounted = true;
    async function verifySession() {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (savedToken) {
        try {
          const res = await getMeApi();
          if (mounted && res?.user) {
            setUser(res.user);
            localStorage.setItem(USER_KEY, JSON.stringify(res.user));
          }
        } catch {
          // Token expired or invalid
          if (mounted) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setUser(null);
            setToken(null);
          }
        }
      }
      if (mounted) setLoading(false);
    }
    verifySession();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await loginApi(email, password);
    const authToken = res.token;
    const userData = res.data;

    setToken(authToken);
    setUser(userData);

    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));

    return userData;
  }, []);

  const adminLogin = useCallback(async (email, password) => {
    const res = await adminLoginApi(email, password);
    const authToken = res.token;
    const userData = res.data;

    setToken(authToken);
    setUser(userData);

    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));

    return userData;
  }, []);

  const register = useCallback(async (formData) => {
    const res = await registerApi(formData);
    return res;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const updateUserProfile = useCallback((updatedData) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedData };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isAuthenticated = !!(user && token);
  const isAdmin = !!(
    user &&
    (user.role === "admin" || user.role === "manager" || user.role === "editor")
  );

  const contextValue = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      adminLogin,
      register,
      logout,
      updateUserProfile,
      isAuthenticated,
      isAdmin,
    }),
    [
      user,
      token,
      loading,
      login,
      adminLogin,
      register,
      logout,
      updateUserProfile,
      isAuthenticated,
      isAdmin,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
