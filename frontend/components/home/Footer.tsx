"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-orange py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 pt-8 pb-12">
          {/* Logo à gauche */}
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

          {/* Les deux autres loin à droite */}
          <div className="flex flex-col md:flex-row md:gap-16 w-full justify-end">
            <div className="mb-8 md:mb-0">
              <h3 className="text-white font-bold mb-4">Plan du site</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white hover:underline">
                    Nos tarifs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:underline">
                    87 Teams
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:underline">
                    Se Chill Arrêter
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Nous contacter</h3>
              <button className="px-6 py-2.5 border-2 border-white text-white font-normal rounded-lg hover:bg-white hover:text-primary-orange transition-all duration-300">
                hello@izzzi.io
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/20 flex justify-end gap-3 items-center">
          <p className="text-white text-sm">Mentions légales</p>
          <p className="text-white text-sm">CGV</p>
        </div>
      </div>
    </footer>
  );
}
