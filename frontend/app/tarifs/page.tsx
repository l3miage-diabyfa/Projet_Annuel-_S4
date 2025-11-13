'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button';
import PlanBadge from '../components/PlanBadge';
import FeatureList from '../components/FeatureList';
import ComparisonTable from '../components/ComparisonTable';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [numberOfClasses, setNumberOfClasses] = useState(7);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <header className="bg-white shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
              </div>
              <span className="ml-2 text-xl font-bold">izzzi</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/tarifs" className="text-gray-900 font-semibold pb-1 border-b-2 hover:text-gray-900" style={{borderBottomColor: '#F26103'}}>
                Nos tarifs
              </a>
              <button className="text-black px-4 py-2 rounded font-medium hover:opacity-90 flex items-center" style={{backgroundColor: '#FFE552'}}>
                S&apos;inscrire
                <span className="ml-2">↗</span>
              </button>
              <button className="text-gray-700 hover:text-gray-900 flex items-center">
                Se connecter
                <span className="ml-2">↗</span>
              </button>
            </nav>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-black px-4 py-2 rounded font-medium hover:opacity-90 flex items-center gap-2"
              style={{backgroundColor: '#FFE552'}}
            >
              <span className="font-semibold">MENU</span>
              <div className="flex flex-col gap-1">
                <div className="w-4 h-0.5 bg-black"></div>
                <div className="w-4 h-0.5 bg-black"></div>
                <div className="w-4 h-0.5 bg-black"></div>
              </div>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
            <nav className="flex flex-col p-4 space-y-4">
              <a 
                href="/tarifs" 
                className="text-gray-900 font-semibold py-2 px-4 hover:bg-gray-50 rounded border-b-2"
                style={{borderBottomColor: '#F26103'}}
                onClick={() => setIsMenuOpen(false)}
              >
                Nos tarifs
              </a>
              <button 
                className="text-black px-4 py-3 rounded font-medium hover:opacity-90 flex items-center justify-center"
                style={{backgroundColor: '#FFE552'}}
                onClick={() => setIsMenuOpen(false)}
              >
                S&apos;inscrire
                <span className="ml-2">↗</span>
              </button>
              <button 
                className="text-gray-700 hover:text-gray-900 py-2 px-4 hover:bg-gray-50 rounded flex items-center justify-center border border-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Se connecter
                <span className="ml-2">↗</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

            <Button fullWidth icon="↗" className="mb-8">
              Démarrer mes 4 mois gratuits
            </Button>

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

            <Button variant="outline" fullWidth icon="↗" className="mt-8">
              Voir les détails du plan
            </Button>
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
                <Button fullWidth icon="↗" className="mb-8">
                  Je passe en mode illimité
                </Button>
              </>
            ) : (
              <Button fullWidth icon="↗" className="mb-8">
                Demander une offre sur mesure
              </Button>
            )}

            <div className="mb-6">
              <p className="font-medium mb-2 text-black">Tout ce qu&apos;il y a dans le plan gratuit,</p>
              <p className="opacity-90 text-sm text-black">et en plus :</p>
            </div>

            <FeatureList features={premiumFeatures} className="text-sm" />

            <Button variant="outline" fullWidth icon="↗" className="mt-8">
              Voir les détails du plan
            </Button>
          </div>
        </div>

        <ComparisonTable features={comparisonFeatures} isAnnual={isAnnual} />

        <div className="rounded-lg p-12 text-center text-white mb-16 relative" style={{backgroundColor: '#F26103'}}>
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
            <Button icon="↗">
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

      <footer className="bg-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:hidden flex flex-col items-center text-center space-y-8">
            <div className="flex items-center">
              <div className="bg-white text-orange-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <div className="w-0 h-0 border-l-[8px] border-l-orange-500 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
              </div>
              <span className="text-2xl font-bold">izzzi</span>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Plan du site</h4>
              <div className="space-y-2">
                <p><a href="#" className="hover:text-yellow-300 transition-colors">Nos tarifs</a></p>
                <p><a href="#" className="hover:text-yellow-300 transition-colors">S&apos;inscrire</a></p>
                <p><a href="#" className="hover:text-yellow-300 transition-colors">Se connecter</a></p>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Nous contacter</h4>
              <div className="border-2 border-white rounded-lg px-4 py-3">
                <span className="text-white">hello@izzzi.io</span>
              </div>
            </div>
            
            <div className="flex justify-center space-x-8 text-sm pt-4">
              <a href="#" className="hover:text-yellow-300 transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-yellow-300 transition-colors">FAQ</a>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="grid grid-cols-3 gap-8">
              <div className="flex items-center">
                <div className="bg-white text-orange-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <div className="w-0 h-0 border-l-[8px] border-l-orange-500 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                </div>
                <span className="text-2xl font-bold">izzzi</span>
              </div>
              
              <div>
                <h4 className="font-bold mb-4 text-lg">Plan du site</h4>
                <div className="space-y-2">
                  <p><a href="#" className="hover:text-yellow-300 transition-colors">Nos tarifs</a></p>
                  <p><a href="#" className="hover:text-yellow-300 transition-colors">S&apos;inscrire</a></p>
                  <p><a href="#" className="hover:text-yellow-300 transition-colors">Se connecter</a></p>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-4 text-lg">Nous contacter</h4>
                <div className="border-2 border-white rounded-lg px-4 py-3 mb-6">
                  <span className="text-white">hello@izzzi.io</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-8 mt-8 text-sm">
              <a href="#" className="hover:text-yellow-300 transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-yellow-300 transition-colors">FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}