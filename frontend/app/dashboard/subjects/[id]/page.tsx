"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiEdit2, FiMail, FiCheckCircle } from "react-icons/fi";
import { getSubjectsByClass, sendReviewInvitations, type Subject } from "@/lib/api";
import { getTokenCookie } from "@/utils/cookie";

function SubjectDetail() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const subjectId = params.id as string;
  const classId = searchParams.get('classId');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [sendingInvitation, setSendingInvitation] = useState<'DURING_CLASS' | 'AFTER_CLASS' | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  async function handleSendInvitations(formType: 'DURING_CLASS' | 'AFTER_CLASS') {
    if (!subject) return;

    try {
      setSendingInvitation(formType);
      setError(null);
      setSuccessMessage(null);

      const result = await sendReviewInvitations(subject.id, formType);
      
      setSuccessMessage(
        `${result.sent} email(s) envoyé(s) avec succès pour "${result.subjectName}" (${result.formType})`
      );
      
      // Masquer le message après 5 secondes
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi des invitations');
    } finally {
      setSendingInvitation(null);
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

          {/* Section d'envoi d'invitations */}
          <div className="mt-6 bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📧 Envoyer les invitations de formulaire d'avis
            </h2>

            {successMessage && (
              <div className="mb-4 bg-green-50 text-green-700 p-4 rounded-xl flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p>{successMessage}</p>
              </div>
            )}

            {error && (
              <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-xl">
                <p className="font-semibold">Erreur</p>
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  📝 Formulaire pendant le cours
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Envoyé automatiquement au milieu de la période du cours
                </p>
                <button
                  onClick={() => handleSendInvitations('DURING_CLASS')}
                  disabled={sendingInvitation !== null}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sendingInvitation === 'DURING_CLASS' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <FiMail className="w-4 h-4" />
                      Envoyer maintenant
                    </>
                  )}
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  ✅ Formulaire fin du cours
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Envoyé automatiquement à la date de fin du cours
                </p>
                <button
                  onClick={() => handleSendInvitations('AFTER_CLASS')}
                  disabled={sendingInvitation !== null}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sendingInvitation === 'AFTER_CLASS' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <FiMail className="w-4 h-4" />
                      Envoyer maintenant
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded-xl">
              <p className="text-sm text-blue-900">
                <strong>ℹ️ Note :</strong> Les invitations seront envoyées à tous les étudiants inscrits dans cette classe.
                Assurez-vous d'avoir attaché les formulaires d'avis appropriés avant d'envoyer.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function SubjectsDetailPage() {  // Keep the original name
  return (
    <Suspense fallback={<div className="text-center p-8">Chargement...</div>}>
      <SubjectDetail />
    </Suspense>
  );
}