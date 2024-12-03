"use client";
import React, { useEffect, useState } from "react";
import { Bell, Menu, Moon, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { useGetNotificationsByDoctorIdQuery } from "@/state/api";
import NotificationModal from "../NotificationModal";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };
  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };
  const [notifications, setNotifications] = useState([]);
  const { data: initialNotifications } = useGetNotificationsByDoctorIdQuery(
    "66c326e038ca0fcd63974456"
  );

  useEffect(() => {
    if (initialNotifications) {
      setNotifications(initialNotifications);
    }
  }, [initialNotifications]);
  const [isOpen, setIsOpen] = useState(false);

  const markAsRead = (index) => {
    const updatedNotifications = notifications.map((notification, i) => {
      if (i === index) {
        return { ...notification, isRead: true };
      }
      return notification;
    });
    setNotifications(updatedNotifications);
  };
  const unreadCount = notifications?.filter(
    (notification) => !notification.isRead
  ).length;

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  return (
    <div className="flex justify-between items-center w-full mb-7">
      {/* LEFT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <button
          className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100 block md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
      <div className="relative">
        <input
          type="search"
          placeholder="Start type to search "
          className="pl-10 pr-4 py-2 w-50 md:w-70 border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Bell className="text-gray-500" size={20} />
        </div>
      </div>
      <div className="flex justify-between items-center gap-5">
        <div className="hidden md:flex justify-between items-center gap-5">
          <div>
            <button onClick={toggleDarkMode}>
              {isDarkMode ? (
                <Sun className="cursor-pointer text-gray-500" size={24} />
              ) : (
                <Moon className="cursor-pointer text-gray-500" size={24} />
              )}
            </button>
          </div>
          <div className="relative">
            <div className="cursor-pointer relative" onClick={togglePopup}>
              <Bell className="text-gray-500" size={25} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {isOpen && (
              <NotificationModal
                notificationsList={notifications}
                markAsRead={markAsRead}
              />
            )}
          </div>
          <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-3 " />
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9">image</div>
            <span className="font-semibold">Nguyen Ngo</span>
          </div>
        </div>
        <Link href="/settings">
          <Settings className="cursor-pointer text-gray-500" size={24} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
