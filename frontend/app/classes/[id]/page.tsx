"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiSearch, FiPlus } from "react-icons/fi";
import { useParams } from "next/navigation";
import BackButton from "../../components/backButton";
import TrialBanner from "../../components/TrialBanner";
import SubjectRow from "./components/SubjectRow";
import SelectFormModal from "./components/SelectFormModal";
import { getClass, getSubjectsByClass, type Class, type Subject } from "@/lib/api";
import { getTokenCookie } from "@/utils/cookie";

export default function SingleClassPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [classData, setClassData] = useState<Class | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const token = getTokenCookie();
    if (!token) {
      router.push('/login');
      return;
    }

    loadData();
  }, [classId, router]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      
      const [classResponse, subjectsResponse] = await Promise.all([
        getClass(classId),
        getSubjectsByClass(classId),
      ]);
      
      setClassData(classResponse);
      setSubjects(subjectsResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  function handleChooseForm(subjectId: string, subjectName: string) {
    setSelectedSubject({ id: subjectId, name: subjectName });
    setIsFormModalOpen(true);
  }

  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return subjects;
    const query = searchQuery.toLowerCase();
    return subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(query) ||
        (subject.instructorName && subject.instructorName.toLowerCase().includes(query))
    );
  }, [searchQuery, subjects]);

  if (loading) {
    return (
      <div className="min-h-screen pb-12">
        <div className="mx-auto px-4 sm:px-6 py-8">
          <p className="text-center text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="min-h-screen pb-12">
        <div className="mx-auto px-4 sm:px-6 py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-xl">
            <p className="font-semibold">Erreur</p>
            <p>{error || 'Classe introuvable'}</p>
            <button onClick={loadData} className="mt-2 text-sm underline">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                {classData.enrollments.length} étudiant{classData.enrollments.length !== 1 ? 's' : ''}
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
              {/* Add button */}
              <Link
                href={`/dashboard/subjects/new?classId=${classId}`}
                className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-medium px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto whitespace-nowrap"
              >
                Ajouter une matière <FiPlus className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Subjects List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {filteredSubjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">
                {searchQuery ? 'Aucune matière trouvée' : 'Aucune matière pour le moment'}
              </p>
              <Link
                href={`/dashboard/subjects/new?classId=${classId}`}
                className="inline-block bg-primary-yellow hover:bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl transition"
              >
                Ajouter votre première matière
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                  <SubjectRow 
                    key={subject.id} 
                    subject={subject}
                    classId={classId}
                    totalStudents={classData.enrollments.length}
                    onChooseForm={() => handleChooseForm(subject.id, subject.name)}
                    onFormUpdated={loadData}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Selection Modal */}
      {selectedSubject && (
        <SelectFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setSelectedSubject(null);
          }}
          classId={classId}
          subjectId={selectedSubject.id}
          subjectName={selectedSubject.name}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}