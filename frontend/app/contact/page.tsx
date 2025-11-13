'use client';

import { useState } from 'react';
import Button from '../components/Button';

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      <header className="bg-white shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
              </div>
              <span className="ml-2 text-xl font-bold">izzzi</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/tarifs" className="text-gray-700 hover:text-gray-900">
                Nos tarifs
              </a>
              <button className="text-black px-4 py-2 rounded font-medium hover:opacity-90 flex items-center" style={{backgroundColor: '#FFE552'}}>
                S&apos;inscrire
                <span className="ml-2">↗</span>
              </button>
              <button className="text-gray-700 hover:text-gray-900 flex items-center">
                Se connecter
                <span className="ml-2">↗</span>
              </button>
            </nav>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-black px-4 py-2 rounded font-medium hover:opacity-90 flex items-center gap-2"
              style={{backgroundColor: '#FFE552'}}
            >
              <span className="font-semibold">MENU</span>
              <div className="flex flex-col gap-1">
                <div className="w-4 h-0.5 bg-black"></div>
                <div className="w-4 h-0.5 bg-black"></div>
                <div className="w-4 h-0.5 bg-black"></div>
              </div>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
            <nav className="flex flex-col p-4 space-y-4">
              <a 
                href="/tarifs" 
                className="text-gray-700 py-2 px-4 hover:bg-gray-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Nos tarifs
              </a>
              <button 
                className="text-black px-4 py-3 rounded font-medium hover:opacity-90 flex items-center justify-center"
                style={{backgroundColor: '#FFE552'}}
                onClick={() => setIsMenuOpen(false)}
              >
                S&apos;inscrire
                <span className="ml-2">↗</span>
              </button>
              <button 
                className="text-gray-700 hover:text-gray-900 py-2 px-4 hover:bg-gray-50 rounded flex items-center justify-center border border-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Se connecter
                <span className="ml-2">↗</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

      <footer className="bg-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:hidden flex flex-col items-center text-center space-y-8">
            <div className="flex items-center">
              <div className="bg-white text-orange-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <div className="w-0 h-0 border-l-[8px] border-l-orange-500 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
              </div>
              <span className="text-2xl font-bold">izzzi</span>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Plan du site</h4>
              <div className="space-y-2">
                <p><a href="/tarifs" className="hover:text-yellow-300 transition-colors">Nos tarifs</a></p>
                <p><a href="#" className="hover:text-yellow-300 transition-colors">S&apos;inscrire</a></p>
                <p><a href="#" className="hover:text-yellow-300 transition-colors">Se connecter</a></p>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Nous contacter</h4>
              <div className="border-2 border-white rounded-lg px-4 py-3">
                <span className="text-white">hello@izzzi.io</span>
              </div>
            </div>
            
            <div className="flex justify-center space-x-8 text-sm pt-4">
              <a href="#" className="hover:text-yellow-300 transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-yellow-300 transition-colors">FAQ</a>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="grid grid-cols-3 gap-8">
              <div className="flex items-center">
                <div className="bg-white text-orange-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <div className="w-0 h-0 border-l-[8px] border-l-orange-500 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                </div>
                <span className="text-2xl font-bold">izzzi</span>
              </div>
              
              <div>
                <h4 className="font-bold mb-4 text-lg">Plan du site</h4>
                <div className="space-y-2">
                  <p><a href="/tarifs" className="hover:text-yellow-300 transition-colors">Nos tarifs</a></p>
                  <p><a href="#" className="hover:text-yellow-300 transition-colors">S&apos;inscrire</a></p>
                  <p><a href="#" className="hover:text-yellow-300 transition-colors">Se connecter</a></p>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-4 text-lg">Nous contacter</h4>
                <div className="border-2 border-white rounded-lg px-4 py-3 mb-6">
                  <span className="text-white">hello@izzzi.io</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-8 mt-8 text-sm">
              <a href="#" className="hover:text-yellow-300 transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-yellow-300 transition-colors">FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
