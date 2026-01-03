"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTokenCookie, removeTokenCookie } from "@/utils/cookie";
import Link from "next/link";
import InputField from "@/components/shared/InputField";
import { FiArrowUpRight, FiBell, FiCheck, FiEdit2, FiDownload, FiCalendar } from "react-icons/fi";
import { useUser } from "@/contexts/UserContext";
import { apiFetch } from "@/utils/api";

// Type for invoices
interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending';
  downloadUrl: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, setUser, logout: logoutUser } = useUser();
  
  // Verify if the user signed up manually or via a provider
  const isManualSignup = !user?.provider || user.provider === 'local';
  
  useEffect(() => {
    const token = getTokenCookie();
    if (!token) {
      router.replace("/auth/signin");
    }
  }, [router]);

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    establishment: "",
    profileImage: null as string | null,
    role: "",
  });

  // Separate state for edit form
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    establishment: "",
  });

  // Hydrate userInfo from Context
  useEffect(() => {
    if (user) {
      const userData = {
        firstName: user.firstname || "",
        lastName: user.lastname || "",
        email: user.email || "",
        establishment: user.establishment || "",
        profileImage: user.profilePic || null,
        role: user.role || "",
      };
      setUserInfo(userData);
      setFormData({
        firstName: user.firstname || "",
        lastName: user.lastname || "",
        email: user.email || "",
        establishment: user.role === "ADMIN" ? user.establishment || "" : "",
      });
    }
  }, [user]);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditingEstablishment, setIsEditingEstablishment] = useState(false);
  
  // State to show/hide invoice list
  const [showInvoices, setShowInvoices] = useState(false);
  
  // Mock invoices
  const [invoices] = useState<Invoice[]>([
    {
      id: "INV-2024-001",
      date: "01/12/2024",
      amount: 29.99,
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: "INV-2024-002",
      date: "01/11/2024",
      amount: 29.99,
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: "INV-2024-003",
      date: "01/10/2024",
      amount: 29.99,
      status: 'paid',
      downloadUrl: '#'
    },
  ]);
  
  // Reference for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getTokenCookie();
    if (!token) {
      alert("Vous devez être connecté pour modifier vos informations");
      return;
    }

    const { data, error } = await apiFetch<{
      message: string;
      user: {
        firstname: string;
        lastname: string;
        email: string;
        role: string;
        establishment?: string;
      };
    }>(
      "/user",
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          ...(userInfo.role === "ADMIN" && formData.establishment ? { establishmentName: formData.establishment } : {}),
        },
      }
    );

    if (data && data.user) {
      // Update Context with new info
      setUser(data.user);
      alert(data.message || "Informations mises à jour avec succès !");
    } else {
      alert(error || "Erreur lors de la mise à jour des informations");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    if (passwordForm.oldPassword === passwordForm.newPassword) {
      alert("Le nouveau mot de passe doit être différent de l'ancien");
      return;
    }

    const token = getTokenCookie();
    if (!token) {
      alert("Vous devez être connecté pour modifier votre mot de passe");
      return;
    }

    const { data, error } = await apiFetch<{ message: string }>(
      "/user/password",
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        },
      }
    );

    if (data) {
      alert(data.message || "Mot de passe modifié avec succès !");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      alert(error || "Erreur lors de la modification du mot de passe");
    }
  };

  const handleLogout = () => {
    removeTokenCookie();
    logoutUser();
    router.replace("/auth/signin");
  };

  const handleDeleteAccount = async () => {
    if (userInfo.role !== "ADMIN") {
      alert("Seul un administrateur peut supprimer son établissement et tous les comptes associés.");
      return;
    }

    if (!confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action supprimera définitivement votre établissement et tous les utilisateurs associés. Cette action est irréversible.")) {
      return;
    }

    const token = getTokenCookie();
    if (!token) {
      alert("Vous devez être connecté pour supprimer votre compte");
      return;
    }

    const { data, error } = await apiFetch<{ message: string }>(
      "/user/account",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data) {
      alert(data.message || "Compte supprimé avec succès");
      // Logout and redirect
      removeTokenCookie();
      logoutUser();
      router.replace("/auth/signin");
    } else {
      alert(error || "Erreur lors de la suppression du compte");
    }
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5 Mo");
      return;
    }

    // Convert to base64 and upload
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      
      // Update local display immediately
      setUserInfo({ ...userInfo, profileImage: base64Image });

      // Send to backend
      const token = getTokenCookie();
      if (!token) {
        alert("Vous devez être connecté pour modifier votre photo de profil");
        return;
      }

      const { data, error } = await apiFetch<{
        message: string;
        user: {
          profilePic: string;
        };
      }>(
        "/user/profile-pic",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            profilePic: base64Image,
          },
        }
      );

      if (data) {
        alert('Photo de profil mise à jour avec succès !');
        // Update user context
        if (user) {
          setUser({ ...user, profilePic: data.user.profilePic });
        }
      } else {
        alert(error || "Erreur lors de la mise à jour de la photo de profil");
        // Revenir à l'image précédente en cas d'erreur
        setUserInfo({ ...userInfo, profileImage: user?.profilePic || null });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    console.log('Téléchargement de la facture:', invoice.id);
    alert(`Téléchargement de la facture ${invoice.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <Link
          href="/dashboard/class"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
        >
          ← Retour
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  {userInfo.profileImage ? (
                    <img
                      src={userInfo.profileImage}
                      alt="Photo de profil"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo.email}`}
                      alt="Photo de profil"
                      className="w-24 h-24 rounded-full object-cover bg-gray-200"
                    />
                  )}
                  {/* Show edit button only for non-Google users */}
                  {user?.provider !== 'google' && (
                    <button
                      onClick={handleProfileImageClick}
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-yellow-400 hover:bg-yellow-500"
                      title="Modifier la photo de profil"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </div>
                <h2 className="text-xl font-bold mb-1">
                  {userInfo.firstName.charAt(0).toUpperCase() + userInfo.firstName.slice(1)}{' '}
                  {userInfo.lastName.charAt(0).toUpperCase() + userInfo.lastName.slice(1)}
                </h2>
                <p className="text-sm text-gray-600 mb-1">{userInfo.email}</p>
                <p className="text-sm text-gray-500">{userInfo.establishment}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                Déconnexion
                <FiArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Billing Management - Uniquement pour les ADMIN */}
            {userInfo.role === "ADMIN" && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-4">Gérer la facturation</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FiCheck className="w-4 h-4 text-green-600" />
                    <span>Gère tes informations de paiement</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FiCheck className="w-4 h-4 text-green-600" />
                    <span>Télécharge tes factures</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FiCheck className="w-4 h-4 text-green-600" />
                    <span>Arrête ton abonnement</span>
                  </div>
                </div>

                {showInvoices && (
                  <div className="border-t pt-4 space-y-3">
                    <h4 className="font-semibold text-sm mb-3">Mes factures</h4>
                    {invoices.length > 0 ? (
                      invoices.map((invoice) => (
                        <div
                          key={invoice.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <FiCalendar className="w-4 h-4 text-gray-500" />
                            <div>
                              <div className="text-sm font-medium">{invoice.id}</div>
                              <div className="text-xs text-gray-500">{invoice.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-semibold">{invoice.amount}€</div>
                            <button
                              onClick={() => handleDownloadInvoice(invoice)}
                              className="p-2 hover:bg-yellow-400 rounded-lg transition-colors"
                              title="Télécharger la facture"
                            >
                              <FiDownload className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">Aucune facture disponible</p>
                    )}
                  </div>
                )}

                <Link
                  href="/dashboard/pricing"
                  className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-colors border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
                >
                  Accéder au tableau de bord
                  <FiArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-2">
            {/* Grid for Personal Info and Password/Delete Side by Side */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information Form */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-4">Modifier mes informations personnelles</h3>
                <form onSubmit={handleUpdateInfo} className="space-y-4">
                  <InputField
                    label="Prénom"
                    name="firstName"
                    type="text"
                    placeholder="Entrez votre prénom"
                    value={formData.firstName}
                    onChange={handleUserInfoChange}
                  />
                  <InputField
                    label="Nom"
                    name="lastName"
                    type="text"
                    placeholder="Entrez votre nom"
                    value={formData.lastName}
                    onChange={handleUserInfoChange}
                  />

                  <div>
                    <InputField
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="Entrez votre email"
                      value={formData.email}
                      onChange={handleUserInfoChange}
                      disabled={!isManualSignup}
                    />
                    {!isManualSignup && (
                      <p className="text-xs text-gray-500 mt-1">
                        Email géré par Google
                      </p>
                    )}
                  </div>

                  {userInfo.role === "ADMIN" && (
                    <InputField
                      label="Établissement"
                      name="establishment"
                      type="text"
                      placeholder="Entrez votre établissement"
                      value={formData.establishment}
                      onChange={handleUserInfoChange}
                    />
                  )}

                  <button
                    type="submit"
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
                  >
                    Modifier
                    <FiArrowUpRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Right Column: Password + Delete Account */}
              <div className="space-y-6">
                {/* Password Change Form - Affiché uniquement pour inscription manuelle */}
                {isManualSignup && (
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold mb-4">Modifier mon mot de passe</h3>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <InputField
                        label="Ancien mot de passe"
                        name="oldPassword"
                        type="password"
                        placeholder="Entrez votre ancien mot de passe"
                        value={passwordForm.oldPassword}
                        onChange={handlePasswordChange}
                        required
                      />

                      <InputField
                        label="Nouveau"
                        name="newPassword"
                        type="password"
                        placeholder="Entrez votre nouveau mot de passe"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                      />

                      <InputField
                        label="Confirmez votre nouveau mot de passe"
                        name="confirmPassword"
                        type="password"
                        placeholder="Entrez votre nouveau mot de passe"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />

                      <button
                        type="submit"
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
                      >
                        Modifier
                        <FiArrowUpRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}

                {!isManualSignup && (
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold mb-4">Modifier mon mot de passe</h3>
                    <p className="text-gray-600 text-sm">
                      La modification du mot de passe n'est pas disponible pour les comptes Google.
                    </p>
                  </div>
                )}

                {/* Delete Account for Admin only */}
                {userInfo.role === "ADMIN" && (
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200">
                    <h3 className="text-lg font-bold mb-4">Supprimer mon compte et toutes mes données</h3>
                    <button
                      onClick={handleDeleteAccount}
                      className="text-gray-700 hover:text-red-600 transition-colors inline-flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-red-50"
                    >
                      Je supprime mon compte
                      <FiArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
