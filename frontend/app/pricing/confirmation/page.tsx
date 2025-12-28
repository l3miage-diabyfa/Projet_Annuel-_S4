"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IoNotificationsOutline, IoCheckmarkCircle, IoArrowForward, IoDownloadOutline } from "react-icons/io5";

export default function PricingConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="max-w-[98vw] fixed top-4 left-0 right-0 mx-auto bg-white rounded-xl shadow-sm px-8 py-4 z-50">
        <div className="mx-auto flex items-center justify-between">
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

          <div className="flex flex-col items-center p-2 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex gap-2">
              <Link
                href="/dashboard/class"
                className="flex-1 py-3 px-5 whitespace-nowrap rounded-sm font-medium text-center transition-colors bg-gray-900 text-white"
              >
                Mes classes
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 py-3 px-5 whitespace-nowrap rounded-sm font-medium text-center transition-colors bg-transparent text-gray-900 hover:bg-gray-100"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              className="p-2 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <IoNotificationsOutline className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
                alt="Yoann Caoulan"
                className="w-10 h-10 rounded-full bg-gray-400"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  Yoann Caoulan
                </span>
                <span 
                  className="text-xs font-bold text-white px-2 py-0.5 rounded inline-block"
                  style={{ backgroundColor: '#F26103' }}
                >
                  Super Izzzi
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

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
                className="flex items-center justify-center gap-2 w-full bg-white border-2 border-gray-300 text-gray-900 font-medium py-4 px-6 rounded-lg transition-all hover:bg-gray-50"
              >
                <IoDownloadOutline className="w-5 h-5" />
                Télécharger ma facture
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
