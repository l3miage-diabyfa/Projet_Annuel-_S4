"use client";

import React from "react";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import FeaturesGrid from "@/components/home/FeaturesGrid";
import StatsSection from "@/components/home/StatsSection";
import CtaSection from "@/components/home/CtaSection";
import TagsSection from "@/components/home/TagsSection";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <Hero />
      <FeaturesGrid />
      <StatsSection />
      <CtaSection />
      <TagsSection />
      <Footer />
    </div>
  );
}
