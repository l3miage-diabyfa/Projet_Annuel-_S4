import Link from "next/link";
import React from "react";
import { IoArrowBack } from "react-icons/io5";

interface BackButtonProps {
  text: string;
  href: string;
}

export default function BackButton({ text, href }: BackButtonProps) {
  return (
    <header className="px-6 py-4">
      <Link
        href={href}
        className="flex items-center gap-4 text-gray-700 hover:text-gray-900 transition-colors"
      >
        <div className="bg-white border-b border-gray-200 rounded-full h-10 w-10 flex items-center justify-center">
          <IoArrowBack className="w-5 h-5 rotate-45" />
        </div>
        <span className="text-sm underline">{text}</span>
      </Link>
    </header>
  );
}
