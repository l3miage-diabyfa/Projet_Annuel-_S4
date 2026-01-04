"use client";

import InputField from "@/components/shared/InputField";
import React, { useState } from "react";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { apiFetch } from "@/utils/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data, error: apiError } = await apiFetch<{ 
      message: string;
      emailStatus?: 'sent' | 'failed' | 'not_sent';
      emailError?: any;
    }>(
      "/user/forgot-password",
      {
        method: "POST",
        body: { email },
      }
    );

    if (data) {
      if (data.emailStatus === 'failed') {
        setError("L'email n'a pas pu être envoyé. Veuillez réessayer plus tard.");
      } else if (data.emailStatus === 'sent') {
        setSubmitted(true);
      } else {
        // emailStatus === 'not_sent'
        setSubmitted(true);
      }
    } else {
      setError(apiError || "Une erreur est survenue");
    }
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
          <h2 className="title-mochiy text-[18px] leading-none mb-2">
            Mot de passe oublié
          </h2> 
          <InputField
            label="Saisissez votre adresse email"
            name="email"
            type="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={handleChange}
            required
          />
          {error && (
            <div className="text-red-500 text-sm mb-2">{error}</div>
          )}
          <button type="submit" className="button-primary mx-auto">
            Réinitialiser mon mot de passe <FiArrowUpRight />
          </button>
        </form>
      )}
    </>
  );
}
