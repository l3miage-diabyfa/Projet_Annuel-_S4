"use client";

import React, { useState, useEffect } from "react";
import { FiX, FiArrowRight, FiEye } from "react-icons/fi";
import { getReviewFormsForClass, attachFormsToSubject, type ReviewForm } from "@/lib/api";

interface SelectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  subjectId: string;
  subjectName: string;
  onSuccess: () => void;
}

export default function SelectFormModal({
  isOpen,
  onClose,
  classId,
  subjectId,
  subjectName,
  onSuccess,
}: SelectFormModalProps) {
  const [forms, setForms] = useState<ReviewForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedDuringForm, setSelectedDuringForm] = useState<string | null>(null);
  const [selectedAfterForm, setSelectedAfterForm] = useState<string | null>(null);
  const [previewForm, setPreviewForm] = useState<ReviewForm | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadForms();
    }
  }, [isOpen, classId]);

  async function loadForms() {
    try {
      setLoading(true);
      const data = await getReviewFormsForClass(classId);
      setForms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!selectedDuringForm && !selectedAfterForm) {
      alert('Veuillez sélectionner au moins un formulaire');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await attachFormsToSubject(subjectId, {
        duringFormId: selectedDuringForm || undefined,
        afterFormId: selectedAfterForm || undefined,
      });
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  const duringForms = forms.filter(f => f.type === 'DURING_CLASS');
  const afterForms = forms.filter(f => f.type === 'AFTER_CLASS');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex">
        {/* Left side - Selection */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Choisir les formulaires
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Pour la matière: <span className="font-semibold">{subjectName}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-gray-600">Chargement des formulaires...</p>
          ) : (
            <div className="space-y-8">
              {/* During Class Forms */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📝 Formulaire pendant le cours
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Pour recueillir les avis des étudiants en direct pendant les cours
                </p>
                
                {duringForms.length === 0 ? (
                  <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                    Aucun formulaire "Pendant le cours" disponible.{' '}
                    <button className="text-blue-600 hover:underline">
                      Créer un formulaire
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {duringForms.map((form) => (
                      <button
                        key={form.id}
                        onClick={() => {
                          setSelectedDuringForm(form.id);
                          setPreviewForm(form);
                        }}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedDuringForm === form.id
                            ? 'border-primary-yellow bg-yellow-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{form.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {form.fields?.length || 0} question{form.fields?.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewForm(form);
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                          >
                            <FiEye className="w-4 h-4" /> Aperçu
                          </button>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* After Class Forms */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ✅ Formulaire fin du cours
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Pour recueillir les avis des étudiants après la fin de la dernière séance
                </p>
                
                {afterForms.length === 0 ? (
                  <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                    Aucun formulaire "Fin du cours" disponible.{' '}
                    <button className="text-blue-600 hover:underline">
                      Créer un formulaire
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {afterForms.map((form) => (
                      <button
                        key={form.id}
                        onClick={() => {
                          setSelectedAfterForm(form.id);
                          setPreviewForm(form);
                        }}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedAfterForm === form.id
                            ? 'border-primary-yellow bg-yellow-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{form.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {form.fields?.length || 0} question{form.fields?.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewForm(form);
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                          >
                            <FiEye className="w-4 h-4" /> Aperçu
                          </button>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={submitting || (!selectedDuringForm && !selectedAfterForm)}
                className="w-full bg-primary-yellow hover:bg-yellow-400 text-gray-900 font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {submitting ? 'Enregistrement...' : 'Valider la sélection'}
                <FiArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Right side - Preview */}
        <div className="w-96 bg-gray-50 p-8 border-l overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Aperçu du formulaire
          </h3>
          
          {previewForm ? (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{previewForm.title}</h4>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {previewForm.type === 'DURING_CLASS' ? 'Pendant le cours' : 'Fin du cours'}
                </span>
              </div>

              {previewForm.fields && previewForm.fields.length > 0 ? (
                <div className="space-y-3">
                  {previewForm.fields.map((field, index) => (
                    <div key={field.id} className="bg-white p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {index + 1}. {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {field.type === 'STARS' && (
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="text-yellow-400 text-xl">⭐</span>
                          ))}
                        </div>
                      )}
                      
                      {field.type === 'RADIO' && field.options && (
                        <div className="space-y-2">
                          {(field.options as string[]).map((option, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input type="radio" disabled className="w-4 h-4" />
                              <span className="text-sm text-gray-700">{option}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {field.type === 'CHECKBOX' && field.options && (
                        <div className="space-y-2">
                          {(field.options as string[]).map((option, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input type="checkbox" disabled className="w-4 h-4" />
                              <span className="text-sm text-gray-700">{option}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {field.type === 'TEXTAREA' && (
                        <textarea
                          disabled
                          className="w-full p-2 border rounded-lg"
                          rows={3}
                          placeholder="Réponse libre..."
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucune question configurée</p>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">Sélectionnez un formulaire pour voir l'aperçu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}