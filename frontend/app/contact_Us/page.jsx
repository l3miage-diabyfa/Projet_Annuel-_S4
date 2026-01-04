"use client";
import { useState } from "react";
import InputField from "@/components/shared/InputField";
import { FiArrowUpRight } from "react-icons/fi";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";

export default function Page() {
  const [form, setForm] = useState({
    etablissement: "",
    email: "",
    nom: "",
    prenom: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique d'inscription à ajouter ici
    console.log("Données du formulaire:", form);
    alert("Compte créé !");
  };
  return (
    <>
      <Header />

      {/* Hero section */}
      <div className="items-center text-center pt-42 px-8 pb-10 bg-[#F4F4F4] w-full"></div>
      <section className="">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex flex-col gap-4 bg-amber-500"
        >
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
          <button
            type="submit"
            className="button-primary w-auto mx-auto py-2 px-6"
          >
            Créer un compte <FiArrowUpRight />
          </button>
        </form>
      </section>
      <Footer />
    </>
  );
}
