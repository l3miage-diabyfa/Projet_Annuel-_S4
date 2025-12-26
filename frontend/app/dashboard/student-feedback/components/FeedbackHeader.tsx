import React from "react";
import { FiGlobe, FiDatabase, FiCode, FiLock } from "react-icons/fi";
import BackButton from "../../components/backButton";

export default function FeedbackHeader() {
  return (
    <div className="space-y-6">
      <BackButton className="px-0!" text="Retour" href="/dashboard/class" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Retour des étudiants
          </h1>
          <p className="text-gray-500 font-medium">21 réponses</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs font-medium text-gray-700">
            <FiCode className="w-3.5 h-3.5 text-gray-400" />
            principaux langages de programmation
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs font-medium text-gray-700">
            <FiGlobe className="w-3.5 h-3.5 text-gray-400" />
            Narrativ (IICP)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs font-medium text-gray-700">
            <FiDatabase className="w-3.5 h-3.5 text-gray-400" />
            M2 com digit
          </span>
        </div>
      </div>

      <div className="bg-orange-50 w-fit border border-orange-100 rounded-lg p-4 flex items-start sm:items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-full shrink-0">
          <FiLock className="w-4 h-4 text-orange-600" />
        </div>
        <div className="text-sm text-orange-800">
          <span className="font-bold">Retours anonymes.</span> Tous visibles
          jusqu'au 25 sept. 2025 (fin de l'essai).
        </div>
      </div>
    </div>
  );
}
