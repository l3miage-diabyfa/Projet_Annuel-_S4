"use client";
import React, { useState } from "react";
import {
  IoInformationCircleOutline,
  IoArrowForward,
  IoDownloadOutline,
  IoCloudUploadOutline,
} from "react-icons/io5";

type AddSubjectsFormProps = {
  shadow?: boolean;
};

export default function AddSubjectsForm({
  shadow = false,
}: AddSubjectsFormProps) {
  const [subjectName, setSubjectName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [firstCourseDate, setFirstCourseDate] = useState("");
  const [lastCourseDate, setLastCourseDate] = useState("");

  // Helper for the shadow class usage
  const cardClass = (extra: string = "") =>
    `bg-white rounded-lg p-8${shadow ? " shadow-sm" : ""}${extra}`;

  const handleCreateSubject = () => {
    console.log("Creating subject:", {
      subjectName,
      teacherName,
      teacherEmail,
      firstCourseDate,
      lastCourseDate,
    });
  };
  return (
    <div>
      {/* CSV Upload Section */}
      <div className={cardClass(" mb-8")}>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Télécharger le CSV pour ajouter toutes tes matières d'un coup.
        </h2>
        <div className="mb-6">
          <a href="#" className="button-link text-sm !text-gray-600">
            Comment ça marche ?
          </a>
          <span className="text-sm text-gray-600 ml-1">(1 minute)</span>
        </div>

        <div className="flex flex-wrap gap-4">
          <button className="button-outline">
            <span>Télécharger notre modèle CSV</span>
            <IoDownloadOutline className="w-5 h-5" />
          </button>
          <button className="button-primary !w-fit">
            <span>Importer un fichier CSV</span>
            <IoCloudUploadOutline className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* OR Divider */}
      <div className="text-center my-8">
        <span className="text-3xl font-bold text-gray-900">ou</span>
      </div>

      {/* Manual Entry Form */}
      <div className={cardClass()}>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Ajouter les matières une par une.
        </h2>

        <div className="space-y-6">
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
              Après création, vous serez redirigé vers la liste de vos matières.
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleCreateSubject}
            className="button-primary max-w-xs"
          >
            <span>Créer la matière</span>
            <IoArrowForward className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
