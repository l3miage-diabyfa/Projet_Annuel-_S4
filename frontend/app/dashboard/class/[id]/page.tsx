"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiPlus,
  FiArrowUpRight,
  FiEdit2,
  FiClock,
  FiCheck,
  FiTrash2,
  FiDownload,
  FiRefreshCw,
} from "react-icons/fi";
import { useParams } from "next/navigation";
import BackButton from "../../components/backButton";
import TrialBanner from "../../components/TrialBanner";

// Types pour une meilleure maintenabilité
interface Moment {
  type: "during" | "end";
  label: string;
  link: string;
  feedbackCount: number;
  totalStudents: number;
}

interface Subject {
  id: number;
  name: string;
  teacher: string;
  dateRange: string;
  status: "pending" | "active" | "active_resent";
  formType: string | null;
  feedbackCount?: number;
  totalStudents: number;
  moments?: Moment[];
}

export default function SingleClassPage() {
  const params = useParams();
  const classId = params.id as string;
  const [searchQuery, setSearchQuery] = useState("");

  const classData = {
    id: classId,
    name: "B3UI",
    students: 24,
  };

  const subjects: Subject[] = [
    {
      id: 1,
      name: "UI design",
      teacher: "Kathleen Alcini",
      dateRange: "21/01/2024 - 21/01/2024",
      status: "pending",
      formType: null,
      feedbackCount: 0,
      totalStudents: 24,
    },
    {
      id: 2,
      name: "UI design",
      teacher: "Kathleen Alcini",
      dateRange: "21/01/2024 - 21/01/2024",
      status: "active",
      formType: "all_moments",
      totalStudents: 24,
      moments: [
        {
          type: "during",
          label: "Pendant le cours",
          link: "https://izzi.app/eval/123",
          feedbackCount: 33,
          totalStudents: 24,
        },
        {
          type: "end",
          label: "Fin du cours (automatique)",
          link: "https://izzi.app/eval/124",
          feedbackCount: 12,
          totalStudents: 24,
        },
      ],
    },
    {
      id: 3,
      name: "UI design",
      teacher: "Kathleen Alcini",
      dateRange: "21/01/2024 - 21/01/2024",
      status: "active_resent",
      formType: "all_moments",
      totalStudents: 24,
      moments: [
        {
          type: "during",
          label: "Pendant le cours",
          link: "https://izzi.app/eval/125",
          feedbackCount: 33,
          totalStudents: 24,
        },
        {
          type: "end",
          label: "Fin du cours (automatique)",
          link: "https://izzi.app/eval/126",
          feedbackCount: 12,
          totalStudents: 24,
        },
      ],
    },
  ];

  // Filtrage optimisé avec useMemo
  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return subjects;
    const query = searchQuery.toLowerCase();
    return subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(query) ||
        subject.teacher.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 px-4">
        <BackButton text="Retour à mes classes" href="/dashboard/class" />
        <TrialBanner />
      </div>

      <div className="mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Class Header */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {classData.name}
              </h1>
              <p className="text-gray-500 font-medium whitespace-nowrap">
                {classData.students} étudiants
              </p>
            </div>

            <div className="flex gap-2">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher par intervenant, cours..."
                  className="input pr-10! py-3! mb-0!"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              {/* edd button */}
              <Link
                href="/dashboard/add-subjects"
                className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-medium px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto whitespace-nowrap"
              >
                Ajouter une matière <FiPlus className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Subjects List avec scroll horizontal */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="">
              {/* List Header */}
              <div className="grid grid-cols-24 gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50/50 text-xs font-bold text-gray-900 uppercase tracking-wider">
                <div className="col-span-6">Les matières</div>
                <div className="col-span-5 text-center">
                  Lien des formulaires de retours
                </div>
                <div className="col-span-6 text-center">QR code</div>
                <div className="col-span-6 text-right">Accès aux résultats</div>
                <div className="col-span-1 text-right"></div>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredSubjects.map((subject) => (
                  <SubjectRow key={subject.id} subject={subject} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant séparé pour chaque ligne de matière
function SubjectRow({ subject }: { subject: Subject }) {
  return (
    <div className="p-6 transition-colors hover:bg-gray-50/30 min-w-7xl">
      <div className="grid grid-cols-24 gap-4 items-start">
        {/* Colonne 1: Info matière */}
        <div className="col-span-6">
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="font-bold text-gray-900">{subject.name}</h3>
            <span className="text-xs font-semibold text-gray-500">
              {subject.teacher}
            </span>
          </div>
          <p className="text-xs text-gray-400 font-medium mb-4">
            {subject.dateRange}
          </p>

          {subject.status === "pending" ? (
            <button className="bg-primary-orange hover:bg-orange-600 text-white text-sm font-medium px-5 py-3 rounded-lg transition-colors flex items-center gap-2">
              Choisir le type de formulaire
              <FiArrowUpRight className="w-4 h-4" />
            </button>
          ) : (
            <div>
              <button className="bg-primary-yellow hover:bg-yellow-400 text-gray-900 text-sm font-medium px-5 py-3 rounded-lg transition-colors flex items-center gap-2 mb-2">
                Modifier le formulaire
                <FiArrowUpRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-gray-500 leading-tight max-w-xs">
                Le formulaire sélectionné s'applique à tous les moments
                d'évaluation de cette matière.
              </p>
            </div>
          )}
        </div>

        {/* Colonnes 2-4: Moments ou actions */}
        {subject.status === "pending" ? (
          <>
            <div className="col-span-17 space-y-3 relative" />
            <div className="col-span-1 flex flex-col justify-end items-end gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="col-span-17 space-y-3 relative">
              {subject.moments?.map((moment, idx) => (
                <MomentCard key={idx} moment={moment} />
              ))}
            </div>
            <div className="col-span-1 flex flex-col justify-end items-end gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Composant séparé pour chaque moment
function MomentCard({ moment }: { moment: Moment }) {
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
