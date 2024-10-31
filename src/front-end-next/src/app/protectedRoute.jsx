// protectedRoute.jsx

import { useAuth } from "./authContext"; // Assuming useAuth provides user role and other details
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const userRole= localStorage.getItem('userRole')
  console.log("Userr login",userRole) // user contains role details
  const router = useRouter();

  useEffect(() => {
    if (!userRole || (requiredRole && !requiredRole.includes(userRole))) {
      router.push("/login"); // redirect if not logged in or not authorized
    }
  }, [userRole, requiredRole, router]);

  if (!userRole || (requiredRole && !requiredRole.includes(userRole))) {
    return null; // Show a loader or fallback component while loading
  }

  return children;
};
