"use client";

import React from "react";
import { BiChevronRight } from "react-icons/bi";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="py-6 px-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="w-auto h-full rounded-full flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={112}
                height={112}
                className="w-20"
              />
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-4">
          <Link
            href="#"
            className="button-text flex items-center justify-center"
          >
            Nos tarifs
          </Link>
          <Link
            href="#"
            className="button-primary flex items-center justify-center"
          >
            J'essaie !
            <BiChevronRight className="w-5 h-5" />
          </Link>
          <Link
            href="/auth/signin"
            className="button-secondary flex items-center justify-center"
          >
            Se connecter
            <BiChevronRight className="w-5 h-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
