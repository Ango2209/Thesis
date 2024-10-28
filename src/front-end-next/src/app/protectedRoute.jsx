// protectedRoute.jsx

import { useAuth } from "./authContext"; // Assuming useAuth provides user role and other details
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth(); // user contains role details
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (requiredRole && user.role !== requiredRole))) {
      router.push("/login"); // redirect if not logged in or not authorized
    }
  }, [user, loading, requiredRole, router]);

  if (loading || !user || (requiredRole && user.role !== requiredRole)) {
    return null; // Show a loader or fallback component while loading
  }

  return children;
};
