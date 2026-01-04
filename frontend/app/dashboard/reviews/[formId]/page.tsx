"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiStar, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { getTokenCookie } from "@/utils/cookie";
import Link from "next/link";

interface ReviewResponse {
  id: string;
  fieldId: string;
  value: any;
  field: {
    id: string;
    label: string;
    type: 'STARS' | 'RADIO' | 'CHECKBOX' | 'TEXTAREA';
    order: number;
  };
}

interface Review {
  id: string;
  submittedAt: string;
  responses: ReviewResponse[];
}

interface ReviewForm {
  id: string;
  title: string;
  type: 'DURING_CLASS' | 'AFTER_CLASS';
  class?: { id: string; name: string };
  subject?: { id: string; name: string };
  reviews: Review[];
  fields: Array<{
    id: string;
    label: string;
    type: 'STARS' | 'RADIO' | 'CHECKBOX' | 'TEXTAREA';
    order: number;
  }>;
}

export default function ReviewDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;

  const [form, setForm] = useState<ReviewForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getTokenCookie();
    if (!token) {
      router.push('/login');
      return;
    }

    loadFormData();
  }, [formId, router]);

  async function loadFormData() {
    try {
      setLoading(true);
      const token = getTokenCookie();
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/forms/${formId}/responses`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Impossible de charger les retours');

      const data = await response.json();
      setForm(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  // Calculate statistics
  const calculateStats = () => {
    if (!form || !form.reviews.length) return null;

    const stats: Record<string, any> = {};

    form.fields.forEach(field => {
      const responses = form.reviews
        .flatMap(r => r.responses)
        .filter(resp => resp.fieldId === field.id);

      if (field.type === 'STARS') {
        const values = responses.map(r => Number(r.value));
        const average = values.length > 0 
          ? values.reduce((a, b) => a + b, 0) / values.length 
          : 0;
        stats[field.id] = { average: average.toFixed(1), total: values.length };
      } else if (field.type === 'RADIO' || field.type === 'CHECKBOX') {
        const counts: Record<string, number> = {};
        responses.forEach(r => {
          const value = Array.isArray(r.value) ? r.value : [r.value];
          value.forEach((v: string) => {
            counts[v] = (counts[v] || 0) + 1;
          });
        });
        stats[field.id] = counts;
      } else if (field.type === 'TEXTAREA') {
        stats[field.id] = responses.map(r => r.value);
      }
    });

    return stats;
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen pb-12">
        <div className="mx-auto px-4 sm:px-6 py-8">
          <p className="text-center text-gray-600">Chargement des retours...</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen pb-12">
        <div className="mx-auto px-4 sm:px-6 py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-xl">
            <p className="font-semibold">Erreur</p>
            <p>{error || 'Formulaire introuvable'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/retour"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="w-4 h-4" />
            Retour aux retours
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {form.subject?.name || form.class?.name || form.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                {form.class && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    {form.class.name}
                  </span>
                )}
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                  {form.type === 'DURING_CLASS' ? 'Pendant le cours' : 'Fin du cours'}
                </span>
                <span className="flex items-center gap-1">
                  <FiCheckCircle className="w-4 h-4 text-green-600" />
                  {form.reviews.length} retour{form.reviews.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {form.reviews.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <FiAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun retour pour le moment
            </h2>
            <p className="text-gray-600">
              Les retours des étudiants apparaîtront ici une fois soumis.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Statistics by field */}
            {form.fields.map(field => (
              <div key={field.id} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {field.label}
                </h3>

                {field.type === 'STARS' && stats?.[field.id] && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <FiStar
                          key={star}
                          className={`w-6 h-6 ${
                            star <= Number(stats[field.id].average)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-gray-900">
                      {stats[field.id].average}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({stats[field.id].total} réponse{stats[field.id].total > 1 ? 's' : ''})
                    </span>
                  </div>
                )}

                {(field.type === 'RADIO' || field.type === 'CHECKBOX') && stats?.[field.id] && (
                  <div className="space-y-2">
                    {Object.entries(stats[field.id]).map(([option, count]) => (
                      <div key={option} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{option}</span>
                            <span className="text-sm text-gray-600">{count as number}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full"
                              style={{
                                width: `${((count as number) / form.reviews.length) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {field.type === 'TEXTAREA' && stats?.[field.id] && (
                  <div className="space-y-3">
                    {(stats[field.id] as string[]).map((text, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">{text || <em className="text-gray-400">Aucune réponse</em>}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
