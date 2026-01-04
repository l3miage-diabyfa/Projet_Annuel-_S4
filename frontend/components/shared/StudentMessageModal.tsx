"use client";

import React, { useState } from "react";
import { IoClose, IoArrowForward } from "react-icons/io5";

interface StudentMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend?: (subject: string, message: string) => void;
  initialSubject?: string;
  initialMessage?: string;
}

export default function StudentMessageModal({
  isOpen,
  onClose,
  onSend,
  initialSubject = "",
  initialMessage = "",
}: StudentMessageModalProps) {
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState(initialMessage);

  if (!isOpen) return null;

  const handleSend = () => {
    if (subject && message && onSend) {
      onSend(subject, message);
      setSubject("");
      setMessage("");
      onClose();
    }
  };

  const handleCancel = () => {
    setSubject(initialSubject);
    setMessage(initialMessage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Envoyer un message aux étudiants
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">
                Ce message est généré via IA, vous pouvez le modifier avant de l&apos;envoyer.
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="Fermer"
            >
              <IoClose className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="px-4 sm:px-8">
          <div className="border-t border-gray-200"></div>
        </div>

        <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-6 sm:pb-8">
          <div className="mb-6">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
              Objet
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Entrez l'objet du message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 sm:justify-end">
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors font-medium text-gray-900 text-sm sm:text-base order-2 sm:order-1"
            >
              Annuler
              <IoClose className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleSend}
              disabled={!subject || !message}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base order-1 sm:order-2"
              style={{ backgroundColor: '#FFE552' }}
            >
              Envoyer le message
              <IoArrowForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
