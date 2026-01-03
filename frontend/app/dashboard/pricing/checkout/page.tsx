"use client";

import { useState } from "react";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { FaLock } from "react-icons/fa";

export default function PricingCheckoutPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const monthlyPrice = 22;
  const yearlyPricePerMonth = 17;
  const yearlyTotalPrice = yearlyPricePerMonth * 12;
  const currentPrice = billingPeriod === "monthly" ? monthlyPrice : yearlyPricePerMonth;

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto">
        <Link
          href="/dashboard/class"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <IoArrowBack className="w-5 h-5" />
          <span>Retour</span>
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Confirmez votre abonnement
          </h1>
          <p className="text-gray-600">
            Vérifiez les détails de votre commande avant de procéder au paiement
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="inline-flex items-center gap-2 text-gray-900 px-4 py-2 rounded-full font-bold mb-6" style={{ backgroundColor: '#FFE552' }}>
              Super Izzzi
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Passez au plan Super Izzzi
            </h2>
            <p className="text-gray-600 mb-6">
              Changez de plan pour débloquer les retours illimités
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de facturation
              </label>
              <input
                type="email"
                placeholder="yoann.caoulan@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="mb-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informations de carte
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de carte
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d&apos;expiration
                  </label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Adresse de facturation
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  placeholder="123, rue de la Paix"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complément d&apos;adresse
                </label>
                <input
                  type="text"
                  placeholder="Étage, bâtiment..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    placeholder="Paris"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    placeholder="75001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Pays
                </label>
                <select 
                  id="country"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                >
                  <option>France</option>
                  <option>Belgique</option>
                  <option>Suisse</option>
                  <option>Canada</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de TVA
                </label>
                <input
                  type="text"
                  placeholder="FR12345678901"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SIRET
                </label>
                <input
                  type="text"
                  placeholder="123 456 789 00012"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="mb-6 space-y-3">
                <label
                  className={`flex items-center gap-4 p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    billingPeriod === "monthly"
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="billingPeriod"
                    value="monthly"
                    checked={billingPeriod === "monthly"}
                    onChange={() => setBillingPeriod("monthly")}
                    className="w-6 h-6 text-orange-500 border-gray-300 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-lg text-gray-900 mb-1">
                      Payez mensuellement
                    </div>
                    <div className="text-gray-600">
                      {monthlyPrice}€ par mois/classe
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 p-6 rounded-xl border-2 cursor-pointer transition-all relative ${
                    billingPeriod === "yearly"
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="billingPeriod"
                    value="yearly"
                    checked={billingPeriod === "yearly"}
                    onChange={() => setBillingPeriod("yearly")}
                    className="w-6 h-6 text-orange-500 border-gray-300 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-lg text-gray-900 mb-1">
                      Payez annuellement
                    </div>
                    <div className="text-gray-600">
                      {yearlyPricePerMonth}€ par mois/classe
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -30%
                  </div>
                </label>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span>
                    {billingPeriod === "monthly" 
                      ? `${monthlyPrice}€/mois TTC` 
                      : `${yearlyTotalPrice}€/an TTC`}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-600">
                    J&apos;accepte les{" "}
                    <Link href="/cgv" className="text-orange-500 underline">
                      Conditions Générales de Vente (CGV)
                    </Link>
                  </span>
                </label>
              </div>

              <button
                disabled={!acceptedTerms}
                className="w-full disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-bold py-4 px-6 rounded-lg transition-colors mb-4 hover:opacity-90"
                style={{ backgroundColor: acceptedTerms ? '#FFE552' : undefined }}
              >
                {billingPeriod === "monthly" ? (
                  <>
                    Valider et payer {monthlyPrice}€/mois{" "}
                  </>
                ) : (
                  <>
                    Valider et payer {yearlyTotalPrice}€/an{" "}
                    <span className="text-sm font-normal">(ou {yearlyPricePerMonth}€/mois)</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <FaLock className="w-4 h-4" />
                <span>Paiement sécurisé via Stripe</span>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                En souscrivant ce plan, vous renoncez expressément à votre droit
                de rétractation conformément à l'article L221-28 du Code de la
                consommation.
              </p>

              <p className="text-xs text-gray-500 mt-2 text-center">
                L&apos;abonnement sera renouvelé automatiquement chaque année/mois,
                sauf résiliation avant la date de renouvellement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
