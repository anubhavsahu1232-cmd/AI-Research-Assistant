import { createContext, useContext, useState } from "react";
import {
  loginUser,
  registerUser,
  logoutUser
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      if (!data.id || !data.email || !data.token) {
        throw new Error("Invalid login response. Token missing.");
      }

      const currentUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
      };

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save user details
      localStorage.setItem("user", JSON.stringify(currentUser));

      setUser(currentUser);

      return data;

    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);

    try {
      return await registerUser(userData);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutUser();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN"
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};