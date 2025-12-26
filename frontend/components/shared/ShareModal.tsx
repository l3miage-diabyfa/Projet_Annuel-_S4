"use client";

import React, { useState } from "react";
import { IoClose, IoCopy, IoArrowForward, IoTrashOutline } from "react-icons/io5";

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  initials: string;
  color: string;
  isPending?: boolean;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareLink?: string;
  collaborators?: Collaborator[];
  onInvite?: (email: string, role: "admin" | "editor") => void;
  onChangeRole?: (collaboratorId: string, newRole: "admin" | "editor") => void;
  onRemoveAccess?: (collaboratorId: string) => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  shareLink = "https://izzzi.app/share/abc123",
  collaborators = [],
  onInvite,
  onChangeRole,
  onRemoveAccess,
}: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<"admin" | "editor">("editor");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  const handleInvite = () => {
    if (email && onInvite) {
      onInvite(email, selectedRole);
      setEmail("");
      setSelectedRole("editor");
    }
  };

  const handleRoleChange = (collaboratorId: string, newRole: string) => {
    if (newRole === "remove" && onRemoveAccess) {
      onRemoveAccess(collaboratorId);
    } else if ((newRole === "admin" || newRole === "editor") && onChangeRole) {
      onChangeRole(collaboratorId, newRole);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Inviter des collaborateurs
            </h2>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors text-sm sm:text-base"
              >
                <span className="text-gray-900 font-medium whitespace-nowrap">
                  {copied ? "Lien copié !" : "Copier le lien"}
                </span>
                <IoCopy className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Fermer"
              >
                <IoClose className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-8">

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Inviter par email..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as "admin" | "editor")}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white min-w-[140px]"
                aria-label="Sélectionner un rôle"
              >
                <option value="">Rôle</option>
                <option value="editor">Éditeur</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              onClick={handleInvite}
              disabled={!email || !selectedRole}
              className="flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#FFE552' }}
            >
              Inviter
              <IoArrowForward className="w-5 h-5" />
            </button>
          </div>

          <div className="border-t border-gray-200 my-8"></div>

          {collaborators.length > 0 && (
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                Personnes disposant de l&apos;accès
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 py-2 sm:py-3"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0 ${
                          collaborator.isPending ? "opacity-40" : ""
                        }`}
                        style={{ backgroundColor: collaborator.color }}
                      >
                        {collaborator.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={`font-semibold text-sm sm:text-base truncate ${
                          collaborator.isPending ? "text-gray-400" : "text-gray-900"
                        }`}>
                          {collaborator.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 truncate">
                          {collaborator.email}
                        </div>
                      </div>
                    </div>

                    <select
                      value={collaborator.role}
                      onChange={(e) => handleRoleChange(collaborator.id, e.target.value)}
                      className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white w-full sm:w-auto sm:min-w-[160px] text-sm sm:text-base"
                      aria-label={`Modifier le rôle de ${collaborator.name}`}
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Éditeur</option>
                      <option value="remove" className="text-red-600">
                        Supprimer l&apos;accès
                      </option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
