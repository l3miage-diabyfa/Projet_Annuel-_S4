'use client';

import Header from '../../components/home/Header';
import Footer from '../../components/home/Footer';
import ContactForm from '../../components/ContactForm';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-24">
        <ContactForm />
      </main>

      <div className="relative mb-16 h-64 md:h-32 overflow-hidden bg-gray-50">
        <span className="absolute top-2 left-4 md:left-12 md:top-0 transform -rotate-12 bg-yellow-300 text-black px-6 py-3 rounded-full text-sm font-medium">#Love</span>
        <span className="absolute top-20 left-12 md:left-1/4 md:top-8 transform rotate-6 bg-white text-black px-6 py-3 rounded-full text-sm font-medium border border-gray-300">IA + education = &lt;3</span>
        <span className="absolute top-40 left-2 md:left-1/2 md:top-2 transform -rotate-6 bg-orange-400 text-white px-6 py-3 rounded-full text-sm font-medium">#QuatiopFriendly</span>
        <span className="absolute top-56 left-16 md:right-1/4 md:left-auto md:top-12 transform rotate-12 text-black px-6 py-3 rounded-full text-sm font-medium" style={{backgroundColor: '#FFE552'}}>#Simple</span>
        <span className="absolute top-0 right-2 md:right-32 md:top-0 transform -rotate-3 bg-white text-black px-6 py-3 rounded-full text-sm font-medium border border-gray-300">#DoubleSatisfaction</span>
        <span className="absolute top-20 right-8 md:right-48 md:top-16 transform rotate-8 bg-orange-400 text-white px-6 py-3 rounded-full text-sm font-medium">#LiveReview</span>
        <span className="absolute top-40 right-2 md:right-12 md:top-4 transform rotate-15 text-black px-6 py-3 rounded-full text-sm font-medium" style={{backgroundColor: '#FFE552'}}>#Sincere</span>
      </div>

      <Footer />
    </div>
  );
}
