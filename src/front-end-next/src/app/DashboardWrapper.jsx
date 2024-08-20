"use client"

import React, { Children, useEffect } from "react";
import Navbar from "./(components)/Navbar";
import Sidebar from "./(components)/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";


const DashboardLayout = ({ children }) => {
    const isSidebarCollapsed = useAppSelector((state)=>state.global.isSidebarCollapsed)
    const isDarkMode= useAppSelector((state)=>state.global.isDarkMode)

    useEffect(()=>{
        if(isDarkMode){
            document.documentElement.classList.add("dark")
        }else{
            document.documentElement.classList.add("light")
        }
    })
    return <StoreProvider>
        <div className={`${isDarkMode? "dark" : "light"} flex bg-gray-50 text-gray-900 w-full min-h-screen`}>
            <Sidebar />
            <main className={`flex flex-col w-full h-full py-7 px-9 bg-gray-200
                 ${isSidebarCollapsed? "md:pl-24" : "md:pl-72"}`}>
                {children}
                <Navbar />
            </main>
        </div>
    </StoreProvider>
}

const DashboardWrapper = ({ children }) => {
    return <StoreProvider>
        <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
}

export default DashboardWrapper;