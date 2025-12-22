import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoNotificationsOutline } from "react-icons/io5";

export default function AdminNavbar() {
  return (
    <nav className="max-w-[98vw] fixed top-4 left-0 right-0 mx-auto bg-white rounded-xl shadow-sm px-8 py-4 z-50">
      <div className=" mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <div className="w-auto h-full rounded-full flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={112}
                height={112}
                className="w-16 sm:w-20"
              />
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center p-2 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex gap-2">
            <Link
              href="/dashboard/classes"
              className="flex-1 py-3 px-5 whitespace-nowrap rounded-sm font-medium text-center transition-colors bg-gray-900 text-white"
              aria-current={false}
            >
              Mes classes
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 py-3 px-5 whitespace-nowrap rounded-sm font-medium text-center transition-colors bg-transparent text-gray-900 hover:bg-gray-100"
              aria-current={true}
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <button className="p-2 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors">
            <IoNotificationsOutline className="w-6 h-6 text-gray-700" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
              alt="Yoann Caoulan"
              className="w-10 h-10 rounded-full bg-gray-400 grid"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                Yoann Caoulan
              </span>
              <span className="text-xs font-bold">Plan gratuit</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
