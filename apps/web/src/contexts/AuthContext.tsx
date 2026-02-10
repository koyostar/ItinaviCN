"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

/**
 * User data returned from authentication endpoints
 */
export interface User {
  id: string;
  username: string;
  email?: string;
  displayName?: string;
  userType: "Dev" | "User";
}

/**
 * Authentication context value
 */
interface AuthContextValue {
  /** Currently authenticated user, null if not logged in */
  user: User | null;
  /** JWT access token */
  token: string | null;
  /** Whether authentication state is being initialized */
  loading: boolean;
  /** Login with username and password */
  login: (username: string, password: string) => Promise<void>;
  /** Register a new user */
  register: (
    username: string,
    password: string,
    email?: string,
    displayName?: string
  ) => Promise<void>;
  /** Logout current user */
  logout: () => void;
  /** Check if user is authenticated */
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "itinavi_token";
const USER_KEY = "itinavi_user";

/**
 * Authentication provider component.
 * Manages user authentication state and provides login/logout functionality.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }

    setLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();

    // Store token and user data
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    setToken(data.accessToken);
    setUser(data.user);
  }, []);

  const register = useCallback(
    async (
      username: string,
      password: string,
      email?: string,
      displayName?: string
    ) => {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email, displayName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const data = await response.json();

      // Store token and user data
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      setToken(data.accessToken);
      setUser(data.user);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication context.
 * Must be used within an AuthProvider.
 *
 * @example
 * ```tsx
 * function ProfileButton() {
 *   const { user, logout, isAuthenticated } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <LoginButton />;
 *   }
 *
 *   return (
 *     <div>
 *       <span>{user.displayName}</span>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
