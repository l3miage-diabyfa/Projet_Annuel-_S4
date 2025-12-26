"use client";

import React, { useState } from "react";
import { IoClose, IoCheckmarkCircle, IoWarning, IoChatbubbleOutline, IoMailOutline } from "react-icons/io5";

interface Alert {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isProcessed: boolean;
}

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  course?: string;
  teacher?: string;
  alerts?: Alert[];
  onToggleAlert?: (alertId: string) => void;
  onComment?: (alertId: string) => void;
  onSendMessage?: (alertId: string) => void;
  showSuccessMessage?: boolean;
}

export default function AlertsModal({
  isOpen,
  onClose,
  className = "UI Design",
  course = "B3UI",
  teacher = "Kathleen Alcini",
  alerts = [],
  onToggleAlert,
  onComment,
  onSendMessage,
  showSuccessMessage = false,
}: AlertsModalProps) {
  const [activeTab, setActiveTab] = useState<"unprocessed" | "processed">("unprocessed");

  if (!isOpen) return null;

  const unprocessedAlerts = alerts.filter((alert) => !alert.isProcessed);
  const processedAlerts = alerts.filter((alert) => alert.isProcessed);
  const currentAlerts = activeTab === "unprocessed" ? unprocessedAlerts : processedAlerts;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Alertes</h2>
              <div className="flex flex-wrap gap-2 px-4 py-2 border border-gray-300 rounded-full w-fit">
                <span className="text-gray-900 text-sm font-medium">
                  {className}
                </span>
                <span className="text-gray-900 text-sm font-medium">
                  {course}
                </span>
                <span className="text-gray-900 text-sm font-medium">
                  {teacher}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="Fermer"
            >
              <IoClose className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-lg font-bold text-gray-900">
              {alerts.length} alerte{alerts.length > 1 ? "s" : ""} disponible{alerts.length > 1 ? "s" : ""}
            </div>
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("unprocessed")}
                className={`pb-2 text-base font-medium transition-colors relative ${
                  activeTab === "unprocessed"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Non traitées
                {activeTab === "unprocessed" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("processed")}
                className={`pb-2 text-base font-medium transition-colors relative ${
                  activeTab === "processed"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                traitées
                {activeTab === "processed" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="px-4 sm:px-8">
          <div className="border-t border-gray-200"></div>
        </div>

        <div className="px-4 sm:px-8 py-6">
          {showSuccessMessage && (
            <div 
              className="mb-6 p-4 rounded-xl flex items-center gap-3"
              style={{ backgroundColor: 'rgba(16, 103, 33, 0.2)' }}
            >
              <IoCheckmarkCircle className="w-6 h-6 flex-shrink-0" style={{ color: '#106721' }} />
              <span className="font-medium" style={{ color: '#106721' }}>
                <b>Message envoyé avec succès aux étudiants</b>
              </span>
            </div>
          )}

          {currentAlerts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucune alerte{activeTab === "processed" ? " traitée" : ""}
            </div>
          ) : (
            <div className="space-y-4">
              {currentAlerts.map((alert, index) => (
                <div
                  key={alert.id}
                  className="border border-gray-200 rounded-xl p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <IoWarning className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-bold text-gray-900 text-sm sm:text-base">
                        Alerte {index + 1}/{currentAlerts.length}
                      </span>
                      <button
                        className="px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#F26103' }}
                      >
                        à traiter
                      </button>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs sm:text-sm text-gray-600">Marquée comme traitée</span>
                      <input
                        type="checkbox"
                        checked={alert.isProcessed}
                        onChange={() => onToggleAlert?.(alert.id)}
                        className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                      />
                    </label>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    {alert.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 mb-2">{alert.description}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4">{alert.timestamp}</p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => onComment?.(alert.id)}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90"
                      style={{ backgroundColor: '#FFE552' }}
                    >
                      <IoChatbubbleOutline className="w-5 h-5" />
                      Commenter
                    </button>
                    <button
                      onClick={() => onSendMessage?.(alert.id)}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium text-gray-900 transition-colors"
                    >
                      <IoMailOutline className="w-5 h-5" />
                      Envoyer un message aux étudiants
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
