'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Button from '../app/components/Button';
import PlanBadge from '../app/components/PlanBadge';
import FeatureList from '../app/components/FeatureList';

interface PricingPlansProps {
  showSignupButtons?: boolean;
  showDetailsButtons?: boolean;
  contactPath?: string;
  premiumPath?: string;
  premiumButtonText?: string;
}

export default function PricingPlans({ 
  showSignupButtons = true, 
  showDetailsButtons = true,
  contactPath = '/contact',
  premiumPath = '/auth/signup',
  premiumButtonText = 'Je passe en mode illimité'
}: PricingPlansProps) {
  const [isAnnual, setIsAnnual] = useState(true);
  const [numberOfClasses, setNumberOfClasses] = useState(7);

  const freeFeatures = [
    { title: "4 mois d'essai illimités", description: "(matières, classes, retours)" },
    { title: "Puis 5 retours visibles par matière", description: "(les autres sont enregistrés mais masqués)" },
    { title: "Anonymat garanti pour tous les retours" },
    { title: "Relance manuelle possible", description: "(bouton à cliquer)" },
    { title: "Export des retours en CSV à tout moment" },
    { title: "QR code généré automatiquement" },
    { title: "IA avancée", description: "(alertes négatives & alertes positives)" },
    { title: "Page de suivi des alertes", description: "(notifications, commentaires possibles)" },
  ];

  const premiumFeatures = [
    { title: "Nombre de retours illimité" },
    { title: "IA générative pour répondre aux alertes", description: "(un mail prêt à envoyer en un clic)" },
    { title: "Levée d'anonymat activable par l'étudiant", description: "(Bientôt disponible)" },
    { title: "Formulaires personnalisables", description: "(Bientôt disponible)" },
    { title: "Envoi automatique du formulaire", description: "(Bientôt disponible)" },
    { title: "Branding personnalisé (couleurs, logo)", description: "(Au début et à la fin du cours. Bientôt disponible)" },
    { title: "Suppression du logo Izzzi", description: "(Bientôt disponible)" },
  ];

  return (
    <>
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Deux plans. Zéro friction.
          </h1>
          <div className="ml-8">
            <svg width="80" height="80" viewBox="0 0 80 80" className="text-orange-500">
              <path d="M 20 10 Q 60 10, 60 40 Q 60 60, 40 60" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"/>
              <path d="M 45 70 L 30 60 L 40 50" fill="currentColor"/>
            </svg>
          </div>
        </div>
        <p className="text-lg text-gray-600 mb-8">
          Commencez gratuitement et passez au niveau<br />
          supérieur quand vous êtes prêts.
        </p>

        <div className="inline-flex items-center bg-gray-200 rounded-full p-1">
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              isAnnual ? 'bg-black text-white' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Annuel -30%
          </button>
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              !isAnnual ? 'bg-black text-white' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Mensuel
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Free Plan Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-4">
            <PlanBadge planType="izzzi" />
          </div>
          
          <div className="text-5xl font-bold mb-6 text-black">
            0€
            <span className="text-lg font-normal text-black"> / mois</span>
          </div>

          {showSignupButtons && (
            <Button href="/auth/signup" fullWidth icon="↗" className="mb-8">
              Démarrer mes 4 mois gratuits
            </Button>
          )}

          <FeatureList features={freeFeatures} />

          <div className="mt-6 pt-6">
            <p className="text-sm font-bold mb-2 text-black">Au-delà des 4 mois :</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-black mr-3 mt-0.5" />
                <span className="text-sm text-black">Vos classes restent actives</span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-black mr-3 mt-0.5" />
                <span className="text-sm text-black">Les retours visibles sont limités à 5 par matière</span>
              </li>
            </ul>
          </div>

          {showDetailsButtons && (
            <Button href="#" variant="outline" fullWidth icon="↗" className="mt-8">
              Voir les détails du plan
            </Button>
          )}
        </div>

        {/* Premium Plan Card */}
        <div className="rounded-lg shadow-sm p-8 text-black relative overflow-hidden" style={{backgroundColor: '#F69D04'}}>
          <div className="mb-4">
            <span className="inline-block" style={{backgroundColor: '#FFE552', borderRadius: '9999px'}}>
              <PlanBadge planType="super" noBg className="text-black" />
            </span>
          </div>
          
          <p className="text-lg font-medium mb-4 text-black">Estimez le prix de votre abonnement</p>
          
          <div className="mb-6">
            <div className="text-white px-3 py-1 rounded-full text-sm font-medium inline-block mb-4" style={{backgroundColor: '#F26103'}}>
              {numberOfClasses >= 20 ? '+20' : numberOfClasses} classes
            </div>
            <div className="relative mb-4">
              <input
                type="range"
                min="1"
                max="20"
                value={numberOfClasses > 20 ? 20 : numberOfClasses}
                onChange={(e) => setNumberOfClasses(parseInt(e.target.value))}
                className="w-full h-2 bg-orange-600 rounded-full appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #F26103 0%, #F26103 ${((Math.min(numberOfClasses, 20) - 1) / 19) * 100}%, #fff ${((Math.min(numberOfClasses, 20) - 1) / 19) * 100}%, #fff 100%)`
                }}
              />
              <div className="flex justify-between text-xs mt-2 pointer-events-none">
                <span>1</span>
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>+20</span>
              </div>
            </div>
          </div>

          {numberOfClasses < 20 ? (
            <>
              <div className="text-5xl font-bold mb-6">
                {isAnnual ? '17€' : '22€'}
                <span className="text-lg font-normal text-black opacity-80"> par mois / par classe</span>
              </div>
            <Button href={premiumPath} fullWidth icon="↗" className="mb-8">
                {premiumButtonText}
            </Button>
            </>
          ) : (
            <Button href={contactPath} fullWidth icon="↗" className="mb-8">
              Demander une offre sur mesure
            </Button>
          )}

          <div className="mb-6">
            <p className="font-medium mb-2 text-black">Tout ce qu&apos;il y a dans le plan gratuit,</p>
            <p className="opacity-90 text-sm text-black">et en plus :</p>
          </div>

          <FeatureList features={premiumFeatures} className="text-sm" />

          {showDetailsButtons && (
            <Button href="#" variant="outline" fullWidth icon="↗" className="mt-8">
              Voir les détails du plan
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
