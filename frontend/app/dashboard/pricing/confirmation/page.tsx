"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IoCheckmarkCircle, IoArrowForward, IoDownloadOutline } from "react-icons/io5";
import { getTokenCookie } from "@/utils/cookie";
import { useUser } from "@/contexts/UserContext";

export default function PricingConfirmationPage() {
  const { setUser } = useUser();
  const [isDownloading, setIsDownloading] = useState(false);

  // Rafraîchir les données utilisateur au montage pour avoir le nouveau statut premium
  useEffect(() => {
    const refreshUserData = async () => {
      try {
        const token = getTokenCookie();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Erreur rafraîchissement données utilisateur:', error);
      }
    };

    refreshUserData();
  }, [setUser]);

  const handleDownloadInvoice = async () => {
    setIsDownloading(true);
    try {
      const token = getTokenCookie();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription/invoice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Impossible de récupérer la facture');
      }

      const data = await response.json();
      
      if (data.invoiceUrl) {
        // Ouvrir la facture Stripe dans un nouvel onglet
        window.open(data.invoiceUrl, '_blank');
      }
    } catch (error) {
      console.error('Erreur téléchargement facture:', error);
      alert('Impossible de télécharger la facture pour le moment');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Paiement confirmé !
          </h1>
          <p className="text-gray-600">
            Vous êtes passé au plan Super Izzzi.<br />
            Merci pour votre confiance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="inline-flex items-center gap-2 text-gray-900 px-4 py-2 rounded-full font-bold mb-6" style={{ backgroundColor: '#FFE552' }}>
              Super Izzzi
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Détail de votre abonnement
            </h2>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Plan
                </div>
                <div className="text-base text-gray-900">
                  Super Izzzi – Paiement annuel
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Moyen de paiement
                </div>
                <div className="text-base text-gray-900">
                  **** **** **** 1234 (Visa)
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Montant payé
                </div>
                <div className="text-base text-gray-900">
                  228€ TTC
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Prochain paiement
                </div>
                <div className="text-base text-gray-900">
                  3 juillet 2026
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Ce que vous pouvez faire maintenant
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <IoCheckmarkCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  Accéder à vos classes et retours en illimités
                </span>
              </div>
              <div className="flex items-start gap-3">
                <IoCheckmarkCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  Télécharger votre facture
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 w-full text-gray-900 font-bold py-4 px-6 rounded-lg transition-all hover:opacity-90"
                style={{ backgroundColor: '#FFE552' }}
              >
                Accéder à mon dashboard
                <IoArrowForward className="w-5 h-5" />
              </Link>

              <button
                onClick={handleDownloadInvoice}
                disabled={isDownloading}
                className="flex items-center justify-center gap-2 w-full bg-white border-2 border-gray-300 text-gray-900 font-medium py-4 px-6 rounded-lg transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IoDownloadOutline className="w-5 h-5" />
                {isDownloading ? 'Chargement...' : 'Télécharger ma facture'}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-600">
          <p>
            <b>Besoin d&apos;aide ?</b> Notre support est à votre disposition à l&apos;adresse{" "}
            <a 
              href="mailto:support@izzzi.app" 
              className="underline font-medium"
            >
              support@izzzi.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
