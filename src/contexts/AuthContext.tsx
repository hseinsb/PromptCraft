"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  authInitialized: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Check for authentication in localStorage when component mounts
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    // Check if user is authenticated from localStorage
    const authStatus = localStorage.getItem("promptcraft-auth");
    setIsAuthenticated(authStatus === "authenticated");
    setLoading(false);
    setAuthInitialized(true); // Mark auth as initialized
    console.log(
      "Auth initialized, isAuthenticated:",
      authStatus === "authenticated"
    );
  }, []);

  async function login(password: string): Promise<boolean> {
    try {
      // Call the server-side API to verify the password
      const response = await fetch("/api/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      const isValid = data.success;

      if (isValid) {
        // Store authentication status in localStorage
        localStorage.setItem("promptcraft-auth", "authenticated");
        setIsAuthenticated(true);

        // Trigger a page reload to ensure all components properly initialize with auth
        // This is a simpler alternative to SSR/SSG for this specific app
        window.location.reload();
      }

      return isValid;
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    }
  }

  function logout() {
    // Clear authentication from localStorage
    localStorage.removeItem("promptcraft-auth");
    setIsAuthenticated(false);
  }

  const value = {
    isAuthenticated,
    loading,
    authInitialized,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
