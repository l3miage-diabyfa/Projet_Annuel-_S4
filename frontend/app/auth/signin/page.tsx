"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InputField from "@/components/shared/InputField";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useGoogleError } from "@/contexts/GoogleErrorContext";
import { FiArrowUpRight } from "react-icons/fi";
import { apiFetch } from "@/utils/api";
import { setTokenCookie } from "@/utils/cookie";
import { useUser } from "@/contexts/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const { setGoogleError } = useGoogleError();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Veuillez remplir tous les champs.");
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
      }
    }>(
      "/user/login",
      {
        method: "POST",
        body: {
          email: form.email,
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
      setError(error || data?.message || "Erreur lors de la connexion");
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    setError("");
    setGoogleError(false);
    
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
      "/user/google-login",
      {
        method: "POST",
        body: {
          token: credential,
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
      setGoogleError(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2  w-full">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <InputField
          label="Adresse email"
          name="email"
          type="email"
          placeholder="Entrez votre email"
          value={form.email}
          onChange={handleChange}
          className="input w-full"
          required
        />

        <InputField
          label="Mot de passe"
          name="password"
          type="password"
          placeholder="Entrez votre mot de passe"
          value={form.password}
          onChange={handleChange}
          className="input w-full"
          required
        />

        <div className=" text-gray-900 text-right mb-4 mr-2 text-sm">
          <Link
            href="/auth/forgot-password"
            className="#2F2E2C underline hover:#2F2E2C"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <button type="submit" className="button-primary mx-auto !px-8">
          Se connecter <FiArrowUpRight />
        </button>
      </form>
      <div className="text-center mt-2">
        <span className=" text-gray-900 block mb-2 font-mochiy">Ou</span>
        <div className="flex justify-center">
          <GoogleSignInButton onSuccess={handleGoogleSuccess} />
        </div>
      </div>
      <div className=" text-gray-900 text-center mt-4 text-sm">
        Pas encore de compte ?{" "}
        <Link
          href="/auth/signup"
          className="#2F2E2C underline hover:text-blue-800"
        >
          Inscription
        </Link>
      </div>
    </>
  );
}
