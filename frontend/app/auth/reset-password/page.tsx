"use client";

import Alert from "@/components/shared/Alert";
import InputField from "@/components/shared/InputField";
import React, { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";

export default function ResetPasswordPage() {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    // Logique de réinitialisation du mot de passe à ajouter ici
    console.log("Nouveau mot de passe:", form.password);
    setSubmitted(true);
  };

  return (
    <>
      {submitted ? (
        <Alert mode="success">
          Votre mot de passe a été réinitialisé avec succès. Vous pouvez
          maintenant vous connecter avec votre nouveau mot de passe.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold mb-2">
            Définir un nouveau mot de passe
          </h2>
          <InputField
            label="Nouveau mot de passe"
            name="password"
            type="password"
            placeholder="Entrez votre nouveau mot de passe"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
          />
          <InputField
            label="Confirmez le mot de passe"
            name="confirmPassword"
            type="password"
            placeholder="Confirmez votre nouveau mot de passe"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
          />
          {error && (
            <div className="text-red-600 text-sm font-medium">{error}</div>
          )}
          <button type="submit" className="button-primary mx-auto !w-full">
            Réinitialiser mon mot de passe <FiArrowUpRight />
          </button>
        </form>
      )}
    </>
  );
}

