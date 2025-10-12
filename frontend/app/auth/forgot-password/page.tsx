"use client";

import InputField from "@/components/shared/InputField";
import React, { useState } from "react";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'envoi de l'email de réinitialisation
    console.log("Demande de réinitialisation pour:", email);
    setSubmitted(true);
  };

  return (
    <>
      {submitted ? (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold font-mochiy  mb-2">
            📩 Email de réinitialisation envoyé !
          </h2>
          <p className="text-gray-800 max-w-md">
            Vérifiez votre boîte de réception (et votre dossier spam au cas où)
            ! Nous vous avons envoyé un email avec un lien pour réinitialiser
            votre mot de passe.
            <br />
            <br />
            Si vous ne recevez rien, essayez à nouveau ou contactez notre
            support. 😊
          </p>
          <Link href="/auth/signin" className="button-primary mt-2">
            Retour à la connexion
            <FiArrowUpRight />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <InputField
            label="Adresse email"
            name="email"
            type="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={handleChange}
            required
          />
          <button type="submit" className="button-primary mx-auto">
            Réinitialiser le mot de passe <FiArrowUpRight />
          </button>
        </form>
      )}
    </>
  );
}
