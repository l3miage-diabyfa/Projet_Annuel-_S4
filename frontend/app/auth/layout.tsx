import React from "react";
import AuthTabs from "./components/AuthTabs";
import Image from "next/image";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={112}
          height={112}
          className="w-28 mb-4"
        />
      </Link>
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <AuthTabs />
        {children}
      </div>
    </div>
  );
}
