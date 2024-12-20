import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  CalendarDays,
  CircleDollarSign,
  GraduationCap,
  House,
  Pill,
  ReceiptCent,
  Settings,
  Users,
  Newspaper,
  TestTubeDiagonal,
  ClipboardPlus,
  Stethoscope,
  BriefcaseMedical,
  Tablets,
  Menu,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
const handleLogout = () => {
  localStorage.clear();
};
const SidebarLink = ({ href, icon: Icon, label, isCollapsed }) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center h-16 rounded-lg
    ${isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"}
    hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors
     ${isActive ? "bg-blue-200 text-white" : ""}
    `}
      >
        <Icon className="w-6 h-6 !text-gray-700" />
        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-gray-700`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const userRole = localStorage.getItem("userRole");
  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } 
    bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${
          isSidebarCollapsed ? "px-5" : "px-8"
        }`}
      >
        <Image
          src="/logo.jpg"
          alt="edstock-logo"
          width={27}
          height={27}
          className={`${isSidebarCollapsed ? "hidden" : "block"} rounded w-8`}
        />
        <h1
          className={`${
            isSidebarCollapsed ? "hidden" : "block"
          } font-extrabold text-2xl`}
        >
          NSHEATH
        </h1>
        <button
          className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* LINKS */}
      <div className="flex-grow mt-8">
        <SidebarLink
          href="/dashboard"
          icon={House}
          label="Dashboard"
          isCollapsed={isSidebarCollapsed}
        />
        {userRole == "doctor" && (
          <SidebarLink
            href="/examine"
            icon={Stethoscope}
            label="Examine"
            isCollapsed={isSidebarCollapsed}
          />
        )}
        <SidebarLink
          href="/appointments-registration"
          icon={ClipboardPlus}
          label="Medical Appointment Registration"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/sell-medicine"
          icon={Tablets}
          label="Selling Medicine"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/patients"
          icon={Users}
          label="Patient"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/doctors"
          icon={GraduationCap}
          label="Doctors"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/appointments"
          icon={CalendarDays}
          label="Appointments"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/medical-tests"
          icon={TestTubeDiagonal}
          label="Medical Tests"
          isCollapsed={isSidebarCollapsed}
        />
        {userRole == "doctor" && (
          <SidebarLink
            href="/medical-services"
            icon={BriefcaseMedical}
            label="Services"
            isCollapsed={isSidebarCollapsed}
          />
        )}
        {userRole == "admin" && (
          <SidebarLink
            href="/payments"
            icon={CircleDollarSign}
            label="Payments"
            isCollapsed={isSidebarCollapsed}
          />
        )}
        {userRole == "admin" && (
          <SidebarLink
            href="/invoices"
            icon={ReceiptCent}
            label="Invoices"
            isCollapsed={isSidebarCollapsed}
          />
        )}
        <SidebarLink
          href="/medicine"
          icon={Pill}
          label="Medicine"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/blogs"
          icon={Newspaper}
          label="Blob"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/settings"
          icon={Settings}
          label="Settings"
          isCollapsed={isSidebarCollapsed}
        />
        <button onClick={handleLogout}>
          <SidebarLink
            href={"/login"}
            icon={Settings}
            label="Logout"
            isCollapsed={isSidebarCollapsed}
          />
        </button>
      </div>

      {/* FOOTER */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-gray-500">
          &copy; 2024 NgoSangHeathCare
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
