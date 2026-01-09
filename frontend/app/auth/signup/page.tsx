"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import InputField from "@/components/shared/InputField";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useGoogleError } from "@/contexts/GoogleErrorContext";
import { FiArrowUpRight } from "react-icons/fi";
import { apiFetch } from "@/utils/api";
import { setTokenCookie } from "@/utils/cookie";
import { useUser } from "@/contexts/UserContext";

// Separate component that uses useSearchParams
function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationToken = searchParams.get("invitation");
  const { setUser } = useUser();
  const { setGoogleError } = useGoogleError();
  const [form, setForm] = useState({
    etablissement: "",
    email: "",
    nom: "",
    prenom: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [validatingToken, setValidatingToken] = useState(false);

  // Valid invitation token on mount
  useEffect(() => {
    if (invitationToken) {
      setValidatingToken(true);
      apiFetch<{ valid: boolean; email: string; role: string; establishment: string }>(
        `/user/validate-invitation/${invitationToken}`,
        { method: "GET" }
      ).then(({ data, error: apiError }) => {
        setValidatingToken(false);
        if (apiError || !data) {
          setError(apiError || "Le lien d'invitation est invalide");
        } else if (data.email) {
          // Prefill email field from invitation
          setForm(prev => ({ ...prev, email: data.email }));
        }
      });
    }
  }, [invitationToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Contrôles communs
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

    if (invitationToken) {
      // Contrôles pour CompleteInvitationDto
      if (!form.email || !form.nom || !form.prenom || !form.password) {
        setError("Tous les champs sont obligatoires.");
        return;
      }
      if (!emailRegex.test(form.email)) {
        setError("Adresse email invalide.");
        return;
      }
      if (form.nom.length < 2) {
        setError("Le nom doit contenir au moins 2 caractères.");
        return;
      }
      if (form.prenom.length < 2) {
        setError("Le prénom doit contenir au moins 2 caractères.");
        return;
      }
      if (!form.password || form.password.length < 8) {
        setError("Le mot de passe doit contenir au moins 8 caractères.");
        return;
      }
      if (!passwordRegex.test(form.password)) {
        setError("Le mot de passe doit contenir des lettres et des chiffres.");
        return;
      }
    } else {
      // Contrôles pour RegisterAdminDto
      if (!form.etablissement || !form.email || !form.nom || !form.prenom || !form.password) {
        setError("Tous les champs sont obligatoires.");
        return;
      }
      if (!emailRegex.test(form.email)) {
        setError("Adresse email invalide.");
        return;
      }
      if (form.nom.length < 2) {
        setError("Le nom doit contenir au moins 2 caractères.");
        return;
      }
      if (form.prenom.length < 2) {
        setError("Le prénom doit contenir au moins 2 caractères.");
        return;
      }
      if (!form.password || form.password.length < 8) {
        setError("Le mot de passe doit contenir au moins 8 caractères.");
        return;
      }
      if (!passwordRegex.test(form.password)) {
        setError("Le mot de passe doit contenir des lettres et des chiffres.");
        return;
      }
    }

    const { data, error } = await apiFetch<{ 
      access_token: string; 
      message?: string;
      user?: {
        firstname: string;
        lastname: string;
        email: string;
        role: string;
        establishment?: string;
      }
    }>(
      invitationToken ? "/user/complete-invitation" : "/user/register",
      {
        method: "POST",
        body: invitationToken 
          ? {
              invitationToken: invitationToken,
              email: form.email,
              lastname: form.nom,
              firstname: form.prenom,
              password: form.password,
            }
          : {
              schoolName: form.etablissement,
              email: form.email,
              lastname: form.nom,
              firstname: form.prenom,
              password: form.password,
            },
      }
    );
    if (data && data.access_token) {
      setTokenCookie(data.access_token);
      if (data.user) {
        setUser(data.user);
      }
      router.push("/dashboard/class");
    } else {
      setError(error || data?.message || "Erreur lors de l'inscription");
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    setError("");
    setGoogleError(false);

    // Google login only available with invitation token
    if (!invitationToken) {
      setError("L'inscription admin se fait uniquement via le formulaire");
      return;
    }

    const { data, error } = await apiFetch<{
      access_token: string;
      message?: string;
      user?: {
        firstname: string;
        lastname: string;
        email: string;
        role: string;
        establishment?: string;
        profilePic?: string;
        provider?: string;
      }
    }>(
      "/user/google-complete-invitation",
      {
        method: "POST",
        body: {
          token: credential,
          invitationToken: invitationToken,
        },
      }
    );

    if (data && data.access_token) {
      setTokenCookie(data.access_token);
      if (data.user) {
        setUser(data.user);
      }
      router.push("/dashboard/class");
    } else {
      setGoogleError(true);
    }
  };

  return (
    <>
      {validatingToken && (
        <div className="text-gray-600 text-sm mb-2">Validation du lien d'invitation...</div>
      )}
      {!validatingToken && (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {error && (
            <div className="text-red-500 text-sm mb-2">{error}</div>
          )}
          {!invitationToken && (
            <div>
              <InputField
                label="Nom de l'établissement"
                name="etablissement"
                type="text"
                placeholder="Entrez le nom de l'établissement"
                value={form.etablissement}
                onChange={handleChange}
                required
                className="input w-full"
              />
            </div>
          )}
          <div>
            <InputField
              label="Adresse email"
              name="email"
              type="email"
              placeholder="Entrez votre email"
              value={form.email}
              onChange={handleChange}
              required
              className="input w-full"
            />
          </div>
          <div>
            <InputField
              label="Nom"
              name="nom"
              type="text"
              placeholder="Entrez votre nom"
              value={form.nom}
              onChange={handleChange}
              required
              className="input w-full"
            />
          </div>
          <div>
            <InputField
              label="Prénom"
              name="prenom"
              type="text"
              placeholder="Entrez votre prénom"
              value={form.prenom}
              onChange={handleChange}
              required
              className="input w-full"
            />
          </div>
          <div>
            <InputField
              label="Mot de passe"
              name="password"
              type="password"
              placeholder="Entrez votre mot de passe"
              value={form.password}
              onChange={handleChange}
              required
              className="input w-full"
            />
          </div>
          <button
            type="submit"
            className="button-primary w-auto mx-auto py-2 px-6"
          >
            Créer un compte <FiArrowUpRight />
          </button>
        </form>
      )}
      {invitationToken && !error && !validatingToken && (
        <div className="text-center mt-2">
          <span className=" text-gray-900 block mb-2 font-mochiy">Ou</span>
          <div className="flex justify-center">
            <GoogleSignInButton onSuccess={handleGoogleSuccess} />
          </div>
        </div>
      )}
      {!invitationToken && !error && !validatingToken && (
        <div className="text-center mt-4 text-sm text-gray-800">
          Vous avez déjà un compte ?{" "}
          <Link
            href="/auth/signin"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Se connecter
          </Link>
        </div>
      )}
    </>
  );
}

// Main export with Suspense wrapper
export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="text-center p-8">
        <p className="text-gray-600">Chargement...</p>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}