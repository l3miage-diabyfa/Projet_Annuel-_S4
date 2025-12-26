import React from "react";

import BackButton from "../components/backButton";
import AddSubjectsForm from "../components/AddSubjectsForm";

export default function Page() {
  return (
    <>
      <BackButton
        text="Retour aux informations de la classe"
        href="/dashboard/show-subjects"
      />
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress indicator */}
        <div className="text-right mb-4">
          <div className="text-sm text-gray-600 bg-white border-b border-gray-200 rounded-full h-10 w-10 flex items-center justify-center mx-auto relative">
            2/2
            <div className="text-sm text-gray-700 absolute bottom-8 left-5 w-20 -rotate-20">
              On y est presque !
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-foreground text-center mb-12">
          Entrer les matières
        </h1>

        <AddSubjectsForm shadow={true} />
      </main>
    </>
  );
}
