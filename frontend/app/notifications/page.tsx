"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import NotificationsModal from "@/components/NotificationsModal";

export default function NotificationsPage() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/"); // Redirige vers la page d'accueil
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <NotificationsModal onClose={handleClose} />
      </main>
      <Footer />
    </div>
  );
}
