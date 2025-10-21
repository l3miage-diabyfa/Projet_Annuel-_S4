"use client";
import React, { useState } from "react";
import { BiChevronRight, BiMenu, BiX } from "react-icons/bi";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="w-full">
      {" "}
      <div className="max-w-[98vw] fixed top-4 left-0 right-0 mx-auto md:max-w-7xl bg-white rounded-2xl shadow-sm px-8 py-4 flex items-center justify-between sm:px-6 md:px-2 z-50">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" onClick={closeMenu}>
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

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-4">
          <Link
            href="#"
            className="whitespace-nowrap button-text flex items-center justify-center"
          >
            Nos tarifs
          </Link>
          <Link
            href="#"
            className="whitespace-nowrap button-primary !w-full flex items-center justify-center"
          >
            S&apos;inscrire
            <BiChevronRight className="w-5 h-5" />
          </Link>
          <Link
            href="/auth/signin"
            className="whitespace-nowrap button-secondary flex items-center justify-center"
          >
            Se connecter
            <BiChevronRight className="w-5 h-5" />
          </Link>
        </nav>

        {/* Burger Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Menu"
        >
          {isMenuOpen ? (
            <BiX className="w-6 h-6" />
          ) : (
            <BiMenu className="w-6 h-6" />
          )}
        </button>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          {/* Overlay avec animation */}
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden animate-fade-in backdrop-blur-sm"
            onClick={closeMenu}
          />

          {/* Menu Panel avec animation */}
          <nav className="fixed top-24 left-4 right-4 mx-auto max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8 z-50 md:hidden flex flex-col gap-3 animate-slide-down border border-gray-100">
            <Link
              href="#"
              className="button-text flex items-center justify-center w-full transform transition-all duration-200 hover:scale-105 py-3 rounded-xl"
              onClick={closeMenu}
            >
              Nos tarifs
            </Link>
            <div className="h-px bg-gray-100 my-1"></div>
            <Link
              href="#"
              className="button-primary flex items-center justify-center w-full transform transition-all duration-200 hover:scale-105 py-3 rounded-xl gap-1"
              onClick={closeMenu}
            >
              S&apos;inscrire
              <BiChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/signin"
              className="button-secondary flex items-center justify-center w-full transform transition-all duration-200 hover:scale-105 py-3 rounded-xl gap-1"
              onClick={closeMenu}
            >
              Se connecter
              <BiChevronRight className="w-5 h-5" />
            </Link>
          </nav>
        </>
      )}
      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}
