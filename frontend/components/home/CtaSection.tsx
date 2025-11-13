"use client";

import React from "react";
import Image from "next/image";
import { BiChevronRight } from "react-icons/bi";

export default function CtaSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-primary-orange rounded-xl p-12 text-center text-white relative overflow-hidden">
          <div className="max-w-3xl mx-auto relative">
            <Image
              src="/images/arrow-orange.svg"
              alt=""
              width={80}
              height={80}
              className="absolute top-2 right-8 w-20 h-20"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <h2 className="text-4xl font-bold mb-4">
              Créez une classe test
              <br />
              en quelques minutes.
            </h2>
            <p className="text-lg mb-8 max-w-lg mx-auto">
              C'est gratuit, il n'est ni besoin carte carte, seulement les
              premières retours sont immédiats.
            </p>
            <Image
              src="/images/arrow-yellow.svg"
              alt=""
              width={64}
              height={64}
              className="absolute bottom-2 left-12 w-16 h-16"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <button className="button-primary mx-auto">
              Créer une classe gratuitement
              <BiChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
