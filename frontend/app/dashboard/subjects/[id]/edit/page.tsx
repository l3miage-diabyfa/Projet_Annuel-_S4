"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { getSubjectsByClass, updateSubject, type Subject } from "@/lib/api";
import { getTokenCookie } from "@/utils/cookie";
import SubjectForm from "../../components/SubjectForm";

export default function EditSubjectPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const subjectId = params.id as string;
  const classId = searchParams.get('classId');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  async function handleSubmit(formData: {
    name: string;
    instructorName: string;
    instructorEmail: string;
    firstLessonDate: string;
    lastLessonDate: string;
  }) {
    setSubmitting(true);
    setError(null);

    try {
      await updateSubject(subjectId, {
        name: formData.name,
        instructorName: formData.instructorName || undefined,
        instructorEmail: formData.instructorEmail || undefined,
        firstLessonDate: formData.firstLessonDate || undefined,
        lastLessonDate: formData.lastLessonDate || undefined,
      });

      router.push(`/dashboard/subjects?classId=${classId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
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

  if (error && !subject) {
    return (
      <div className="min-h-screen pb-12">
        <div className="mx-auto px-6 py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-xl">
            <p className="font-semibold">Erreur</p>
            <p>{error}</p>
            <button onClick={loadSubject} className="mt-2 text-sm underline">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initialValues = subject ? {
    name: subject.name,
    instructorName: subject.instructorName || '',
    instructorEmail: subject.instructorEmail || '',
    firstLessonDate: subject.firstLessonDate 
      ? new Date(subject.firstLessonDate).toISOString().split('T')[0]
      : '',
    lastLessonDate: subject.lastLessonDate 
      ? new Date(subject.lastLessonDate).toISOString().split('T')[0]
      : '',
  } : undefined;

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
          <h1 className="text-4xl font-bold text-foreground text-center mb-12">
            Modifier la matière
          </h1>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          <SubjectForm 
            initialValues={initialValues}
            onSubmit={handleSubmit} 
            loading={submitting}
            isEdit={true}
            shadow={true}
          />
        </main>
      </div>
    </div>
  );
}