"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { createSubject } from "@/lib/api";
import { getTokenCookie } from "@/utils/cookie";
import SubjectForm from "../components/SubjectForm";
import CSVUploadSection from "../components/CSVUploadSection";

function NewSubject() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: {
    name: string;
    instructorName: string;
    instructorEmail: string;
    firstLessonDate: string;
    lastLessonDate: string;
  }) {
    if (!classId) {
      setError('Aucune classe sélectionnée');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getTokenCookie();
      if (!token) {
        router.push('/login');
        return;
      }

      await createSubject({
        name: formData.name,
        instructorName: formData.instructorName || undefined,
        instructorEmail: formData.instructorEmail || undefined,
        firstLessonDate: formData.firstLessonDate || undefined,
        lastLessonDate: formData.lastLessonDate || undefined,
        classId,
      });

      router.push(`/dashboard/subjects?classId=${classId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
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
          {/* Progress Indicator */}
          <div className="text-right mb-4">
            <div className="text-sm text-gray-600 bg-white border-b border-gray-200 rounded-full h-10 w-10 flex items-center justify-center mx-auto relative">
              2/2
              <div className="text-sm text-gray-700 absolute bottom-8 left-5 w-20 -rotate-20">
                On y est presque !
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground text-center mb-12">
            Entrer les matières
          </h1>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* CSV Upload Section */}
          <CSVUploadSection classId={classId || ''} />

          {/* OR Divider */}
          <div className="text-center my-8">
            <span className="text-3xl font-bold text-gray-900">ou</span>
          </div>

          {/* Manual Form */}
          <SubjectForm 
            onSubmit={handleSubmit} 
            loading={loading}
            shadow={true}
          />
        </main>
      </div>
    </div>
  );
}

export default function NewSubjectPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Chargement...</div>}>
      <NewSubject />
    </Suspense>
  );
}