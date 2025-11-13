import React from "react";
import AuthTabs from "./components/AuthTabs";
import Image from "next/image";
import Link from "next/link";
import { Inter, Mochiy_Pop_One } from "next/font/google";

// Police titres ( display )
const display = Mochiy_Pop_One({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mochiy",
});

// Police texte ( courant)
const text = Inter({
  weight: ["400","500","600"],
  subsets: ["latin"],
  variable: "--font-text",
});


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${display.variable} ${text.variable} bg-gray-100 min-h-screen flex flex-col items-center justify-center`}>
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
