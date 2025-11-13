"use client";

import React from "react";
import Image from "next/image";

export default function FeaturesGrid() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Masonry layout */}
        <div className="flex flex-row items-end gap-6">
          {/* Colonne 1 */}
          <div className="flex flex-col gap-6 flex-1">
            {/* Card 1 */}
            <div className="break-inside-avoid bg-primary-yellow rounded-xl p-8 relative overflow-hidden flex flex-col justify-end">
              <div className="relative w-full h-50 mb-4 flex items-start justify-end">
                <span className="absolute top-0 right-0 font-pacifico text-dark text-center rotate-12 select-none">
                  ne soyez <br /> plus désolé
                </span>
              </div>
              <h3 className="text-2xl font-bold text-dark mb-4">
                Amélioration
                <br />
                continue
              </h3>
              <p className="text-dark text-sm leading-relaxed">
                Améliorez vos cours pendant qu'ils sont donnés. Recueillez les
                retours d'abord visuels, immédiatement, les retours plus
                structurés ensuite égalem.
              </p>
            </div>
            {/* Card 4 */}
            <div className="break-inside-avoid bg-white rounded-xl p-8 relative overflow-hidden border-2 border-gray/10 flex flex-col justify-end">
              <div className="relative w-full h-54 mb-4 flex items-start justify-end">
                <span className="absolute top-0 right-0 font-pacifico text-dark text-center rotate-12 select-none">
                  Mieux que <br />
                  mieux !
                </span>
              </div>
              <h3 className="text-2xl font-bold text-dark mb-4">
                Qualiopi Friendly
              </h3>
              <p className="text-dark text-sm leading-relaxed">
                Une méthodologie enrichie et développée (et challenger) en tant
                qu'indicateur SI. Résultats. Des retours pertinents utilisables
                pour l'indicateur des évaluations
              </p>
            </div>
          </div>
          {/* Colonne 2 */}
          <div className="flex flex-col gap-6 flex-1">
            {/* Card 2 */}
            <div className="break-inside-avoid bg-white rounded-xl p-8 relative border-2 border-gray/10 flex flex-col justify-end">
              <div className="relative w-full h-48 mb-4 flex items-start justify-end">
                <span className="absolute top-0 right-0 font-pacifico text-dark text-center rotate-12 select-none">
                  Mieux que <br />
                  mieux !
                </span>
                <Image
                  src="/images/arrow-orange-down.png"
                  alt=""
                  width={64}
                  height={64}
                  className="w-16 h-16 absolute -top-15 right-15"
                />
              </div>
              <h3 className="text-2xl font-bold text-dark mb-4">
                Double
                <br />
                satisfaction
              </h3>
              <p className="text-dark text-sm leading-relaxed">
                Vos effectifs sont écoutés, vous intervenez en live-moment,
                résultat: un sentiment d'écoute et une progression améliorée.
              </p>
            </div>
            {/* Card 5 */}
            <div className="break-inside-avoid bg-primary-orange rounded-xl p-8 relative overflow-hidden text-white flex flex-col justify-end">
              <div className="relative w-full h-38 mb-4 flex items-end justify-end">
                <span className="absolute top-0 right-0 font-pacifico text-dark text-center rotate-12 select-none">
                  Même <br />
                  pas peur !
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Retours garantis
                <br />
                100% sincères
              </h3>
              <p className="text-sm leading-relaxed">
                Notre retours collectés dans un étudiants rédendent leurs compte
                sur toute confentielle les retours sont sincères
              </p>
            </div>
          </div>
          {/* Colonne 3 */}
          <div className="flex flex-col gap-6 flex-1">
            {/* Card 3 */}
            <div className="break-inside-avoid bg-primary-orange rounded-xl p-8 relative overflow-hidden text-white flex flex-col justify-end">
              <div className="relative w-full h-72 mb-4 flex items-start justify-end">
                <span className="absolute top-0 right-0 font-pacifico text-dark text-center rotate-12 select-none">
                  Vous n’avez <br />
                  pas le temps !
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                L'IA est là pour
                <br />
                vous assister
              </h3>
              <p className="text-sm leading-relaxed">
                Fait maison, nos retours pertinent vous aident à synthétiser et
                analyser une réponse efficace
              </p>
            </div>
            {/* Card 6 */}
            <div className="break-inside-avoid bg-primary-yellow rounded-xl p-8 relative overflow-hidden flex flex-col justify-end">
              <div className="relative w-full h-46 mb-4 flex items-start justify-end">
                <span className="absolute top-0 right-0 font-pacifico text-dark text-center rotate-12 select-none">
                  C’est trop <br />
                  Izzzi !
                </span>
              </div>
              <h3 className="text-2xl font-bold text-dark mb-4">
                Prêt en 10
                <br />
                minutes chrono.
              </h3>
              <p className="text-dark text-sm leading-relaxed">
                Import CSV, génération automatique de QR code, le partage par
                étudiants collectez directement à leur formation plus besoin
                d'attendre
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
