"use client"; // Only this component is a Client Component

import { usePathname } from "next/navigation";
import Header from "./(components)/Header/Header";
import Footer from "./(components)/Footer/Footer";
import ChatBot from "./(components)/ChatBot/ChatBot";

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const standaloneRoutes = ["/login", "/register"];
  const isStandalonePage = standaloneRoutes.includes(pathname);

  return (
    <>
      {isStandalonePage ? (
        children
      ) : (
        <div className="md:px-20">
          <Header />
          {children}
          <ChatBot />
          <Footer />
        </div>
      )}
    </>
  );
}
