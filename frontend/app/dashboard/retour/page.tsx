"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import TrialBanner from "../components/TrialBanner";
import EmptyFeedbackState from "./components/EmptyFeedbackState";
import FeedbackCard, { Feedback } from "./components/FeedbackCard";
import { getClasses, getSubjectsByClass, getUserFromToken, type Class, type Subject } from "@/lib/api";
import { getTokenCookie } from "@/utils/cookie";

export default function DashboardPage() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"current" | "finished">("current");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAlertsOnly, setShowAlertsOnly] = useState(false);

  useEffect(() => {
    const token = getTokenCookie();
    if (!token) {
      router.push('/login');
      return;
    }

    loadFeedbacks();
  }, [router]);

  async function loadFeedbacks() {
    try {
      setLoading(true);
      setError(null);

      const userInfo = getUserFromToken();
      if (!userInfo) {
        router.push('/login');
        return;
      }

      // Get all teacher's classes
      const classes = await getClasses({ 
        teacherId: userInfo.userId,
        isActive: true 
      });

      // Get subjects with forms for each class
      const allFeedbacks: Feedback[] = [];

      for (const classItem of classes) {
        const subjects = await getSubjectsByClass(classItem.id);

        for (const subject of subjects) {
          // Check if subject has forms
          const typedSubject = subject as Subject & {
            duringForm?: any;
            afterForm?: any;
          };

          // Add "during" form feedback
          if (typedSubject.duringForm) {
            allFeedbacks.push({
              id: `during-${typedSubject.duringForm.id}`,
              subject: subject.name,
              classCode: classItem.name,
              teacher: subject.instructorName || 'Non spécifié',
              type: "during_course",
              returnCount: typedSubject.duringForm._count?.reviews || 0,
              score: 0, // TODO: Calculate from responses
              alertCount: 0, // TODO: Calculate from responses
              summary: "Chargement de la synthèse...", // TODO: Generate from AI
              endDate: subject.lastLessonDate 
                ? new Date(subject.lastLessonDate).toLocaleDateString('fr-FR')
                : 'Non défini',
              formId: typedSubject.duringForm.id,
            });
          }

          // Add "after" form feedback
          if (typedSubject.afterForm) {
            allFeedbacks.push({
              id: `after-${typedSubject.afterForm.id}`,
              subject: subject.name,
              classCode: classItem.name,
              teacher: subject.instructorName || 'Non spécifié',
              type: "end_of_course",
              returnCount: typedSubject.afterForm._count?.reviews || 0,
              score: 0, // TODO: Calculate
              alertCount: 0, // TODO: Calculate
              summary: "Chargement de la synthèse...",
              endDate: subject.lastLessonDate 
                ? new Date(subject.lastLessonDate).toLocaleDateString('fr-FR')
                : 'Non défini',
              formId: typedSubject.afterForm.id,
            });
          }
        }
      }

      setFeedbacks(allFeedbacks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch = 
      feedback.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.classCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.teacher.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAlerts = !showAlertsOnly || feedback.alertCount > 0;

    return matchesSearch && matchesAlerts;
  });

  if (loading) {
    return (
      <div className="min-h-screen pb-12">
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <p className="text-center text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pb-12">
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-xl">
            <p className="font-semibold">Erreur</p>
            <p>{error}</p>
            <button onClick={loadFeedbacks} className="mt-2 text-sm underline">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return <EmptyFeedbackState />;
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
        <TrialBanner />

        {/* Tabs & Title */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("current")}
              className={`pb-4 text-sm font-bold transition-colors border-b-2 ${
                activeTab === "current"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Matières en cours
            </button>
            <button
              onClick={() => setActiveTab("finished")}
              className={`pb-4 text-sm font-bold transition-colors border-b-2 ${
                activeTab === "finished"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Matières terminées
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="relative w-full lg:w-96">
              <input
                type="text"
                placeholder="Rechercher par classe, intervenant, cours..."
                className="input pr-10! py-3! mb-0!"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-200 px-4 py-3 pr-10 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                  <option value="">Trier par</option>
                  <option value="recent">Plus récent</option>
                  <option value="ancien">Plus anciens</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600" />
              </div>

              <div className="relative">
                <select className="appearance-none bg-white border border-gray-200 px-4 py-3 pr-10 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                  <option value="">Filtrer par</option>
                  <option value="tous">Tous</option>
                  <option value="pendant">Pendant le cours</option>
                  <option value="fin">Fin de cours</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600" />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAlertsOnly(!showAlertsOnly)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                    showAlertsOnly ? "bg-black" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full transform transition-transform duration-200 ease-in-out ${
                      showAlertsOnly ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-gray-900">
                  Afficher les alertes uniquement
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedbacks Grid */}
        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <p className="text-gray-500">Aucun retour trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFeedbacks.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}