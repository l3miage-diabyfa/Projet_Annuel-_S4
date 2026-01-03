'use client';

import { useState } from 'react';
import Button from '../components/Button';
import ComparisonTable from '../components/ComparisonTable';
import Header from '../../components/home/Header';
import Footer from '../../components/home/Footer';
import PricingPlans from '../../components/PricingPlans';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const comparisonFeatures = [
    { name: "Nombre de classes actives", free: "Illimité", premium: "Illimité" },
    { name: "Matières par classe", free: "Illimité", premium: "Illimité" },
    { name: "Retours visibles par matière", free: "5 par matière (après 4 mois)", premium: "Illimité" },
    { name: "Retours au-delà", free: "Enregistrés, masqués", premium: "Visibles" },
    { name: "Anonymat des retours", free: "Oui (obligatoire)", premium: "Oui + levée possible (bientôt disponible)" },
    { name: "Envoi automatique du formulaire", free: "Non", premium: "Oui (début + fin) (bientôt disponible)" },
    { name: "Relance manuelle (bouton)", free: "Oui", premium: "Oui" },
    { name: "Export CSV", free: "Oui", premium: "Oui" },
    { name: "QR code & lien d'accès", free: "Oui", premium: "Oui" },
    { name: "IA - alertes négatives", free: "Oui", premium: "Oui" },
    { name: "IA - alertes positives", free: "Oui", premium: "Oui" },
    { name: "Traite des alertes", free: "Oui (commentaire possible)", premium: "Oui + réponse auto par IA" },
    { name: "Branding personnalisé", free: "Non", premium: "Oui (bientôt disponible)" },
    { name: "Suppression du logo izzzi", free: "Non", premium: "Oui (bientôt disponible)" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-24">
        <PricingPlans showSignupButtons={true} showDetailsButtons={true} />
        <ComparisonTable features={comparisonFeatures} isAnnual={isAnnual} />

        <div className="rounded-lg p-12 text-center text-white mb-16 relative bg-primary-orange">
          <div className="flex items-center justify-center mb-4">
            <h2 className="text-3xl font-bold mr-4">Une question ?</h2>
            <svg width="80" height="80" viewBox="0 0 80 80" className="text-yellow-500">
              <path d="M 20 10 Q 60 10, 60 40 Q 60 60, 40 60" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M 45 70 L 30 60 L 40 50" fill="currentColor" />
            </svg>
          </div>
          <p className="text-lg mb-8">
            Écrivez-nous, on vous aide à trouver<br />
            le plan adapté à vos besoins.
          </p>
          
          <div className="flex justify-center items-center space-x-4">
            <svg width="60" height="100" viewBox="0 0 60 100" className="text-yellow-400">
              <path d="M 30 90 Q 10 70, 30 50 Q 50 30, 30 10" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"/>
              <path d="M 25 15 L 30 10 L 35 15" fill="currentColor"/>
            </svg>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-orange-500 transition-colors">
              hello@izzzi.io
            </button>
            <Button href="/contact" icon="↗">
              Nous contacter
            </Button>
          </div>
        </div>

        <div className="relative mb-16 h-64 md:h-32 overflow-hidden">
          <span className="absolute top-2 left-4 md:left-12 md:top-0 transform -rotate-12 bg-yellow-300 text-black px-6 py-3 rounded-full text-sm font-medium">#Love</span>
          <span className="absolute top-20 left-12 md:left-1/4 md:top-8 transform rotate-6 bg-white text-black px-6 py-3 rounded-full text-sm font-medium border border-gray-300">IA + education = &lt;3</span>
          <span className="absolute top-40 left-2 md:left-1/2 md:top-2 transform -rotate-6 bg-orange-400 text-white px-6 py-3 rounded-full text-sm font-medium">#QuatiopFriendly</span>
          <span className="absolute top-56 left-16 md:right-1/4 md:left-auto md:top-12 transform rotate-12 text-black px-6 py-3 rounded-full text-sm font-medium" style={{backgroundColor: '#FFE552'}}>#Simple</span>
          <span className="absolute top-0 right-2 md:right-32 md:top-0 transform -rotate-3 bg-white text-black px-6 py-3 rounded-full text-sm font-medium border border-gray-300">#DoubleSatisfaction</span>
          <span className="absolute top-20 right-8 md:right-48 md:top-16 transform rotate-8 bg-orange-400 text-white px-6 py-3 rounded-full text-sm font-medium">#LiveReview</span>
          <span className="absolute top-40 right-2 md:right-12 md:top-4 transform rotate-15 text-black px-6 py-3 rounded-full text-sm font-medium" style={{backgroundColor: '#FFE552'}}>#Sincere</span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
