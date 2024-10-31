import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Change to fetch your auth state
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // Example token check
    if (token) {
      setIsAuthenticated(true);
      router.push('/dashboard');
    }
  }, []);

  const login = async (username, password, role) => {
    const response = await axios.post('http://localhost:3002/auth/signIn', {
      username,
      password,
      role,
    });

    const { user, tokens } = response.data;
    localStorage.setItem("userRole",user.role)
    localStorage.setItem('accessToken', tokens.accessToken);

    localStorage.setItem('refreshToken', tokens.refreshToken);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("accessToken"); // Clear token when logging out
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
