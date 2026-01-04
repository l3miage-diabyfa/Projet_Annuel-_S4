"use client";

import Link from "next/link";
import React from "react";
import { FiArrowUpRight, FiInfo } from "react-icons/fi";
import { useUser } from "@/contexts/UserContext";

export default function TrialBanner() {
  const { user } = useUser();

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const trialEndDateFormatted = formatDate(user?.trialEndDate);

  // Don't show banner if user has PREMIUM plan
  if (user?.planType === 'PREMIUM') {
    return null;
  }

  // Only show banner for ADMIN users
  if (user?.role !== 'ADMIN') {
    return null;
  }

  // check if trialEndDate exists
  if (!user?.trialEndDate) {
    return null;
  }

  return (
    <div className="bg-[#fef5e7] border border-orange-400 max-w-2xl rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between text-orange-400 gap-4 w-full">
      <div className="flex items-center gap-3 text-center sm:text-left">
        <div className="bg-transparent rounded-full w-6 h-6 flex items-center justify-center shrink-0">
          <FiInfo className="w-6 h-6" />
        </div>
        <p className="text-sm">
          <span className="font-bold">Période d'essai en cours :</span> tout est
          illimité jusqu'au {trialEndDateFormatted}.
        </p>
      </div>
      <Link
        href="/dashboard/pricing"
        className="text-sm font-bold flex items-center gap-1 hover:underline whitespace-nowrap"
      >
        Je passe au plan Super Izzi <FiArrowUpRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
