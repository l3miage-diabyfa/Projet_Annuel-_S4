"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { getSubjectsByClass, type Subject } from "@/lib/api";
import { getTokenCookie } from "@/utils/cookie";

export default function SubjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const subjectId = params.id as string;
  const classId = searchParams.get('classId');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);

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

    loadSubject();
  }, [subjectId, classId, router]);

  async function loadSubject() {
    if (!classId) return;

    try {
      setLoading(true);
      const subjects = await getSubjectsByClass(classId);
      const found = subjects.find(s => s.id === subjectId);
      
      if (!found) {
        throw new Error('Matière introuvable');
      }

      setSubject(found);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pb-12">
        <div className="mx-auto px-6 py-8">
          <p className="text-center text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="min-h-screen pb-12">
        <div className="mx-auto px-6 py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-xl">
            <p className="font-semibold">Erreur</p>
            <p>{error || 'Matière introuvable'}</p>
            <button onClick={loadSubject} className="mt-2 text-sm underline">
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
          href={`/dashboard/subjects?classId=${classId}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <FiArrowLeft className="w-4 h-4" /> Retour aux matières
        </Link>

        <main className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
              <Link
                href={`/dashboard/subjects/${subject.id}/edit?classId=${classId}`}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <FiEdit2 className="w-4 h-4" />
                Modifier
              </Link>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Intervenant</h3>
                <p className="text-gray-900">{subject.instructorName || '-'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                <p className="text-gray-900">{subject.instructorEmail || '-'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Premier cours</h3>
                  <p className="text-gray-900">
                    {subject.firstLessonDate 
                      ? new Date(subject.firstLessonDate).toLocaleDateString('fr-FR')
                      : '-'
                    }
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Dernier cours</h3>
                  <p className="text-gray-900">
                    {subject.lastLessonDate 
                      ? new Date(subject.lastLessonDate).toLocaleDateString('fr-FR')
                      : '-'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}