"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiSearch, FiPlus, FiArrowUpRight, FiEye } from "react-icons/fi";
import TrialBanner from "../components/TrialBanner";

export default function ClassPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Données simulées pour les classes
  const classes = [
    {
      id: 1,
      name: "M2DG",
      description: "Description de la classe",
      students: 24,
    },
    {
      id: 2,
      name: "B3MD",
      description: "Description de la classe",
      students: 24,
    },
    { id: 3, name: "B2FG", description: "En alternance", students: 24 },
  ];

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto px-6 py-8 space-y-8">
        {/* Banner "Période d'essai" */}
        <TrialBanner />

        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {classes.length} classes disponibles
            </h1>
            <p className="text-gray-500 text-sm">
              Vous pouvez ajouter jusqu'à 5 classes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Rechercher une classe"
                className="input pr-10! py-3! mb-0!"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Add Button */}
            <button className="bg-primary-yellow hover:bg-yellow-400 text-gray-900 font-medium px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap w-full sm:w-auto cursor-pointer">
              Ajouter une classe <FiPlus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <Link
              href={`/dashboard/class/${cls.id}`}
              key={cls.id}
              className="bg-white rounded-xl p-6 border border-gray-100 flex flex-col justify-between min-h-[180px] group hover:border-gray-300 focus:ring-2 focus:ring-primary-yellow outline-none cursor-pointer group"
              style={{ textDecoration: "none" }}
              aria-label={`Voir la classe ${cls.name}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {cls.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-0 font-medium">
                    {cls.description}
                  </p>
                  <p className="text-xs font-bold text-gray-900 mt-1">
                    {cls.students} étudiants
                  </p>
                </div>
                <span
                  className="bg-primary-yellow w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 group-hover:rotate-45 transition-all shrink-0"
                  aria-label="Voir la classe"
                >
                  <FiArrowUpRight className="w-5 h-5 text-gray-900" />
                </span>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4">
                <span className="flex items-center gap-2 text-xs text-gray-600 group-hover:text-gray-900 font-medium underline">
                  <FiEye className="w-3.5 h-3.5" /> voir la classe
                </span>
                <button
                  className="text-xs text-gray-500 hover:text-gray-700 underline decoration-gray-300"
                  tabIndex={-1}
                  onClick={(e) => e.preventDefault()}
                >
                  Archiver
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Link */}
        <div className="pt-2">
          <Link
            href="/dashboard/classes/archived" // Assuming this path or similar
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Voir les classes archivées <FiArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
