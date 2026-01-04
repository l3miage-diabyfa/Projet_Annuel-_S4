"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface FormField {
  id: string;
  label: string;
  type: 'STARS' | 'RADIO' | 'CHECKBOX' | 'TEXTAREA';
  required: boolean;
  options?: string[];
  order: number;
}

interface ReviewForm {
  id: string;
  title: string;
  type: string;
  class: { name: string };
  subject?: { name: string };
  fields: FormField[];
}

export default function PublicFeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const publicLink = params.publicLink as string;

  const [form, setForm] = useState<ReviewForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});

  useEffect(() => {
    loadForm();
  }, [publicLink]);

  async function loadForm() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/forms/${publicLink}`);
      if (!response.ok) throw new Error('Formulaire introuvable');
      
      const data = await response.json();
      setForm(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const responseData = Object.entries(responses).map(([fieldId, value]) => ({
        fieldId,
        value,
      }));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: form!.id,
          responses: responseData,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la soumission');

      // Success!
      alert('✅ Merci pour votre retour!');
      router.push('/');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSubmitting(false);
    }
  }

  const StarRating = ({ fieldId, value }: { fieldId: string; value: number }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setResponses({ ...responses, [fieldId]: star })}
          className="text-2xl focus:outline-none transition-all hover:scale-110"
        >
          <FontAwesomeIcon 
            icon={faStar} 
            className={star <= value ? 'text-yellow-400' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-700">{error || 'Formulaire introuvable'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[7px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-0.5"></div>
                </div>
                <span className="text-xl font-bold">izzzi</span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {form.subject?.name || form.class.name}
              </h1>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {form.class.name}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {form.type === 'DURING_CLASS' ? 'Pendant le cours' : 'Fin du cours'}
                </span>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <p className="font-medium text-gray-900">Soit sincère, sinon ça ne sert à rien</p>
                <p>
                  C&apos;est grâce à vos retours que nous pouvons améliorer les interventions.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields.map((field) => (
                <div key={field.id} className="bg-white rounded-lg p-6">
                  <h3 className="font-semibold mb-4">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>

                  {field.type === 'STARS' && (
                    <StarRating fieldId={field.id} value={responses[field.id] || 0} />
                  )}

                  {field.type === 'RADIO' && field.options && (
                    <div className="space-y-2">
                      {field.options.map((option) => (
                        <label key={option} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="radio"
                            name={field.id}
                            value={option}
                            checked={responses[field.id] === option}
                            onChange={(e) => setResponses({ ...responses, [field.id]: e.target.value })}
                            required={field.required}
                            className="w-4 h-4"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'CHECKBOX' && field.options && (
                    <div className="space-y-2">
                      {field.options.map((option) => (
                        <label key={option} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="checkbox"
                            value={option}
                            checked={(responses[field.id] || []).includes(option)}
                            onChange={(e) => {
                              const current = responses[field.id] || [];
                              const updated = e.target.checked
                                ? [...current, option]
                                : current.filter((v: string) => v !== option);
                              setResponses({ ...responses, [field.id]: updated });
                            }}
                            className="w-4 h-4"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'TEXTAREA' && (
                    <textarea
                      value={responses[field.id] || ''}
                      onChange={(e) => setResponses({ ...responses, [field.id]: e.target.value })}
                      required={field.required}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
                      rows={4}
                      placeholder="Votre réponse..."
                    />
                  )}
                </div>
              ))}

              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 rounded-lg font-semibold text-black hover:opacity-90 transition disabled:opacity-50"
                    style={{backgroundColor: '#FFE552'}}
                  >
                    {submitting ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
                <p className="text-center text-xs text-gray-500 mt-6">
                  Ce formulaire est édité par <span className="font-semibold">izzzi</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}