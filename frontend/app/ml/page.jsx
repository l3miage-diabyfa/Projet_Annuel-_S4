"use client";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";

export default function Page() {
  return (
    <>
      <Header />

      {/* Hero section */}
      <div className="flex flex-col items-center gap-6 text-center pt-42 px-8 pb-10 bg-[#F4F4F4] w-full">
        <h1 className="text-3xl md:text-4xl font-mochiy text-[#131316]">
          Mentions Légales
        </h1>
        <p className="text-base md:text-lg text-left max-w-xl md:max-w-3xl text-gray-700 leading-relaxed px-8">
          Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004
          pour la confiance en l'économie numérique, il est précisé aux
          utilisateurs du site izzzi l'identité des différents intervenants dans
          le cadre de sa réalisation et de son suivi.
        </p>
      </div>

      {/* Contenu principal */}
      <main className="bg-white">
        {/* Edition du site */}
        <section className="max-w-3xl mx-auto px-6 md:px-8 pt-12 mb-10">
          <h2 className="mb-4 text-xl md:text-2xl font-mochiy text-[#131316]">
            Édition du site
          </h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
            Le présent site, accessible à l'URL www.izzzi.io (le « Site »), est
            édité par : Jedy formation, société au capital de 1000 euros,
            inscrite au R.C.S. de PARIS sous le numéro Paris B 842017196, dont
            le siège social est situé au 5 rue de charonne, 75011 Paris,
            représenté(e) par Jeremy Serval dûment habilité(e)
          </p>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Le numéro individuel TVA de l'éditeur est : FR07842017196.
          </p>
        </section>

        {/* Hébergement */}
        <section className="max-w-3xl mx-auto px-6 md:px-8 mb-10">
          <h2 className="mb-4 text-xl md:text-2xl font-mochiy text-[#131316]">
            Hébergement
          </h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Le Site est hébergé par la société OVH SAS, situé 2 rue Kellermann -
            BP 80157 - 59053 Roubaix Cedex 1, (contact téléphonique ou email :
            1007).
          </p>
        </section>

        {/* Directeur de publication */}
        <section className="max-w-3xl mx-auto px-6 md:px-8 mb-10">
          <h2 className="mb-4 text-xl md:text-2xl font-mochiy text-[#131316]">
            Directeur de publication
          </h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Le Directeur de la publication du Site est Jeremy Serval.
          </p>
        </section>

        {/* Nous contacter */}
        <section className="max-w-3xl mx-auto px-6 md:px-8 mb-10">
          <h2 className="mb-4 text-xl md:text-2xl font-mochiy text-[#131316]">
            Nous contacter
          </h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Par téléphone : +33610383288
          </p>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Par email : hello@izzzi.io
          </p>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Par courrier : 5 rue de charonne, 75011 Paris
          </p>
        </section>

        {/* Données personnelles */}
        <section className="max-w-3xl mx-auto px-6 md:px-8 mb-16">
          <h2 className="mb-4 text-xl md:text-2xl font-mochiy text-[#131316]">
            Données personnelles
          </h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Le traitement de vos données à caractère personnel est régi par
            notre Charte du respect de la vie privée, disponible depuis la
            section "Charte de Protection des Données Personnelles",
            conformément au Règlement Général sur la Protection des Données
            2016/679 du 27 avril 2016 («RGPD»).
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
