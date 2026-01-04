"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { getSubjectsByClass, getClass, deleteSubject, type Subject, type Class } from "@/lib/api";
import { getTokenCookie } from "@/utils/cookie";

function SubjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');

  const [classData, setClassData] = useState<Class | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const token = getTokenCookie();
    if (!token) {
      router.push('/login');
      return;
    }

    if (!classId) {
      setError('Aucune classe sélectionnée');
      setLoading(false);
      return;
    }

    loadData();
  }, [classId, router]);

  async function loadData() {
    if (!classId) return;

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

  async function handleDeleteConfirm() {
    if (!subjectToDelete) return;

    try {
      await deleteSubject(subjectToDelete.id);
      await loadData();
      setDeleteModalOpen(false);
      setSubjectToDelete(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur de suppression');
    }
  }

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (subject.instructorName && subject.instructorName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen pb-12">
        <div className="mx-auto px-6 py-8">
          <p className="text-center text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="min-h-screen pb-12">
        <div className="mx-auto px-6 py-8">
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
      <div className="mx-auto px-6 py-8">
        <Link 
          href={`/dashboard/class/${classId}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <FiArrowLeft className="w-4 h-4" /> Retour à la classe
        </Link>

        <main className="space-y-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold text-foreground">Mes matières</h1>
              <span className="text-gray-700 px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
                {classData.name}
              </span>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher une matière..."
                  className="input pr-10 py-3 mb-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <Link
                href={`/dashboard/subjects/new?classId=${classId}`}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-medium px-6 py-3 rounded-lg flex items-center gap-2 transition whitespace-nowrap"
              >
                <span>Ajouter une matière</span>
                <FiPlus className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                        Matière
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                        Nom de l'intervenant
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                        Email de l'intervenant
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                        Date du premier cours
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                        Date du dernier cours
                      </th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredSubjects.map((subject) => (
                      <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {subject.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {subject.instructorName || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {subject.instructorEmail || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {subject.firstLessonDate 
                            ? new Date(subject.firstLessonDate).toLocaleDateString('fr-FR')
                            : '-'
                          }
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {subject.lastLessonDate 
                            ? new Date(subject.lastLessonDate).toLocaleDateString('fr-FR')
                            : '-'
                          }
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/subjects/${subject.id}/edit?classId=${classId}`}
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                              aria-label="Modifier"
                            >
                              <FiEdit2 className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => {
                                setSubjectToDelete({ id: subject.id, name: subject.name });
                                setDeleteModalOpen(true);
                              }}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              aria-label="Supprimer"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && subjectToDelete && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => {
                setDeleteModalOpen(false);
                setSubjectToDelete(null);
              }}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
              aria-label="Fermer"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Supprimer la matière
            </h2>
            <p className="mb-6 text-gray-700">
              Cette action est irréversible. La matière "{subjectToDelete.name}" et toutes ses
              informations associées seront définitivement supprimées.
              Voulez-vous vraiment continuer ?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSubjectToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SubjectsPage() {  // Keep the original name
  return (
    <Suspense fallback={<div className="text-center p-8">Chargement...</div>}>
      <SubjectsContent />
    </Suspense>
  );
}