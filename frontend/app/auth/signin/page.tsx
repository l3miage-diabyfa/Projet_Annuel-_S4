"use client";

import React, { useState } from "react";
import Link from "next/link";
import InputField from "@/components/shared/InputField";
import { FiArrowUpRight } from "react-icons/fi";
import { apiFetch } from "@/utils/api";
import { setTokenCookie } from "@/utils/cookie";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    const { data, error } = await apiFetch<{ access_token: string; message?: string }>(
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
      alert("Connexion réussie !");
      // Rediriger ou mettre à jour l'UI ici
    } else {
      setError(error || data?.message || "Erreur lors de la connexion");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2  w-full">
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
        <button className="bg-white border border-gray-300 cursor-pointer rounded-full py-2 px-4 flex items-center justify-center gap-2 w-fit mx-auto hover:bg-gray-50 transition-colors text-gray-900">
          <img src="/google.svg" alt="Google" className="w-5" />
          Se connecter avec Google
        </button>
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
