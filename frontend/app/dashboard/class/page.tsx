"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiSearch, FiPlus, FiArrowUpRight } from "react-icons/fi";
import TrialBanner from "../components/TrialBanner";
import ClassCard from "./components/ClassCard";
import {
  AddClassModal,
  EditClassModal,
  ArchiveClassModal,
  LimitReachedModal,
} from "./components/ClassModals";
import { getClasses, archiveClass, createClass, updateClass, getUserFromToken, type Class } from "@/lib/api";
import { getTokenCookie } from "@/utils/cookie";

export default function ClassPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  // Selection state
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [editingClass, setEditingClass] = useState<any>(null);

  const MAX_CLASSES = 5;
  const isAdmin = true; // Get from user data

  useEffect(() => {
    const token = getTokenCookie();
    if (!token) {
      router.push('/login');
      return;
    }

    loadData();
  }, [router]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      
      const userInfo = getUserFromToken();
      if (!userInfo) {
        router.push('/login');
        return;
      }

      setCurrentUserId(userInfo.userId);

// Fetch only THIS user's classes
const classesData = await getClasses({ 
  teacherId: userInfo.userId, // ← Only get classes for this teacher
  isActive: true 
});

setClasses(classesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

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

  const handleAddSubmit = async (data: any) => {
    try {
      if (!currentUserId) throw new Error('User not found');
      
      await createClass({
        name: data.name,
        description: data.description || undefined,
        academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1), // Default
        gradeLevel: 'Non spécifié', // Default
        teacherId: currentUserId,
        studentEmails: data.emails || undefined, // Sends student an email
      });
      
      await loadData();
      setIsAddModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la création');
    }
  };

  const handleEditClick = (cls: Class) => {
    setEditingClass({
      id: cls.id,
      name: cls.name,
      description: cls.description || '',
      students: cls.enrollments.length.toString(),
      emails: '', // Not stored in backend
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data: any) => {
    try {
      await updateClass(editingClass.id, {
        name: data.name,
        description: data.description || undefined,
      });
      
      await loadData();
      setIsEditModalOpen(false);
      setEditingClass(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la modification');
    }
  };

  const handleArchiveClick = (id: string) => {
    setSelectedClassId(id);
    setIsArchiveModalOpen(true);
  };

  const handleArchiveConfirm = async () => {
    try {
      if (!selectedClassId) return;
      
      await archiveClass(selectedClassId);
      await loadData();
      setIsArchiveModalOpen(false);
      setSelectedClassId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de l\'archivage');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-12">
        <div className="mx-auto px-6 py-8">
          <p className="text-center text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pb-12">
        <div className="mx-auto px-6 py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-xl">
            <p className="font-semibold">Erreur</p>
            <p>{error}</p>
            <button onClick={loadData} className="mt-2 text-sm underline">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="mx-auto px-6 py-8 space-y-8">
        <TrialBanner />

        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {classes.length} classe{classes.length !== 1 ? 's' : ''} disponible{classes.length !== 1 ? 's' : ''}
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
        {filteredClasses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <p className="text-gray-500 text-lg mb-4">
              {searchQuery ? 'Aucune classe trouvée' : 'Aucune classe pour le moment'}
            </p>
            <button
              onClick={handleAddClick}
              className="inline-block bg-primary-yellow hover:bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl transition"
            >
              Créer votre première classe
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <ClassCard
                key={cls.id}
                cls={{
                  id: cls.id as any, // Convert string to number for component
                  name: cls.name,
                  description: cls.description || '',
                  students: cls.enrollments.length,
                }}
                onEdit={() => handleEditClick(cls)}
                onArchive={() => handleArchiveClick(cls.id)}
              />
            ))}
          </div>
        )}

        {/* Footer Link */}
        <div className="pt-2">
          <Link
            href="/dashboard/class/archived"
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