import FaqCard from '@/components/Faq/FaqCard';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
export default function Page() {
  return (
    <>
    <Header />
    <div className="text-center px-8 py-6 bg-blue-500 w-full ">
      <h1 className="text-xl font-bold font-mochiy text-[#131316]">Comment peut-on vous aider ?</h1>
    </div>

    <main className="flex flex-col justify-center container mx-auto px-16">
      <section className="w-full max-w-[1368px]">
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

      <section className="mt-12 w-full max-w-[1368px]">
        <h2 className="mb-4 text-[18px] font-semibold text-[#131316]">
          Autres questions
        </h2>
        <div>
          <ul className="list-autres-questions pl-5 flex gap-4 mb-8">
                <li> <span class="font-bold underline">Usage </span></li>
                <li>Fonctionnalités</li>
                <li>Données & confidentialité</li>
                <li>Gestion administrative</li>
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
