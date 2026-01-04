"use client";

import React from "react";
import AuthTabs from "./components/AuthTabs";
import GoogleErrorMessage from "@/components/shared/GoogleErrorMessage";
import { GoogleErrorProvider, useGoogleError } from "@/contexts/GoogleErrorContext";
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

function AuthContent({ children }: { children: React.ReactNode }) {
  const { googleError, setGoogleError } = useGoogleError();

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
      {googleError ? (
        <GoogleErrorMessage onBack={() => setGoogleError(false)} />
      ) : (
        <>
          <AuthTabs />
          {children}
        </>
      )}
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <GoogleErrorProvider>
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
        <AuthContent>{children}</AuthContent>
      </div>
    </GoogleErrorProvider>
  );
}
