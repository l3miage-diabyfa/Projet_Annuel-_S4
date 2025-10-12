"use client";

import React, { useState } from "react";
import Link from "next/link";
import InputField from "@/components/shared/InputField";
import { FiArrowUpRight } from "react-icons/fi";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de connexion
    console.log("Données de connexion:", form);
    alert("Connexion réussie !");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <InputField
          label="Adresse email"
          name="email"
          type="email"
          placeholder="Entrez votre email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <InputField
          label="Mot de passe"
          name="password"
          type="password"
          placeholder="Entrez votre mot de passe"
          value={form.password}
          onChange={handleChange}
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
