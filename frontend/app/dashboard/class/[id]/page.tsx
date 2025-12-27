"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { FiSearch, FiPlus } from "react-icons/fi";
import { useParams } from "next/navigation";
import BackButton from "../../components/backButton";
import TrialBanner from "../../components/TrialBanner";
import SubjectRow, { Subject } from "./components/SubjectRow";

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
