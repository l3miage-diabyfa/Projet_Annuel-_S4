"use client";

import React, { useState } from "react";
import { IoAdd, IoArrowForward, IoPencil, IoTrash } from "react-icons/io5";
import BackButton from "../components/backButton";
import AddSubjectsForm from "../components/AddSubjectsForm";
import EditSubjectsForm from "../components/EditSubjectsForm";

const subjects = [
  {
    id: 1,
    name: "UI design",
    teacherName: "Kathleen Alcini",
    teacherEmail: "kathleen.alcini@jedy.fr",
    firstCourseDate: "31/08/2022",
    lastCourseDate: "31/12/2022",
  },
  {
    id: 2,
    name: "UI design",
    teacherName: "Kathleen Alcini",
    teacherEmail: "kathleen.alcini@jedy.fr",
    firstCourseDate: "31/08/2022",
    lastCourseDate: "31/12/2022",
  },
  {
    id: 3,
    name: "UI design",
    teacherName: "Kathleen Alcini",
    teacherEmail: "kathleen.alcini@jedy.fr",
    firstCourseDate: "31/08/2022",
    lastCourseDate: "31/12/2022",
  },
];

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // To identify which subject is being edited
  const [editingSubject, setEditingSubject] = useState<
    null | (typeof subjects)[0]
  >(null);

  const handleEdit = (id: number) => {
    const found = subjects.find((s) => s.id === id) || null;
    setEditingSubject(found);
  };

  const handleCloseEditModal = () => {
    setEditingSubject(null);
  };

  const handleAskDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleValidate = () => {
    console.log("Validate subjects");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Modal ajout matière */}
      {isModalOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40">
          <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
              aria-label="Fermer"
              style={{ lineHeight: 1 }}
              type="button"
            >
              ×
            </button>
            <AddSubjectsForm />
          </div>
        </div>
      )}

      {/* Modal d'édition de matière */}
      {editingSubject && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40">
          <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <button
              onClick={handleCloseEditModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
              aria-label="Fermer"
              style={{ lineHeight: 1 }}
              type="button"
            >
              ×
            </button>
            <EditSubjectsForm
              initialValues={{
                subjectName: editingSubject.name,
                teacherName: editingSubject.teacherName,
                teacherEmail: editingSubject.teacherEmail,
                firstCourseDate: editingSubject.firstCourseDate,
                lastCourseDate: editingSubject.lastCourseDate,
              }}
              onSubmit={(data) => {
                console.log("Update subject", data);
                handleCloseEditModal();
              }}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression d'une matière */}
      {isDeleteModalOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={handleCancelDelete}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
              aria-label="Fermer"
              style={{ lineHeight: 1 }}
              type="button"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Supprimer la matière
            </h2>
            <p className="mb-6 text-gray-700 whitespace-pre-line">
              Cette action est irréversible. La matière et toutes ses
              informations associées seront définitivement supprimées.
              Voulez-vous vraiment continuer ?
            </p>
            <div className="flex gap-4 justify-end flex-row-reverse">
              <button
                onClick={handleCancelDelete}
                className="button-primary bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
                type="button"
              >
                Supprimer
              </button>
              <button
                onClick={handleCancelDelete}
                className="button-outline"
                type="button"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <BackButton
        text="Retour aux uploads des matières"
        href="/dashboard/add-subjects"
      />

      {/* Main Content */}
      <main className="mx-auto px-6 py-12">
        {/* Title and Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-foreground">Mes matières</h1>
            <span className="text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
              B3UI
            </span>
          </div>

          <div className="flex gap-3">
            <button
              className="button-outline whitespace-nowrap flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
              type="button"
            >
              <span>Ajouter une matière</span>
              <IoAdd className="w-5 h-5" />
            </button>
            <button
              onClick={handleValidate}
              className="button-primary whitespace-nowrap"
            >
              <span>Valider</span>
              <IoArrowForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden min-h-[calc(100vh-500px)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Matière
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Nom de l'intervenant
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Email de l'intervenant
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Date du premier cours
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Date du dernier cours
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subjects.map((subject) => (
                  <tr
                    key={subject.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {subject.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {subject.teacherName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {subject.teacherEmail}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {subject.firstCourseDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {subject.lastCourseDate}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(subject.id)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                          aria-label="Modifier"
                        >
                          <IoPencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleAskDelete}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          aria-label="Supprimer"
                        >
                          <IoTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
