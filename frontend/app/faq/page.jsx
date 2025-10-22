import FaqCard from '@/components/Faq/FaqCard';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import { BiSearch } from 'react-icons/bi';
export default function Page() {
  return (
    <>
    <Header />
    <div className="justify-center items-center flex flex-col gap-4 text-center pt-42 px-8 pb-10 bg-gray-100 w-full">
  <h1 className="text-3xl font font-mochiy text-[#131316]">Comment peut-on vous aider ?</h1>
  <div className="relative w-full max-w-md">
    <input 
      type="search" 
      className="input w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
      placeholder="Tapez votre recherche ici" 
    />
    <BiSearch
      className="absolute right-3 top-7 transform -translate-y-1/2 w-5 h-5 text-gray-400"
    />
  </div>
</div>

    <main className="bg-white flex flex-col justify-center px-16 py-16">
      <section className="container mx-auto w-full max-w-[1368px]">
        <h2 className="mb-4 text-[18px] font-semibold text-[#131316]">
          Questions fréquentes
        </h2>

        {/* Grille 2 colonnes (≥ md), sinon 1 colonne */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Colonne gauche */}
          <div className="flex flex-col gap-6">
            <FaqCard question="À quoi sert izzzi ?">
              <p>
                Texte d’Izzzi…
              </p>
            </FaqCard>

            <FaqCard question="Quelle est la différence entre une “matière” et une “classe” ?" defaultOpen>
              <ul className="list-disc pl-5">
                <li>Une classe correspond à un groupe d’étudiants.</li>
                <li>Une matière est un enseignement associé à un intervenant. Une même classe peut regrouper plusieurs matières.</li>
              </ul>
            </FaqCard>
          </div>

          {/* Colonne droite */}
          <div className="flex flex-col gap-6">
            <FaqCard question="Que peut-on faire avec les retours ?" defaultOpen>
              <p>Tous les retours sont centralisés dans un dashboard clair et interactif. Vous pouvez :</p>
              <ul className="mt-3 list-disc pl-5">
                <li>les filtrer par matière ou type de réponse,</li>
                <li>les exporter en un clic,</li>
                <li>générer un QR code pour faciliter l’accès au formulaire,</li>
                <li>relancer les étudiants depuis la plateforme,</li>
                <li>recevoir des alertes automatiques en cas de signaux faibles (positifs ou négatifs) dans les retours.</li>
              </ul>
            </FaqCard>

            <FaqCard question="Les retours sont-ils vraiment anonymes ?">
              <p>
                Oui. Par défaut, tous les retours sont anonymes. Dans l’offre Super Izzzi, l’étudiant peut toutefois choisir de lever l’anonymat s’il le souhaite pour un message.
              </p>
            </FaqCard>
          </div>
        
      </div>
      </section>

      <section className="container mx-auto mt-12 w-full max-w-[1368px]">
        <h2 className="mb-4 text-[18px] font-semibold text-[#131316]">
          Autres questions
        </h2>
        <div>
          <ul className="list-autres-questions pl-5 flex flex-wrap gap-4 mb-8">
                <li className='whitespace-nowrap font-bold underline'> Usage </li>
                <li className='whitespace-nowrap'>Fonctionnalités</li>
                <li className='whitespace-nowrap'>Données & confidentialité</li>
                <li className='whitespace-nowrap'>Gestion administrative</li>
              </ul>
        </div>
        
        {/* Grille 2 colonnes (≥ md), sinon 1 colonne */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-8">
          {/* Colonne gauche */}
            <FaqCard question="À quoi sert izzzi ?">
              <p>
                Texte d’Izzzi…
              </p>
            </FaqCard>

            <FaqCard question="Quelle est la différence entre une “matière” et une “classe” ?" defaultOpen>
              <ul className="list-disc pl-5">
                <li>Une classe correspond à un groupe d’étudiants.</li>
                <li>Une matière est un enseignement associé à un intervenant. Une même classe peut regrouper plusieurs matières.</li>
              </ul>
            </FaqCard>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}
