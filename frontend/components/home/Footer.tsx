"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-orange py-12 px-6">
      <div className="max-w-7xl mx-auto ">
        <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-8 pt-6 pb-8">

          <div className="flex-shrink-0 mb-8 md:mb-0 flex items-center">
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

          <div className="flex flex-col md:flex-row md:gap-16 text-center md:text-left">
            <div className="mb-8 md:mb-0 ">
              <h3 className="text-white font-mochiy mb-4 text-[16px]">Plan du site</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/tarifs" className="text-white text-[16px] hover:underline">
                    Nos tarifs
                  </a>
                </li>
                <li>
                  <a href="/auth/signup" className="text-white text-[16px] hover:underline">
                    S&apos;inscrire
                  </a>
                </li>
                <li>
                  <a href="/auth/signin" className="text-white text-[16px] hover:underline">
                    Se connecter
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-mochiy mb-4">Nous contacter</h3>
              <button className="px-6 py-2.5 border-2 border-white text-white text-[16px] font-normal rounded-lg hover:bg-white hover:text-primary-orange transition-all duration-300">
                hello@izzzi.io
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 flex justify-center md:justify-end gap-6 items-center ">
          <a href="/ml" className="text-white text-[16px] hover:underline">Mentions légales</a>
          <a href="/faq" className="text-white text-[16px] hover:underline">FAQ</a>
        </div>
      </div>
    </footer>
  );
}
