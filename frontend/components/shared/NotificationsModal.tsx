"use client";

import React, { useState } from "react";
import { IoClose, IoWarning, IoCheckmarkCircle } from "react-icons/io5";

interface Notification {
  id: string;
  type: "negative" | "positive";
  title: string;
  course?: string;
  teacher?: string;
  date: string;
  isRead: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: Notification[];
  onToggleNotification?: (notificationId: string) => void;
  onMarkAsRead?: () => void;
}

export default function NotificationsModal({
  isOpen,
  onClose,
  notifications = [],
  onToggleNotification,
  onMarkAsRead,
}: NotificationsModalProps) {
  const [activeTab, setActiveTab] = useState<"unread" | "read">("unread");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  if (!isOpen) return null;

  const unreadNotifications = notifications.filter((notif) => !notif.isRead);
  const readNotifications = notifications.filter((notif) => notif.isRead);
  const currentNotifications = activeTab === "unread" ? unreadNotifications : readNotifications;

  const toggleSelection = (notificationId: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleMarkAsRead = () => {
    if (onMarkAsRead && selectedNotifications.length > 0) {
      selectedNotifications.forEach((id) => {
        onToggleNotification?.(id);
      });
      setSelectedNotifications([]);
      onMarkAsRead();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Notifications</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="Fermer"
            >
              <IoClose className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs and Mark as Read */}
        <div className="px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {activeTab === "unread" && (
              <button
                onClick={handleMarkAsRead}
                disabled={selectedNotifications.length === 0}
                className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <IoCheckmarkCircle className="w-5 h-5" />
                Marquer comme lues
              </button>
            )}
            <div className={`flex gap-6 ${activeTab === "read" ? "ml-auto" : ""}`}>
              <button
                onClick={() => setActiveTab("unread")}
                className={`pb-2 text-base font-medium transition-colors relative ${
                  activeTab === "unread"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Non lues
                {activeTab === "unread" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("read")}
                className={`pb-2 text-base font-medium transition-colors relative ${
                  activeTab === "read"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Lues
                {activeTab === "read" && (
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

        {/* Content */}
        <div className="px-4 sm:px-8 py-6">
          {currentNotifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucune notification{activeTab === "read" ? " lue" : ""}
            </div>
          ) : (
            <div className="space-y-3">
              {currentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4 py-3 hover:bg-gray-50 rounded-lg transition-colors px-3"
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notification.type === "negative" ? "bg-orange-500" : "bg-green-600"
                    }`}
                  >
                    {notification.type === "negative" ? (
                      <IoWarning className="w-6 h-6 text-white" />
                    ) : (
                      <IoCheckmarkCircle className="w-6 h-6 text-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium mb-1">
                      {notification.title}{" "}
                      {notification.course && (
                        <span className="font-bold">{notification.course}</span>
                      )}{" "}
                      {notification.teacher && (
                        <>
                          de <span className="font-bold">{notification.teacher}</span>
                        </>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{notification.date}</p>
                  </div>

                  {/* Checkbox */}
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => toggleSelection(notification.id)}
                      className="w-5 h-5 rounded-full border-2 border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                      aria-label={`Sélectionner la notification: ${notification.title}`}
                    />
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
