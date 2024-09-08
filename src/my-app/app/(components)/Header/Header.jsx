"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function Header() {
  const Menu = [
    {
      id: 1,
      name: "Home",
      path: "/",
    },
    {
      id: 2,
      name: "Explore",
      path: "/explore",
    },
    {
      id: 3,
      name: "Contact Us",
      path: "/",
    },
  ];

  const { user } = useKindeBrowserClient();

  return (
    <div className="flex items-center justify-between p-4 shadow-sm">
      <div className="flex items-center gap-10">
        <Image
          src="https://cdn-icons-png.flaticon.com/512/2767/2767016.png"
          alt="edstock-logo"
          width={27}
          height={27}
          className="rounded w-8"
        />
        <ul className="md:flex flex gap-8 hidden">
          {Menu.map((item, index) => (
            <Link key={index} href={item.path}>
              <li className="hover:text-primary cursor-pointer hover:scale-105 transition-all ease-in-out">
                {item.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>
      {user ? (
        <Popover>
          <PopoverTrigger>
            {" "}
            <Image
              src={user?.picture}
              alt="user-avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          </PopoverTrigger>
          <PopoverContent className="w-44">
            <ul className="flex flex-col gap-2">
              <li className="cursor-pointer hover:bg-slate-100 p-2 rounded-md">
                Profile
              </li>
              <li className="cursor-pointer hover:bg-slate-100 p-2 rounded-md">
                My Booking
              </li>
              <li className="cursor-pointer hover:bg-slate-100 p-2 rounded-md">
                <LogoutLink>Logout</LogoutLink>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      ) : (
        <LoginLink>Get Started</LoginLink>
      )}
    </div>
  );
}

export default Header;
