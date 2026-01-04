"use client";
import React, { useState } from "react";
import { IoInformationCircleOutline, IoArrowForward } from "react-icons/io5";

type EditSubjectsFormProps = {
  shadow?: boolean;
  // Optionally accept initial values to edit an existing subject
  initialValues?: {
    subjectName?: string;
    teacherName?: string;
    teacherEmail?: string;
    firstCourseDate?: string;
    lastCourseDate?: string;
  };
  onSubmit?: (data: {
    subjectName: string;
    teacherName: string;
    teacherEmail: string;
    firstCourseDate: string;
    lastCourseDate: string;
  }) => void;
};

export default function EditSubjectsForm({
  shadow = false,
  initialValues = {},
  onSubmit,
}: EditSubjectsFormProps) {
  const [subjectName, setSubjectName] = useState(
    initialValues.subjectName ?? ""
  );
  const [teacherName, setTeacherName] = useState(
    initialValues.teacherName ?? ""
  );
  const [teacherEmail, setTeacherEmail] = useState(
    initialValues.teacherEmail ?? ""
  );
  const [firstCourseDate, setFirstCourseDate] = useState(
    initialValues.firstCourseDate ?? ""
  );
  const [lastCourseDate, setLastCourseDate] = useState(
    initialValues.lastCourseDate ?? ""
  );

  // Helper for the shadow class usage
  const cardClass = (extra: string = "") =>
    `bg-white rounded-lg p-8${shadow ? " shadow-sm" : ""}${extra}`;

  const handleEditSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      subjectName,
      teacherName,
      teacherEmail,
      firstCourseDate,
      lastCourseDate,
    };
    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log("Editing subject:", data);
    }
  };

  return (
    <div>
      {/* Manual Edit Form */}
      <div className={cardClass()}>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Modifier la matière
        </h2>

        <form className="space-y-6" onSubmit={handleEditSubject}>
          {/* Subject and Teacher Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la matière
              </label>
              <input
                type="text"
                placeholder="Entrez le nom de la matière"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
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
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
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
              value={teacherEmail}
              onChange={(e) => setTeacherEmail(e.target.value)}
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
                type="text"
                placeholder="JJ/MM/AAAA"
                value={firstCourseDate}
                onChange={(e) => setFirstCourseDate(e.target.value)}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date du dernier cours (facultatif)
              </label>
              <input
                type="text"
                placeholder="JJ/MM/AAAA"
                value={lastCourseDate}
                onChange={(e) => setLastCourseDate(e.target.value)}
                className="input w-full"
              />
            </div>
          </div>

          {/* Info Message */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <IoInformationCircleOutline className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>
              Après modification, vous serez redirigé vers la liste de vos
              matières.
            </p>
          </div>

          {/* Submit Button */}
          <button type="submit" className="button-primary max-w-xs">
            <span>Enregistrer les modifications</span>
            <IoArrowForward className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
