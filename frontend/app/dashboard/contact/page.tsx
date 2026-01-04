'use client';

import ContactForm from '@/components/ContactForm';

export default function DashboardContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-4xl mx-auto">
        <ContactForm 
          returnPath="/dashboard/class" 
          returnLabel="Retour à mes classes" 
        />
      </main>
    </div>
  );
}
