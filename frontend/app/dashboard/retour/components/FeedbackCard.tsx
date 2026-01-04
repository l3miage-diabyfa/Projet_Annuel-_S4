import React from "react";
import Link from "next/link";
import {
  FiAlertCircle,
  FiArrowUpRight,
  FiRefreshCw,
  FiFileText,
  FiHeart,
} from "react-icons/fi";

export interface Feedback {
  id: number | string;
  subject: string;
  classCode: string;
  teacher: string;
  type: "end_of_course" | "during_course";
  returnCount: number;
  score: number;
  alertCount: number;
  latestAlert?: {
    type: "red" | "green";
    count: string;
    text: string;
  };
  summary: string;
  endDate: string;
  formId?: string;
  isFinished?: boolean;
}

interface FeedbackCardProps {
  feedback: Feedback;
}

export default function FeedbackCard({ feedback }: FeedbackCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {feedback.subject}
            {/* Chip */}
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded-lg border uppercase ${
                feedback.type === "end_of_course"
                  ? "bg-blue-50 text-blue-800 border-blue-200"
                  : "bg-orange-50 text-orange-800 border-orange-200"
              }`}
            >
              {feedback.type === "end_of_course"
                ? "Formulaire fin de cours"
                : "Formulaire pendant le cours"}
            </span>
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 font-medium">
            <span className="font-bold text-gray-900">
              {feedback.classCode}
            </span>
            <span>{feedback.teacher}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-yellow-100 px-2 py-2 rounded-full text-xs font-bold">
            Retours{" "}
            <span className="text-gray-900">{feedback.returnCount}</span>
          </div>
          <div className="bg-yellow-100 px-2 py-2 rounded-full text-xs font-bold">
            Score{" "}
            <span className="text-gray-900 bg-yellow-300 px-1 py-1 rounded-full">
              {feedback.score}
            </span>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-gray-500">
            {feedback.alertCount} Alertes disponibles
          </span>
          <Link
            href="#"
            className="text-xs font-bold text-gray-900 underline decoration-gray-300 hover:text-black"
          >
            Voir toutes les alertes
          </Link>
        </div>

        {feedback.latestAlert && (
          <div
            className={`p-4 rounded-lg text-sm font-medium flex gap-3 items-start ${
              feedback.latestAlert.type === "red"
                ? "bg-[#ff4d00] text-white"
                : "bg-green-700 text-white"
            }`}
          >
            <div className="p-1 rounded shrink-0">
              {feedback.latestAlert.type === "red" ? (
                <FiAlertCircle className="w-4 h-4" />
              ) : (
                <FiHeart className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold uppercase text-[10px]">Alerte</span>
                <span className="bg-white text-gray-900 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  {feedback.latestAlert.count}
                </span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {feedback.latestAlert.text}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="flex gap-3 items-start">
        <FiFileText className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
        <div>
          <span className="text-xs font-bold text-gray-900 block mb-1">
            Synthèse des retours
          </span>
          <p className="text-sm text-gray-600 leading-relaxed">
            {feedback.summary}
          </p>
          <button className="text-xs text-gray-500 hover:text-gray-900 underline mt-1">
            Voir plus
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-50">
        <div className="w-full sm:w-auto">
          <Link 
            href={feedback.formId ? `/dashboard/reviews/${feedback.formId}` : '#'}
            className="button-primary"
          >
            Voir les retours <FiArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-col items-end gap-1 w-full sm:w-auto text-right">
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Relancer les étudiants <FiRefreshCw className="w-4 h-4" />
          </button>
          <p className="text-[10px] text-gray-400">
            En essai jusqu'au {feedback.endDate}. Retours visibles (anonymes sur
            le plan gratuit)
          </p>
        </div>
      </div>
    </div>
  );
}
