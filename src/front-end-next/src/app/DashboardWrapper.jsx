"use client";

import React, { useEffect } from "react";
import Navbar from "@/app/(components)/Navbar";
import Sidebar from "@/app/(components)/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";
import { usePathname } from "next/navigation";
import { AuthProvider } from "./authContext";
import { ProtectedRoute } from "./protectedRoute";

const DashboardLayout = ({ children }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.add("light");
    }
  });

  return (
    <div
      className={`${
        isDarkMode ? "dark" : "light"
      } flex bg-gray-50 text-gray-900 w-full min-h-screen`}
    >
      <Sidebar />
      <main
        className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${
          isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }) => {
  const pathname = usePathname();
  const standaloneRoutes = ["/login", "/register"];

  const isStandalonePage = standaloneRoutes.includes(pathname);

  return (
    <AuthProvider>
      <StoreProvider>
        {isStandalonePage ? (
          children
        ) : (
          <DashboardLayout>
            <ProtectedRoute requiredRole={['admin', 'doctor']}>{children} </ProtectedRoute>
          </DashboardLayout>
        )}
      </StoreProvider>
    </AuthProvider>
  );
};
export default DashboardWrapper;
