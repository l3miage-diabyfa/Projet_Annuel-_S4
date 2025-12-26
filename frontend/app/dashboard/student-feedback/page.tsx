"use client";

import React from "react";
import FeedbackHeader from "./components/FeedbackHeader";
import TimeRecapSection from "./components/TimeRecapSection";
import CourseFeedbackSection from "./components/CourseFeedbackSection";
import InstructorFeedbackSection from "./components/InstructorFeedbackSection";
import StrongWeakPointsSection from "./components/StrongWeakPointsSection";
import { FiDownload } from "react-icons/fi";

export default function StudentFeedbackPage() {
  return (
    <div className="min-h-screen pb-12 bg-gray-50/50">
      <div className="mx-auto px-6 py-8">
        {/* Top Breadcrumb/Nav if needed, or embedded in Header */}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content Column (Left) */}
          <div className="xl:col-span-3 space-y-10">
            <FeedbackHeader />
            <TimeRecapSection />
            <CourseFeedbackSection />
            <InstructorFeedbackSection />
            <StrongWeakPointsSection />
          </div>

          {/* Sidebar Column (Right) */}
          <div className="xl:col-span-1 space-y-6 pt-20">
            {" "}
            {/* pt-20 to align roughly below header or header height */}
            {/* Partage Card */}
            <div className="bg-white p-6 rounded-2xl border">
              <h3 className="font-bold text-gray-900 mb-2">Partage</h3>
              <p className="text-sm text-gray-500 mb-4">
                Partage ce lien aux étudiants pour obtenir plus de réponses ou
                télécharge le QR code.
              </p>

              <input
                type="text"
                className="input mb-4!"
                value="https://avis.izzzi.fr/racanGLAnJ5o8srDa"
                readOnly
              />

              <button className="underline flex items-center gap-2 font-medium transition-colors mb-6">
                Télécharger le QR code <FiDownload />
              </button>

              <h3 className="font-bold text-gray-900 mb-2">Export</h3>
              <p className="text-sm text-gray-500 mb-4">
                Exporte les retours dans le format de ton choix (.CSV, .xlsx).
              </p>
              <button className="button-primary w-fit!">
                Exporter les retours <FiDownload />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
