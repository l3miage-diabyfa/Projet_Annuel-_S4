"use client";

import React, { useState } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import TrialBanner from "../components/TrialBanner";
import EmptyFeedbackState from "./components/EmptyFeedbackState";
import FeedbackCard, { Feedback } from "./components/FeedbackCard";

export default function DashboardPage() {
  // Toggle this to see Empty State vs Content State
  // Pour tester l'état vide, passer cette liste à []
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: 1,
      subject: "UI design",
      classCode: "A3UI",
      teacher: "Zoé Doe",
      type: "end_of_course",
      returnCount: 17,
      score: 7.8,
      alertCount: 3,
      latestAlert: {
        type: "red",
        count: "1/3",
        text: "Ricotta Chicago Aussie extra pie. Ranch parmesan anchovies sautéed lovers red Chicago stuffed.",
      },
      summary:
        "Deep ipsum steak thin personal party. Personal mouth large broccoli bbq crust Hawaiian pesto mushrooms. Lasagna.",
      endDate: "26 sept. 2025",
    },
    {
      id: 2,
      subject: "UI design",
      classCode: "A3UI",
      teacher: "Zoé Doe",
      type: "end_of_course",
      returnCount: 17,
      score: 7.8,
      alertCount: 3,
      latestAlert: {
        type: "red",
        count: "1/3",
        text: "Ricotta Chicago Aussie extra pie. Ranch parmesan anchovies sautéed lovers red Chicago stuffed.",
      },
      summary:
        "Deep ipsum steak thin personal party. Personal mouth large broccoli bbq crust Hawaiian pesto mushrooms. Lasagna.",
      endDate: "26 sept. 2025",
    },
    {
      id: 3,
      subject: "UI design",
      classCode: "A3UI",
      teacher: "Zoé Doe",
      type: "during_course",
      returnCount: 17,
      score: 7.8,
      alertCount: 3,
      latestAlert: {
        type: "green",
        count: "1/2",
        text: "Ricotta Chicago Aussie extra pie. Ranch parmesan anchovies sautéed lovers red Chicago stuffed.",
      },
      summary:
        "Deep ipsum steak thin personal party. Personal mouth large broccoli bbq crust Hawaiian pesto mushrooms. Lasagna.",
      endDate: "26 sept. 2025",
    },
    {
      id: 4,
      subject: "UI design",
      classCode: "A3UI",
      teacher: "Zoé Doe",
      type: "during_course",
      returnCount: 17,
      score: 7.8,
      alertCount: 3,
      latestAlert: {
        type: "red", // Assuming Alert logic
        count: "",
        text: "Deep ipsum steak thin personal party. Personal mouth large broccoli bbq crust Hawaiian pesto mushrooms. Lasagna.",
      }, // Using summary as placeholder if no alert text
      summary:
        "Deep ipsum steak thin personal party. Personal mouth large broccoli bbq crust Hawaiian pesto mushrooms. Lasagna.",
      endDate: "25 sept. 2025",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"current" | "finished">("current");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAlertsOnly, setShowAlertsOnly] = useState(false);

  // -- Empty State Component --
  if (feedbacks.length === 0) {
    return <EmptyFeedbackState />;
  }

  // -- Content State Component --
  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
        {/* Banner */}
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
            {/* Search */}
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

            {/* Right Filters */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedbacks.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      </div>
    </div>
  );
}
