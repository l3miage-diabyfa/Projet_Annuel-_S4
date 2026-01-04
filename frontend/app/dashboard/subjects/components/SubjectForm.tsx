"use client";

import React, { useState } from "react";
import { IoInformationCircleOutline, IoArrowForward } from "react-icons/io5";

type SubjectFormProps = {
  shadow?: boolean;
  isEdit?: boolean;
  loading?: boolean;
  initialValues?: {
    name: string;
    instructorName: string;
    instructorEmail: string;
    firstLessonDate: string;
    lastLessonDate: string;
  };
  onSubmit: (data: {
    name: string;
    instructorName: string;
    instructorEmail: string;
    firstLessonDate: string;
    lastLessonDate: string;
  }) => void;
};

export default function SubjectForm({
  shadow = false,
  isEdit = false,
  loading = false,
  initialValues,
  onSubmit,
}: SubjectFormProps) {
  const [formData, setFormData] = useState({
    name: initialValues?.name || '',
    instructorName: initialValues?.instructorName || '',
    instructorEmail: initialValues?.instructorEmail || '',
    firstLessonDate: initialValues?.firstLessonDate || '',
    lastLessonDate: initialValues?.lastLessonDate || '',
  });

  const cardClass = `bg-white rounded-lg p-8${shadow ? " shadow-sm" : ""}`;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <div className={cardClass}>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        {isEdit ? 'Modifier la matière' : 'Ajouter les matières une par une.'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject and Teacher Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la matière *
            </label>
            <input
              type="text"
              required
              placeholder="Entrez le nom de la matière"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'intervenant
            </label>
            <input
              type="text"
              placeholder="Entrez le nom de l'intervenant"
              value={formData.instructorName}
              onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
              className="input w-full"
            />
          </div>
        </div>

        {/* Teacher Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email de l'intervenant (facultatif)
          </label>
          <input
            type="email"
            placeholder="Entrez l'email de l'intervenant"
            value={formData.instructorEmail}
            onChange={(e) => setFormData({ ...formData, instructorEmail: e.target.value })}
            className="input w-full !max-w-full"
          />
        </div>

        {/* Course Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date du premier cours (facultatif)
            </label>
            <input
              type="date"
              value={formData.firstLessonDate}
              onChange={(e) => setFormData({ ...formData, firstLessonDate: e.target.value })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date du dernier cours (facultatif)
            </label>
            <input
              type="date"
              value={formData.lastLessonDate}
              onChange={(e) => setFormData({ ...formData, lastLessonDate: e.target.value })}
              className="input w-full"
            />
          </div>
        </div>

        {/* Info Message */}
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <IoInformationCircleOutline className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>
            {isEdit 
              ? 'Après modification, vous serez redirigé vers la liste de vos matières.'
              : 'Après création, vous serez redirigé vers la liste de vos matières.'
            }
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="button-primary max-w-xs disabled:opacity-50"
        >
          <span>{loading ? 'En cours...' : isEdit ? 'Enregistrer les modifications' : 'Créer la matière'}</span>
          <IoArrowForward className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}