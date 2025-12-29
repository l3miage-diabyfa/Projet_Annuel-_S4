import React from "react";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

interface GoogleErrorMessageProps {
  onBack?: () => void;
}

export default function GoogleErrorMessage({ onBack }: GoogleErrorMessageProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-bold font-mochiy mb-2">
        Échec de la connexion
      </h2>
      <p className="text-gray-800 max-w-md">
        La connexion avec Google a échoué. Veuillez réessayer.
      </p>
      <Link href="/auth/signin" onClick={handleBack} className="button-primary mt-2">
        Retour à la connexion
        <FiArrowUpRight />
      </Link>
    </div>
  );
}
