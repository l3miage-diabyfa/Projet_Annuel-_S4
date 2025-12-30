"use client";

import ShareModal from "@/components/shared/ShareModal";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import React from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { getUserFromToken } from "@/lib/api";
import { apiFetch } from "@/utils/api";
import { getTokenCookie } from "@/utils/cookie";
import type { EstablishmentUser, Role } from "@/types/user";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [collaborators, setCollaborators] = useState<EstablishmentUser[]>([]);
  const [shareLink, setShareLink] = useState("");
  const [currentUser, setCurrentUser] = useState<{ role: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get current user from token
    const user = getUserFromToken();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    // Load collaborators when modal opens
    if (isShareModalOpen) {
      loadCollaborators();
    }
  }, [isShareModalOpen]);

  const loadCollaborators = async () => {
    try {
      setLoading(true);
      const token = getTokenCookie();
      const { data, error } = await apiFetch<EstablishmentUser[]>('/user/by-establishment', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (error || !data) {
        console.error('Erreur lors du chargement des collaborateurs:', error);
        return;
      }
      
      // Add isPending flag to users
      const usersWithPending = data.map((user) => ({
        ...user,
        isPending: !user.firstname || !user.lastname,
      }));
      
      setCollaborators(usersWithPending);
    } catch (error) {
      console.error('Erreur lors du chargement des collaborateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (email: string, role: Role) => {
    try {
      setLoading(true);
      const token = getTokenCookie();
      
      const { data, error } = await apiFetch('/user/invite', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { email, role },
      });

      if (error || !data) {
        throw new Error(error || 'Erreur lors de l\'invitation');
      }
      
      // Reload collaborators list
      await loadCollaborators();
      
      alert(`Invitation envoyée à ${email}`);
    } catch (error: any) {
      console.error('Erreur lors de l\'invitation:', error);
      alert(error.message || 'Erreur lors de l\'invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (collaboratorId: string, newRole: Role) => {
    try {
      setLoading(true);
      const token = getTokenCookie();
      
      const { data, error } = await apiFetch(`/user/update-role/${collaboratorId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { role: newRole },
      });

      if (error || !data) {
        throw new Error(error || 'Erreur lors de la modification du rôle');
      }
      
      // Update locally
      setCollaborators((prev) =>
        prev.map((c) => (c.id === collaboratorId ? { ...c, role: newRole } : c))
      );
      
      alert('Rôle modifié avec succès');
    } catch (error: any) {
      console.error('Erreur lors de la modification du rôle:', error);
      alert(error.message || 'Erreur lors de la modification du rôle');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAccess = async (collaboratorId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer l\'accès de cet utilisateur ?')) {
      return;
    }

    try {
      setLoading(true);
      const token = getTokenCookie();
      
      const { data, error } = await apiFetch(`/user/remove-access/${collaboratorId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (error || !data) {
        throw new Error(error || 'Erreur lors de la suppression');
      }
      
      // Update locally
      setCollaborators((prev) => prev.filter((c) => c.id !== collaboratorId));
      
      alert('Utilisateur supprimé avec succès');
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      alert(error.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateShareLink = async () => {
    try {
      setLoading(true);
      const token = getTokenCookie();
      
      const { data, error } = await apiFetch<{ shareToken: string; expiresAt: string }>('/user/generate-share-link', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (error || !data) {
        throw new Error(error || 'Erreur lors de la génération du lien');
      }

      // Build URL on client side
      const baseUrl = window.location.origin;
      const invitationLink = `${baseUrl}/auth/signup?invitation=${data.shareToken}`;
      setShareLink(invitationLink);
    } catch (error: any) {
      console.error('Erreur lors de la génération du lien:', error);
      alert(error.message || 'Erreur lors de la génération du lien');
    } finally {
      setLoading(false);
    }
  };

  // Open modal and generate link
  const handleOpenShareModal = () => {
    setIsShareModalOpen(true);
    handleGenerateShareLink();
  };

  // Only show share button if user is ADMIN
  const showShareButton = currentUser?.role === 'ADMIN';
  
  return (
    <nav className="max-w-[98vw] fixed top-4 left-0 right-0 mx-auto bg-white rounded-xl shadow-sm px-8 py-4 z-50">
      <div className=" mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <div className="w-auto h-full rounded-full flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={112}
                height={112}
                className="w-16 sm:w-20"
              />
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center p-2 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex gap-2">
            <Link
              href="/dashboard/class"
              className={`flex-1 py-3 px-5 whitespace-nowrap rounded-sm font-medium text-center transition-colors ${
                pathname.startsWith('/dashboard/class') 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-transparent text-gray-900 hover:bg-gray-100'
              }`}
            >
              Mes classes
            </Link>
            <Link
              href="/dashboard"
              className={`flex-1 py-3 px-5 whitespace-nowrap rounded-sm font-medium text-center transition-colors ${
                pathname === '/dashboard' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-transparent text-gray-900 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <button className="p-2 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors">
            <IoNotificationsOutline className="w-6 h-6 text-gray-700" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
              alt="Yoann Caoulan"
              className="w-10 h-10 rounded-full bg-gray-400 grid"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                Yoann Caoulan
              </span>
              <span className="text-xs font-bold">Plan gratuit</span>
            </div>
          </div>
          
          {/* Share Button - ADMIN only */}
          {showShareButton && (
            <button
              onClick={handleOpenShareModal}
              className="inline-block bg-primary-yellow hover:bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl transition"
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Partager'}
            </button>
          )}
        </div>
      </div>
      
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareLink={shareLink}
        collaborators={collaborators}
        onInvite={handleInvite}
        onChangeRole={handleChangeRole}
        onRemoveAccess={handleRemoveAccess}
      />
    </nav>
  );
}
