"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import InputField from "@/components/shared/InputField";
import { FiArrowUpRight } from "react-icons/fi";
import { apiFetch } from "@/utils/api";
import { setTokenCookie } from "@/utils/cookie";
import { useUser } from "@/contexts/UserContext";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationToken = searchParams.get("invitation");
  const { setUser } = useUser();
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // invitation signup
    if (invitationToken) {
      if (!form.email || !form.nom || !form.prenom || !form.password) {
        setError("Tous les champs sont obligatoires.");
        return;
      }
    } else {
      // Admin signup
      if (!form.etablissement || !form.email || !form.nom || !form.prenom || !form.password) {
        setError("Tous les champs sont obligatoires.");
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
      router.push("/dashboard");
    } else {
      setError(error || data?.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <>
      {validatingToken && (
        <div className="text-gray-600 text-sm mb-2">Validation du lien d'invitation...</div>
      )}
      {error && (
        <div className="text-red-500 text-sm mb-2">{error}</div>
      )}
      {!validatingToken && !error && (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
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
      {!invitationToken && !error && !validatingToken && (
        <>
          <div className="text-center mt-2">
            <span className=" text-gray-900 block mb-2 font-mochiy">Ou</span>
            <button className="bg-white border border-gray-300 cursor-pointer rounded-full py-2 px-4 flex items-center justify-center gap-2 w-fit mx-auto hover:bg-gray-50 transition-colors text-gray-900">
              <img src="/google.svg" alt="Google" className="w-5" />
              Se connecter avec Google
            </button>
          </div>
          <div className="text-center mt-4 text-sm text-gray-800">
            Vous avez déjà un compte ?{" "}
            <Link
              href="/auth/signin"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Se connecter
            </Link>
          </div>
        </>
      )}
    </>
  );
}
