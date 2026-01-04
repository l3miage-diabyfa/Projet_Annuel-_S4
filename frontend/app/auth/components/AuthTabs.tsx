"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export default function AuthTabs() {
  const pathname = usePathname();

  const isSignin = pathname === "/auth/signin";
  const isSignup = pathname === "/auth/signup";

  // Affiche les tabs seulement sur /auth/signin et /auth/signup
  if (!isSignin && !isSignup) {
    return null;
  }

  return (
    <div className="flex flex-col items-center mb-6 p-2 bg-background border border-gray-200 rounded-lg">
      <div className="flex w-full gap-2">
        <Link
          href="/auth/signin"
          className={`flex-1 py-3 rounded-sm font-medium text-center transition-colors ${
            isSignin
              ? "bg-gray-900 text-white"
              : "bg-transparent text-gray-900 hover:bg-gray-100"
          }`}
          aria-current={isSignin ? "page" : undefined}
        >
          Se connecter
        </Link>
        <Link
          href="/auth/signup"
          className={`flex-1 py-3 rounded-sm font-medium text-center transition-colors ${
            isSignup
              ? "bg-gray-900 text-white"
              : "bg-transparent text-gray-900 hover:bg-gray-100"
          }`}
          aria-current={isSignup ? "page" : undefined}
        >
          S&apos;inscrire
        </Link>
      </div>
    </div>
  );
}
