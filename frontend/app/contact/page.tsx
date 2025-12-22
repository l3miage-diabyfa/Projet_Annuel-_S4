'use client';

import { useState } from 'react';
import Button from '../components/Button';
import Header from '../../components/home/Header';
import Footer from '../../components/home/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    organization: '',
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    classCount: '',
    message: '',
    wantsCallback: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Votre établissement dépasse nos<br />
            formules standards ?
          </h1>
          <p className="text-gray-600">
            L&apos;équipe izzzi vous accompagne pour créer une offre adaptée à votre nombre de<br />
            classes, à vos besoins spécifiques ou à vos exigences administratives.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                École ou organisme
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Izzzi School"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email professionnel
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hello@izzzi.io"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone (pour rappel)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="06 00 00 00 00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre approximatif de classes / étudiants
              </label>
              <input
                type="text"
                name="classCount"
                value={formData.classCount}
                onChange={handleChange}
                placeholder="22"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Décrivez brièvement vos besoins"
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                name="wantsCallback"
                checked={formData.wantsCallback}
                onChange={handleChange}
                className="mt-1 mr-2 h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <label className="text-sm text-gray-700">
                Je souhaite être rappelé(e) par un membre de l&apos;équipe
              </label>
            </div>

            <button
              type="submit"
              className="text-black px-6 py-3 rounded-lg font-medium hover:opacity-90 inline-flex items-center mt-4"
              style={{backgroundColor: '#FFE552'}}
            >
              Envoyer ma demande
              <span className="ml-2">→</span>
            </button>
          </form>
        </div>
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
