"use client";

import React from "react";
import Image from "next/image";
import { BiChevronRight } from "react-icons/bi";

export default function Hero() {
  return (
    <section className="relative pt-20 pb-62 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <h1 className="text-6xl lg:text-7xl font-bold text-dark leading-tight mb-8">
              Collectez
              <Image
                src="/images/arrow-orange.svg"
                alt=""
                width={64}
                height={64}
                className="inline-block w-16 h-16 ml-2"
              />
              <br />
              les{" "}
              <span className="border-b-4 border-primary-orange pb-1">
                retours
              </span>{" "}
              des
              <br />
              étudiants en live
            </h1>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-dark text-lg">
                <span className="text-primary-orange text-2xl">•</span>
                en tableau structurés
              </li>
              <li className="flex items-center gap-2 text-dark text-lg">
                <span className="text-primary-orange text-2xl">•</span>
                en partenariat
              </li>
            </ul>

            <button className="px-8 py-4 bg-primary-yellow text-dark font-bold text-lg rounded-lg hover:bg-primary-orange hover:text-white transition-all duration-300 flex items-center gap-3 transform hover:-translate-y-0.5">
              Essayer gratuitement
              <BiChevronRight className="w-6 h-6" />
            </button>

            <p className="mt-4 text-sm text-gray">
              Et oui, lancez-vous! C&apos;est gratuit et aucune carte bancaire
              n&apos;est demandée
            </p>

            <Image
              src="/images/arrow-yellow.svg"
              alt=""
              width={80}
              height={80}
              className="absolute -left-0 -bottom-25 w-20 h-20"
            />
          </div>
          <div className="absolute top-0 left-1/2 w-[75vw] z-10">
            <Image
              src="/images/hero-dashboard.png"
              alt="Dashboard"
              width={2400}
              height={1600}
              className="w-full"
            />
          </div>
        </div>
      </div>
      {/* ruban */}
      <div className="absolute z-10 bottom-0 left-0 right-0 h-32 bg-white transform skew-y-2 origin-bottom-left">
        <div className="bg-primary-orange py-3 overflow-hidden">
          <div className="flex items-center gap-8 text-white text-sm font-semibold whitespace-nowrap justify-center">
            <span>100% Made in France</span>
            <span>•</span>
            <span>Assistance ILLIMITÉE</span>
            <span>•</span>
            <span>Retours structurés</span>
            <span>•</span>
            <span>Qualiopi Friendly</span>
            <span>•</span>
            <span>Double satisfaction</span>
            <span>•</span>
            <span>Prêt qualité</span>
            <span>•</span>
            <span>Version gratuite à vie</span>
            <span>•</span>
            <span>+93% de retours</span>
          </div>
        </div>
      </div>
    </section>
  );
}
