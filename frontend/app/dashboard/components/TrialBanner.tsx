import Link from "next/link";
import React from "react";
import { FiArrowUpRight, FiInfo } from "react-icons/fi";

export default function TrialBanner() {
  return (
    <div className="bg-[#fef5e7] border border-orange-400 max-w-2xl rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between text-orange-400 gap-4 w-full">
      <div className="flex items-center gap-3 text-center sm:text-left">
        <div className="bg-transparent rounded-full w-6 h-6 flex items-center justify-center shrink-0">
          <FiInfo className="w-6 h-6" />
        </div>
        <p className="text-sm">
          <span className="font-bold">Période d'essai en cours :</span> tout est
          illimité jusqu'au 18 septembre 2025.
        </p>
      </div>
      <Link
        href="/billing"
        className="text-sm font-bold flex items-center gap-1 hover:underline whitespace-nowrap"
      >
        Je passe au plan Super Izzi <FiArrowUpRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
