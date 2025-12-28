"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiSearch, FiArrowLeft, FiArrowUpRight } from "react-icons/fi";
import TrialBanner from "../../components/TrialBanner";
import { getClasses, unarchiveClass, getUserFromToken, type Class } from "@/lib/api";
import { getTokenCookie } from "@/utils/cookie";

export default function ArchivedClassesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getTokenCookie();
    if (!token) {
      router.push('/login');
      return;
    }

    loadClasses();
  }, [router]);

  async function loadClasses() {
    try {
      setLoading(true);
      setError(null);

      const userInfo = getUserFromToken();
      if (!userInfo) {
        router.push('/login');
        return;
      }

      // Fetch only archived classes
      const classesData = await getClasses({ 
        teacherId: userInfo.userId,
        isActive: false // ← Get archived classes
      });

      setClasses(classesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  async function handleUnarchive(id: string, name: string) {
    if (!confirm(`Restaurer la classe "${name}" ?`)) return;

    try {
      await unarchiveClass(id);
      await loadClasses();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la restauration');
    }
  }

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <button onClick={loadClasses} className="mt-2 text-sm underline">
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

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link
              href="/dashboard/class"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <FiArrowLeft className="w-4 h-4" /> Retour aux classes actives
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Classes archivées ({classes.length})
            </h1>
            <p className="text-gray-500 text-sm">
              Consultez vos classes archivées
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Rechercher une classe"
              className="input pr-10! py-3! mb-0!"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Grid */}
        {filteredClasses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <p className="text-gray-500 text-lg mb-4">
              {searchQuery ? 'Aucune classe trouvée' : 'Aucune classe archivée'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-xl p-6 border border-gray-100 flex flex-col justify-between min-h-[180px]"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{cls.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Archivée
                    </span>
                  </div>
                  {cls.description && (
                    <p className="text-xs text-gray-500 mb-2">{cls.description}</p>
                  )}
                  <p className="text-xs font-bold text-gray-900">
                    {cls.enrollments.length} étudiant{cls.enrollments.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    📅 {cls.academicYear} • 🎓 {cls.gradeLevel}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <Link
                    href={`/dashboard/class/${cls.id}`}
                    className="text-xs text-blue-600 hover:text-blue-700 underline"
                  >
                    Consulter
                  </Link>
                  <button
                    onClick={() => handleUnarchive(cls.id, cls.name)}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Restaurer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}