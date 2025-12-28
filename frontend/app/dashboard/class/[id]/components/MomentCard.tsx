import React from "react";
import Link from "next/link";
import {
  FiClock,
  FiCheck,
  FiArrowUpRight,
  FiDownload,
  FiRefreshCw,
} from "react-icons/fi";

export interface Moment {
  type: "during" | "end";
  label: string;
  link: string;
  feedbackCount: number;
  totalStudents: number;
}

interface MomentCardProps {
  moment: Moment;
}

export default function MomentCard({ moment }: MomentCardProps) {
  return (
    <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100 grid grid-cols-12 gap-4 items-center">
      {/* Label */}
      <div className="col-span-3 flex items-center gap-3">
        {moment.type === "during" ? (
          <FiClock className="w-4 h-4 text-gray-500 shrink-0" />
        ) : (
          <FiCheck className="w-4 h-4 text-gray-500 shrink-0" />
        )}
        <span className="text-xs font-bold text-gray-900">{moment.label}</span>
      </div>

      {/* Actions */}
      <div className="col-span-4 flex items-center gap-3 justify-center">
        <button className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-2 rounded-md transition-colors whitespace-nowrap">
          Copier le lien <FiArrowUpRight className="w-3 h-3 rotate-45" />
        </button>
        <button className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-900 border-b border-gray-400 hover:border-gray-900 pb-0.5 transition-colors whitespace-nowrap">
          Télécharger le QR code <FiDownload className="w-3 h-3" />
        </button>
      </div>

      {/* Relance */}
      <div className="col-span-2 flex justify-center">
        <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors underline decoration-gray-300 whitespace-nowrap">
          Relancer les étudiants
          <FiRefreshCw className="w-3 h-3" />
        </button>
      </div>

      {/* Résultats */}
      <div className="col-span-3 text-right">
        <Link href="#" className="flex flex-col items-end group">
          <span className="text-xs font-bold text-gray-900 group-hover:underline whitespace-nowrap">
            Voir les retours ({moment.feedbackCount}/{moment.totalStudents})
          </span>
          <span className="text-[10px] text-gray-500">
            (Tous les retours sont anonymes sur le plan gratuit)
          </span>
        </Link>
      </div>
    </div>
  );
}
