"use client";

import Alert from "@/components/shared/Alert";
import Link from "next/link";
import InputField from "@/components/shared/InputField";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FiArrowUpRight } from "react-icons/fi";
import { apiFetch } from "@/utils/api";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validatingToken, setValidatingToken] = useState(false);

  // Valid reset token on mount
  useEffect(() => {
    if (token) {
      setValidatingToken(true);
      apiFetch<{ valid: boolean; email: string }>(
        `/user/validate-reset-token/${token}`,
        { method: "GET" }
      ).then(({ data, error: apiError }) => {
        setValidatingToken(false);
        if (apiError || !data) {
          setError(apiError || "Le lien de réinitialisation est invalide");
        }
      });
    } else {
      setError("Token de réinitialisation manquant");
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!token) {
      setError("Token de réinitialisation manquant");
      return;
    }
    
    if (form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    const { data, error: apiError } = await apiFetch<{ message: string }>(
      "/user/reset-password",
      {
        method: "POST",
        body: {
          token,
          newPassword: form.password,
        },
      }
    );

    if (data) {
      setSubmitted(true);
    } else {
      setError(apiError || "Une erreur est survenue");
    }
  };

  return (
    <>
      {validatingToken ? (
        <p className="text-center text-gray-600">
          Validation du lien de réinitialisation...
        </p>
      ) : error ? (
        <Alert mode="error">{error}</Alert>
      ) : submitted ? (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold font-mochiy  mb-2">
            🔒 Mot de passe réinitialisé avec succès !
          </h2>
          <p className="text-gray-800 max-w-md">
            Votre mot de passe a été mis à jour. Vous pouvez maintenant vous
            connecter avec votre nouveau mot de passe.
          </p>
          <Link href="/auth/signin" className="button-primary mt-2">
            Retour à la connexion
            <FiArrowUpRight />
          </Link>
        </div>
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

