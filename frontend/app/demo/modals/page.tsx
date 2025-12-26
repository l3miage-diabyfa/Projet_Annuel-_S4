"use client";

import React, { useState } from "react";
import ShareModal from "@/components/shared/ShareModal";
import StudentMessageModal from "@/components/shared/StudentMessageModal";
import AlertsModal from "@/components/shared/AlertsModal";
import NotificationsModal from "@/components/shared/NotificationsModal";

const mockCollaborators = [
  {
    id: "1",
    name: "Jeremy Serval",
    email: "jeremy@example.com",
    role: "admin" as const,
    initials: "JS",
    color: "#F26103",
    isPending: false,
  },
  {
    id: "2",
    name: "Kathleen Alcini",
    email: "kathleen@example.com",
    role: "editor" as const,
    initials: "KA",
    color: "#F26103",
    isPending: false,
  },
  {
    id: "3",
    name: "Bloup Bloup",
    email: "bloup@example.com",
    role: "editor" as const,
    initials: "BB",
    color: "#D1D5DB",
    isPending: true,
  },
];

const mockAlerts = [
  {
    id: "1",
    title: "Alerte 1/3",
    description: "Ricotta Chicago Aussie extra pie. Ranch parmesan anchovies sautéed lovers red Chicago stuffed.",
    timestamp: "Il y a 2 heures",
    isProcessed: false,
  },
  {
    id: "2",
    title: "Alerte 2/3",
    description: "Ricotta Chicago Aussie extra pie. Ranch parmesan anchovies sautéed lovers red Chicago stuffed.",
    timestamp: "Il y a 2 heures",
    isProcessed: false,
  },
  {
    id: "3",
    title: "Alerte 3/3",
    description: "Ricotta Chicago Aussie extra pie. Ranch parmesan anchovies sautéed lovers red Chicago stuffed.",
    timestamp: "Il y a 3 heures",
    isProcessed: false,
  },
];

const mockNotifications = [
  {
    id: "1",
    type: "negative" as const,
    title: "Alerte négative détectée sur le cours",
    course: "UI design",
    teacher: "Kathleen Alcini",
    date: "6 juin à 10:00",
    isRead: false,
  },
  {
    id: "2",
    type: "positive" as const,
    title: "Alerte positive détectée sur le cours",
    course: "Marketing digital intergénérationnel",
    teacher: "Yoann Coualan",
    date: "6 juin à 10:00",
    isRead: false,
  },
  {
    id: "3",
    type: "negative" as const,
    title: "Alerte négative détectée sur le cours",
    course: "UI design",
    teacher: "Kathleen Alcini",
    date: "6 juin à 10:00",
    isRead: false,
  },
];

export default function ModalsTestPage() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  const [collaborators, setCollaborators] = useState(mockCollaborators);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [notifications, setNotifications] = useState(mockNotifications);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Modals
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Inviter des collaborateurs
            </h2>
            <p className="text-gray-600 text-sm">
              Modal de partage et gestion des accès
            </p>
          </button>

          <button
            onClick={() => setIsMessageModalOpen(true)}
            className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Message aux étudiants
            </h2>
            <p className="text-gray-600 text-sm">
              Envoyer un message généré par IA
            </p>
          </button>

          <button
            onClick={() => setIsAlertsModalOpen(true)}
            className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Alertes
            </h2>
            <p className="text-gray-600 text-sm">
              Gérer les alertes du cours
            </p>
          </button>

          <button
            onClick={() => setIsNotificationsModalOpen(true)}
            className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Notifications
            </h2>
            <p className="text-gray-600 text-sm">
              Voir les notifications lues/non lues
            </p>
          </button>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        collaborators={collaborators}
        onInvite={(email, role) => {
          console.log("Invite:", email, role);
        }}
        onChangeRole={(id, role) => {
          setCollaborators((prev) =>
            prev.map((c) => (c.id === id ? { ...c, role } : c))
          );
        }}
        onRemoveAccess={(id) => {
          setCollaborators((prev) => prev.filter((c) => c.id !== id));
        }}
      />

      <StudentMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        onSend={(subject, message) => {
          console.log("Message envoyé:", subject, message);
        }}
      />

      <AlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        alerts={alerts}
        onToggleAlert={(id) => {
          setAlerts((prev) =>
            prev.map((a) => (a.id === id ? { ...a, isProcessed: !a.isProcessed } : a))
          );
        }}
        onComment={(id) => console.log("Comment:", id)}
        onSendMessage={(id) => {
          console.log("Send message for alert:", id);
          setIsMessageModalOpen(true);
        }}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onToggleNotification={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
          );
        }}
        onMarkAsRead={() => console.log("Marked as read")}
      />
    </div>
  );
}
