import React from "react";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

export default function EmptyFeedbackState() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8 relative">
        <h1 className="text-4xl font-bold text-gray-900">
          Vous n'avez pas
          <br />
          encore de retours
        </h1>

        <p className="text-gray-600 max-w-lg mx-auto">
          Pour obtenir des retours, commencez par créer une classe, puis ajoutez
          des matières afin de générer un formulaire.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard/add-subjects"
            className="button-primary whitespace-nowrap w-fit!"
          >
            Je crée une matière <FiArrowUpRight className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard/class"
            className="button-outline whitespace-nowrap w-fit!"
          >
            Je crée une classe <FiArrowUpRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Handwritten Arrow Annotation */}
        <div className="absolute top-[-40px] right-[10px] hidden md:block transform rotate-[-10deg]">
          <p className="font-pacifico text-gray-700 text-lg mb-1 whitespace-nowrap">
            Vous allez voir,
            <br />
            c'est izzzi !
          </p>
          {/* Simple SVG Arrow if needed, or just text placement */}
        </div>
      </div>
    </div>
  );
}
