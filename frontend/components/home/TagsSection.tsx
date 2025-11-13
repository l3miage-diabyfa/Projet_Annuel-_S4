"use client";

import React from "react";

export default function TagsSection() {
  return (
    <section className="pt-12 px-6 overflow-hidden bg-white">
      <div className="w-full">
        <div className="flex gap-4 items-center justify-center flex-wrap">
          <div className="bg-primary-yellow rounded-full px-8 py-3 text-dark font-semibold transform -rotate-3 whitespace-nowrap">
            #LesProfs
          </div>
          <div className="bg-primary-orange rounded-full px-8 py-3 text-white font-semibold transform rotate-2 whitespace-nowrap">
            #ÉducationReliée
          </div>
          <div className="bg-primary-yellow rounded-full px-8 py-3 text-dark font-semibold transform -rotate-1 whitespace-nowrap">
            #DéfaireIAParLaFin
          </div>
          <div className="bg-primary-orange rounded-full px-8 py-3 text-white font-semibold transform rotate-3 whitespace-nowrap">
            #QualiopiFriendly
          </div>
          <div className="bg-primary-yellow rounded-full px-8 py-3 text-dark font-semibold transform -rotate-2 whitespace-nowrap">
            #ÉcoCreative
          </div>
          <div className="bg-primary-orange rounded-full px-8 py-3 text-white font-semibold transform rotate-1 whitespace-nowrap">
            #DoubleRéfaction
          </div>
          <div className="bg-primary-yellow rounded-full px-8 py-3 text-dark font-semibold transform -rotate-2 whitespace-nowrap">
            OF = éducation.on {"<"} 3
          </div>
          <div className="bg-primary-orange rounded-full px-8 py-3 text-white font-semibold transform rotate-1 whitespace-nowrap">
            #DoubleRéfaction
          </div>
        </div>
      </div>
    </section>
  );
}
