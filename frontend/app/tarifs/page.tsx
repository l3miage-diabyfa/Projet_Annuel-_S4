'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faThumbsUp, faHands } from '@fortawesome/free-solid-svg-icons';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [numberOfClasses, setNumberOfClasses] = useState(7);

  const features = [
    { name: "Nombre de créneaux délivrés", free: "Illimité", premium: "Illimité" },
    { name: "Durée par créneaux", free: "15min", premium: "Jusqu'à 8h" },
    { name: "Réponse validée par l'urtlice", free: "1 par créneaux (jusqu'à 3 max)", premium: "Illimité" },
    { name: "Réponse validée", free: "Complètement managée", premium: "Validation" },
    { name: "Avancement des réiniques", free: "Oui (obligatoire)", premium: "Oui + levée possible (faculté disponible)" },
    { name: "Envoi automatique de formulaires", free: "Non", premium: "Oui (pleinset + WS) (Service disponible)" },
    { name: "Réticence immédiate (faculté)", free: "Oui", premium: "Oui" },
    { name: "Export CSV", free: "Oui", premium: "Oui" },
    { name: "QR code Élu et invité", free: "Oui", premium: "Oui" },
    { name: "IA - réponses réglistes", free: "Oui", premium: "Oui" },
    { name: "IA - réponses pacifiques", free: "Oui", premium: "Oui" },
    { name: "Traité des données", free: "Oui (Economie non possible)", premium: "Oui + légendes up en garde" },
    { name: "Branding personnalité", free: "Non", premium: "Oui (faculté disponible)" },
    { name: "Suppression du logo Izzzi", free: "Non", premium: "Oui (faculté disponible)" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
              </div>
              <span className="ml-2 text-xl font-bold">izzzi</span>
            </div>
            <nav className="flex items-center space-x-8">
              <a href="/tarifs" className="text-gray-700 hover:text-gray-900">Nos tarifs</a>
              <button className="text-black px-4 py-2 rounded font-medium hover:opacity-90 flex items-center" style={{backgroundColor: '#FFE552'}}>
                S&apos;inscrire
                <span className="ml-2">↗</span>
              </button>
              <button className="text-gray-700 hover:text-gray-900 flex items-center">
                Se connecter
                <span className="ml-2">↗</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Deux plans. Zéro friction.
            </h1>
            <div className="ml-8">
              <svg width="60" height="40" viewBox="0 0 60 40" className="text-orange-500">
                <path d="M10 20 Q 30 5, 50 20" stroke="currentColor" strokeWidth="3" fill="none"/>
                <path d="M45 15 L 50 20 L 45 25" stroke="currentColor" strokeWidth="3" fill="none"/>
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
                isAnnual
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Annuel -30%
            </button>
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                !isAnnual
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Mensuel
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-4">
              <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium flex items-center w-fit">
                <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
                Izzzi
              </span>
            </div>
            <div className="text-5xl font-bold mb-6 text-black">
              0€
              <span className="text-lg font-normal text-black"> / mois</span>
            </div>
            <button className="w-full text-black py-3 px-6 rounded-lg font-medium mb-8 flex items-center justify-center hover:opacity-90" style={{backgroundColor: '#FFE552'}}>
              Démarrer mes 4 mois gratuits
              <span className="ml-2">↗</span>
            </button>

            <ul className="space-y-3">
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-black mr-3 mt-0.5" />
                <div className="text-sm text-black">
                  <span className="font-medium">4 mois d&apos;essai illimités</span>
                  <br />
                  <span className="text-black opacity-80">(matières, classes, retours)</span>
                </div>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-black mr-3 mt-0.5" />
                <div className="text-sm text-black">
                  <span className="font-medium">Puis 5 retours visibles par matière</span>
                  <br />
                  <span className="text-black opacity-80">(les autres sont enregistrés mais masqués)</span>
                </div>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-black mr-3 mt-0.5" />
                <span className="text-sm font-medium text-black">Anonymat garanti pour tous les retours</span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-black mr-3 mt-0.5" />
                <div className="text-sm text-black">
                  <span className="font-medium">Relance manuelle possible</span>
                  <br />
                  <span className="text-black opacity-80">(bouton à cliquer)</span>
                </div>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-black mr-3 mt-0.5" />
                <span className="text-sm font-medium text-black">Export des retours en CSV à tout moment</span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-black mr-3 mt-0.5" />
                <span className="text-sm font-medium text-black">QR code généré automatiquement</span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-black mr-3 mt-0.5" />
                <div className="text-sm text-black">
                  <span className="font-medium">IA avancée</span>
                  <br />
                  <span className="text-black opacity-80">(alertes négatives & alertes positives)</span>
                </div>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-black mr-3 mt-0.5" />
                <div className="text-sm text-black">
                  <span className="font-medium">Page de suivi des alertes</span>
                  <br />
                  <span className="text-black opacity-80">(notifications, commentaires possibles)</span>
                </div>
              </li>
            </ul>

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

            <button className="w-full border border-black text-black py-3 px-6 rounded-lg font-medium hover:bg-black hover:text-white transition-colors mt-8 flex items-center justify-center">
              Voir les détails du plan
              <span className="ml-2">↗</span>
            </button>
          </div>

          <div className="rounded-lg shadow-sm p-8 text-black relative overflow-hidden" style={{backgroundColor: '#F69D04'}}>
            <div className="mb-4">
              <span className="text-black px-4 py-2 rounded-full text-sm font-medium flex items-center w-fit" style={{backgroundColor: '#FFE552'}}>
                <FontAwesomeIcon icon={faHands} className="mr-2" />
                Super Izzzi
              </span>
            </div>
            
            <p className="text-lg font-medium mb-4 text-black">Estimez le prix de votre abonnement</p>
            
            <div className="mb-6">
              <div className="text-white px-3 py-1 rounded-full text-sm font-medium inline-block mb-4" style={{backgroundColor: '#F26103'}}>
                {numberOfClasses} classes
              </div>
              <div className="relative mb-4">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={numberOfClasses}
                  onChange={(e) => setNumberOfClasses(parseInt(e.target.value))}
                  className="w-full h-2 bg-orange-600 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #F26103 0%, #F26103 ${((numberOfClasses - 1) / 19) * 100}%, #fff ${((numberOfClasses - 1) / 19) * 100}%, #fff 100%)`
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

            <div className="text-5xl font-bold mb-6">
              {isAnnual ? '17€' : '22€'}
              <span className="text-lg font-normal text-black opacity-80"> par mois / par classe</span>
            </div>

            <button className="w-full text-black py-3 px-6 rounded-lg font-medium mb-8 flex items-center justify-center hover:opacity-90" style={{backgroundColor: '#FFE552'}}>
              Je passe en mode illimité
              <span className="ml-2">↗</span>
            </button>

            <div className="mb-6">
              <p className="font-medium mb-2 text-black">Tout ce qu&apos;il y a dans le plan gratuit,</p>
              <p className="opacity-90 text-sm text-black">et en plus :</p>
            </div>

            <ul className="space-y-3 text-sm text-black">
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-black mr-3 mt-0.5" />
                <span>Nombre de retours illimité</span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-black mr-3 mt-0.5" />
                <div>
                  <span>IA générative pour répondre aux alertes</span>
                  <br />
                  <span className="text-xs text-black opacity-80">(un mail prêt à envoyer en un clic)</span>
                </div>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-black mr-3 mt-0.5" />
                <div>
                  <span>Levée d&apos;anonymat activable par l&apos;étudiant</span>
                  <br />
                  <span className="text-xs text-black opacity-80">(Bientôt disponible)</span>
                </div>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-black mr-3 mt-0.5" />
                <div>
                  <span>Formulaires personnalisables</span>
                  <br />
                  <span className="text-xs text-black opacity-80">(Bientôt disponible)</span>
                </div>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-black mr-3 mt-0.5" />
                <div>
                  <span>Envoi automatique du formulaire</span>
                  <br />
                  <span className="text-xs text-black opacity-80">(Bientôt disponible)</span>
                </div>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-black mr-3 mt-0.5" />
                <div>
                  <span>Branding personnalisé (couleurs, logo)</span>
                  <br />
                  <span className="text-xs text-black opacity-80">(Au début et à la fin du cours. Bientôt disponible)</span>
                </div>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-black mr-3 mt-0.5" />
                <div>
                  <span>Suppression du logo Izzzi</span>
                  <br />
                  <span className="text-xs text-black opacity-80">(Bientôt disponible)</span>
                </div>
              </li>
            </ul>

            <button className="w-full border border-black text-black py-3 px-6 rounded-lg font-medium hover:bg-black hover:text-white transition-colors mt-8 flex items-center justify-center">
              Voir les détails du plan
              <span className="ml-2">↗</span>
            </button>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Comparez nos plans</h2>
          
          <div className="bg-white rounded-lg overflow-hidden border border-gray-300">
            <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b border-gray-200">
              <div></div>
              <div className="text-center">
                <div className="mb-3">
                  <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center w-fit mx-auto">
                    <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
                    Izzzi
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">0€ <span className="text-xs">par mois</span></p>
                <p className="text-xs text-gray-500 mb-3">(4 mois d'essai illimités)</p>
                <button className="text-black px-4 py-2 rounded text-sm font-medium hover:opacity-90" style={{backgroundColor: '#FFE552'}}>
                  Démarrer l'essai gratuit
                  <span className="ml-1">↗</span>
                </button>
              </div>
              <div className="text-center">
                <div className="mb-3">
                  <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center w-fit mx-auto">
                    <FontAwesomeIcon icon={faHands} className="mr-2" />
                    Super Izzzi
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">À partir de</p>
                <p className="text-sm text-gray-600 mb-3">{isAnnual ? '17€' : '22€'} <span className="text-xs">par mois / classe</span></p>
                <button className="text-black px-4 py-2 rounded text-sm font-medium hover:opacity-90" style={{backgroundColor: '#FFE552'}}>
                  Je passe en mode illimité
                  <span className="ml-1">↗</span>
                </button>
              </div>
            </div>

            {features.map((feature, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-white border-b border-gray-200">
                <div className="font-medium text-sm border-r border-gray-200 pr-4">{feature.name}</div>
                <div className="text-center text-sm border-r border-gray-200 pr-4">{feature.free}</div>
                <div className="text-center text-sm">{feature.premium}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg p-12 text-center text-white mb-16 relative" style={{backgroundColor: '#F26103'}}>
          <div className="flex items-center justify-center mb-4">
            <h2 className="text-3xl font-bold mr-4">Une question ?</h2>
            <svg width="60" height="40" viewBox="0 0 60 40" className="text-yellow-400">
              <path d="M10 30 Q 30 10, 50 25" stroke="currentColor" strokeWidth="3" fill="none"/>
              <path d="M45 20 L 50 25 L 45 30" stroke="currentColor" strokeWidth="3" fill="none"/>
            </svg>
          </div>
          <p className="text-lg mb-8">
            Écrivez-nous, on vous aide à trouver<br />
            le plan adapté à vos besoins.
          </p>
          
          <div className="flex justify-center items-center space-x-4">
            <svg width="40" height="60" viewBox="0 0 40 60" className="text-yellow-400">
              <path d="M20 10 Q 5 25, 20 40 Q 35 25, 20 10" stroke="currentColor" strokeWidth="3" fill="none"/>
              <path d="M15 35 L 20 40 L 25 35" stroke="currentColor" strokeWidth="3" fill="none"/>
            </svg>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-orange-500 transition-colors">
              hello@izzzi.io
            </button>
            <button className="text-black px-6 py-3 rounded-lg font-medium hover:opacity-90 flex items-center" style={{backgroundColor: '#FFE552'}}>
              Nous contacter
              <span className="ml-2">↗</span>
            </button>
          </div>
        </div>

        <div className="relative mb-16 h-32">
          <span className="absolute top-0 left-12 transform -rotate-12 bg-yellow-300 text-black px-6 py-3 rounded-full text-sm font-medium">#Love</span>
          <span className="absolute top-8 left-1/4 transform rotate-6 bg-white text-black px-6 py-3 rounded-full text-sm font-medium border border-gray-300">IA + education = &lt;3</span>
          <span className="absolute top-2 left-1/2 transform -rotate-6 bg-orange-400 text-white px-6 py-3 rounded-full text-sm font-medium">#QuatiopFriendly</span>
          <span className="absolute top-12 right-1/4 transform rotate-12 text-black px-6 py-3 rounded-full text-sm font-medium" style={{backgroundColor: '#FFE552'}}>#Simple</span>
          <span className="absolute top-0 right-32 transform -rotate-3 bg-white text-black px-6 py-3 rounded-full text-sm font-medium border border-gray-300">#DoubleSatisfaction</span>
          <span className="absolute top-16 right-48 transform rotate-8 bg-orange-400 text-white px-6 py-3 rounded-full text-sm font-medium">#LiveReview</span>
          <span className="absolute top-4 right-12 transform rotate-15 text-black px-6 py-3 rounded-full text-sm font-medium" style={{backgroundColor: '#FFE552'}}>#Sincere</span>
        </div>
      </main>

      <footer className="bg-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <p><a href="#" className="hover:text-yellow-300 transition-colors">S'inscrire</a></p>
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
      </footer>
    </div>
  );
}
