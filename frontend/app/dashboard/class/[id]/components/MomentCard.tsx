"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiClock,
  FiCheck,
  FiArrowUpRight,
  FiDownload,
  FiRefreshCw,
  FiCopy,
  FiCheckCircle,
  FiSend,
} from "react-icons/fi";
import { sendReminderEmails, sendReviewInvitations } from "@/lib/api";

interface MomentCardProps {
  moment: {
    type: "during" | "end";
    label: string;
    formId: string;
    publicLink: string;
    feedbackCount: number;
    totalStudents: number;
    sentAt?: string | null;
  };
  classId: string;
  subjectId: string;
}

export default function MomentCard({ moment, classId, subjectId }: MomentCardProps) {
  const [copying, setCopying] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendingInitial, setSendingInitial] = useState(false);

  const publicUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3001'}/review/${moment.publicLink}`;
  
  const formType = moment.type === "during" ? "DURING_CLASS" : "AFTER_CLASS";
  const hasBeenSent = !!moment.sentAt;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      alert('Erreur lors de la copie');
    }
  }

  async function handleDownloadQR() {
    // Generate QR code (you can use a library like qrcode)
    // For now, just alert
    alert(`QR Code pour: ${publicUrl}\n\nUtilisez une bibliothèque comme 'qrcode' pour générer le QR code`);
  }

  async function handleSendReminder() {
    if (!confirm('Envoyer un rappel à tous les étudiants ?')) return;

    setSending(true);
    try {
      const result = await sendReminderEmails(moment.formId, classId);
      alert(`✅ Rappel envoyé à ${result.sent} étudiant(s)`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de l\'envoi');
    } finally {
      setSending(false);
    }
  }

  async function handleSendInvitations() {
    console.log('📧 Envoi invitations:', { momentType: moment.type, momentLabel: moment.label, formType });
    
    if (!confirm(`Envoyer les invitations "${moment.label}" à tous les étudiants ?`)) return;

    setSendingInitial(true);
    try {
      const result = await sendReviewInvitations(subjectId, formType);
      alert(`✅ Invitations envoyées à ${result.sent} étudiant(s)`);
      window.location.reload(); // Refresh to update sentAt status
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de l\'envoi');
    } finally {
      setSendingInitial(false);
    }
  }

  return (
    <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100 grid grid-cols-12 gap-4 items-center">
      {/* Label */}
      <div className="col-span-3 flex items-center gap-3">
        {moment.type === "during" ? (
          <FiClock className="w-4 h-4 text-gray-500 shrink-0" />
        ) : (
          <FiCheck className="w-4 h-4 text-gray-500 shrink-0" />
        )}
        <span className="text-xs font-bold text-gray-900">{moment.label}</span>
      </div>

      {/* Actions */}
      <div className="col-span-4 flex items-center gap-3 justify-center">
        <button 
          onClick={handleCopyLink}
          className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-2 rounded-md transition-colors whitespace-nowrap"
        >
          {copying ? (
            <>
              Copié! <FiCheckCircle className="w-3 h-3 text-green-600" />
            </>
          ) : (
            <>
              Copier le lien <FiCopy className="w-3 h-3" />
            </>
          )}
        </button>
        <button 
          onClick={handleDownloadQR}
          className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-900 border-b border-gray-400 hover:border-gray-900 pb-0.5 transition-colors whitespace-nowrap"
        >
          Télécharger le QR code <FiDownload className="w-3 h-3" />
        </button>
      </div>

      {/* Reminder */}
      <div className="col-span-2 flex justify-center">
        {!hasBeenSent ? (
          <button 
            onClick={handleSendInvitations}
            disabled={sendingInitial}
            className="flex items-center gap-2 text-xs font-medium text-white bg-primary-orange hover:bg-orange-600 px-4 py-2 rounded-md transition-colors whitespace-nowrap disabled:opacity-50"
          >
            {sendingInitial ? 'Envoi...' : 'Envoyer maintenant'}
            <FiSend className="w-3 h-3" />
          </button>
        ) : (
          <button 
            onClick={handleSendReminder}
            disabled={sending}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors underline decoration-gray-300 whitespace-nowrap disabled:opacity-50"
          >
            {sending ? 'Envoi...' : 'Relancer les étudiants'}
            <FiRefreshCw className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Results */}
      <div className="col-span-3 text-right">
        <Link 
          href={`/dashboard/reviews/${moment.formId}`}
          className="flex flex-col items-end group"
        >
          <span className="text-xs font-bold text-gray-900 group-hover:underline whitespace-nowrap">
            Voir les retours ({moment.feedbackCount}/{moment.totalStudents})
          </span>
          <span className="text-[10px] text-gray-500">
            (Tous les retours sont anonymes sur le plan gratuit)
          </span>
        </Link>
      </div>
    </div>
  );
}