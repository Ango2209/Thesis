"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./(components)/Header/Header";
import Footer from "./(components)/Footer/Footer";
import StoreProvider, { useAppSelector } from "./redux";
import { ToastContainer } from "react-toastify";
import ChatBot from "./(components)/ChatBot/ChatBot";
import { usePathname } from "next/navigation";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NS HealthCare",
  description: "It's a simple progressive web application made with NextJS",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "next14", "pwa", "next-pwa"],
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-128x128.png" },
    { rel: "icon", url: "icons/icon-128x128.png" },
  ],
};

export const viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  shrinkToFit: "no",
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const standaloneRoutes = ["/login", "/register"];

  const isStandalonePage = standaloneRoutes.includes(pathname);
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />
        <StoreProvider>
        {isStandalonePage ? (
          children
        ) : (
          <div className="md:px-20 ">
            <Header />
            {children}
            <ChatBot />
            <Footer />
          </div>
          )}
        </StoreProvider>
      </body>
    </html>
  );
}
