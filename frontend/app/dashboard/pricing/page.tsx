'use client';

import PricingPlans from '@/components/PricingPlans';

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-7xl mx-auto">
        <PricingPlans 
          showDetailsButtons={false}
          contactPath="/dashboard/contact"
          premiumButtonText="Je choisis ce plan"
          premiumPath="/dashboard/pricing/checkout"
        />
      </main>
    </div>
  );
}
