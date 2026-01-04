"use client";

import React from "react";
import Image from "next/image";

export default function StatsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          <div
            className="col-span-1 h-fit border-2 border-gray/10 rounded-xl p-8 bg-white"
            style={{ height: "100%" }}
          >
            <h2 className="text-6xl font-bold text-dark mb-6">+93%</h2>
            <p className="text-2xl font-semibold text-dark mb-4">
              de retours collectés en moyenne*
            </p>
            <p className="text-gray mb-6">
              Les étudiants savent que leur avis compte, qu'il sera écouté ou
              pris en compte lors même du semestre.
            </p>
            <p className="text-gray text-sm">
              Résultats : ils identifient à placer, virtuel, et plus vite.
            </p>
            <p className="text-xs text-gray mt-4">
              *par rapport avec une classe standard index
            </p>
          </div>
          <div className="col-span-2 h-full flex items-stretch">
            <div className="w-full h-full">
              <Image
                src="/images/students-group.jpg"
                alt="Students"
                width={1200}
                height={400}
                className="w-full h-full object-cover border-2 border-gray/10 rounded-xl"
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
