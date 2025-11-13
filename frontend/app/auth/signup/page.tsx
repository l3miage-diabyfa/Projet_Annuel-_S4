"use client";

import React, { useState } from "react";
import Link from "next/link";
import InputField from "@/components/shared/InputField";
import { FiArrowUpRight } from "react-icons/fi";

export default function SignupPage() {
  const [form, setForm] = useState({
    etablissement: "",
    email: "",
    nom: "",
    prenom: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'inscription à ajouter ici
    console.log("Données du formulaire:", form);
    alert("Compte créé !");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
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
        <button type="submit" className="button-primary w-auto mx-auto py-2 px-6">
          Créer un compte <FiArrowUpRight />
        </button>
      </form>
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
  );
}
