"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiSearch, FiPlus, FiArrowUpRight } from "react-icons/fi";
import TrialBanner from "../components/TrialBanner";
import ClassCard from "./components/ClassCard";
import {
  AddClassModal,
  EditClassModal,
  ArchiveClassModal,
  LimitReachedModal,
} from "./components/ClassModals";

export default function ClassPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  // Selection state
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [editingClass, setEditingClass] = useState<any>(null); // Type 'any' for simplicity with mock data, or define proper interface

  // Hardcoded limit check for demo
  const MAX_CLASSES = 5;
  const isAdmin = true; // Toggle to test admin vs non-admin limit modal

  // Données simulées pour les classes (normally fetched)
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: "M2DG",
      description: "Description de la classe",
      students: 24,
    },
    {
      id: 2,
      name: "B3MD",
      description: "Description de la classe",
      students: 24,
    },
    { id: 3, name: "B2FG", description: "En alternance", students: 24 },
  ]);

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleAddClick = () => {
    if (classes.length >= MAX_CLASSES) {
      setIsLimitModalOpen(true);
    } else {
      setIsAddModalOpen(true);
    }
  };

  const handleAddSubmit = (data: any) => {
    console.log("Adding class:", data);
    // Add logic here
    const newClass = {
      id: classes.length + 1,
      name: data.name,
      description: data.description,
      students: parseInt(data.students) || 0,
    };
    setClasses([...classes, newClass]);
    setIsAddModalOpen(false);
  };

  const handleEditClick = (cls: any) => {
    setEditingClass({
      ...cls,
      emails: "", // Mock data doesn't have emails, so empty
      students: cls.students.toString(),
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (data: any) => {
    console.log("Editing class:", data);
    // Update logic here
    setClasses(
      classes.map((c) =>
        c.id === editingClass.id
          ? {
              ...c,
              name: data.name,
              description: data.description,
              students: parseInt(data.students),
            }
          : c
      )
    );
    setIsEditModalOpen(false);
    setEditingClass(null);
  };

  const handleArchiveClick = (id: number) => {
    setSelectedClassId(id);
    setIsArchiveModalOpen(true);
  };

  const handleArchiveConfirm = () => {
    console.log("Archiving class:", selectedClassId);
    // Archive logic here (e.g. remove from list)
    setClasses(classes.filter((c) => c.id !== selectedClassId));
    setIsArchiveModalOpen(false);
    setSelectedClassId(null);
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="mx-auto px-6 py-8 space-y-8">
        {/* Banner "Période d'essai" */}
        <TrialBanner />

        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {classes.length} classes disponibles
            </h1>
            <p className="text-gray-500 text-sm">
              Vous pouvez ajouter jusqu'à {MAX_CLASSES} classes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Rechercher une classe"
                className="input pr-10! py-3! mb-0!"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddClick}
              className="bg-primary-yellow hover:bg-yellow-400 text-gray-900 font-medium px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap w-full sm:w-auto cursor-pointer"
            >
              Ajouter une classe <FiPlus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <ClassCard
              key={cls.id}
              cls={cls}
              onEdit={handleEditClick}
              onArchive={handleArchiveClick}
            />
          ))}
        </div>

        {/* Footer Link */}
        <div className="pt-2">
          <Link
            href="/dashboard/classes/archived"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Voir les classes archivées <FiArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Modals */}
      <AddClassModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />

      {editingClass && (
        <EditClassModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingClass(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={editingClass}
        />
      )}

      <ArchiveClassModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        onConfirm={handleArchiveConfirm}
      />

      <LimitReachedModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        isAdmin={isAdmin}
      />
    </div>
  );
}
