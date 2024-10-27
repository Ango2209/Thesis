import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Change to fetch your auth state
  const router = useRouter();

  // Example of how you might check authentication state (e.g., from local storage)
  useEffect(() => {
    const token = localStorage.getItem("token"); // Example token check
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("token", "example-token"); // Set a token when logging in
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token"); // Clear token when logging out
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
