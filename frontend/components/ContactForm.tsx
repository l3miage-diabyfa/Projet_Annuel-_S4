'use client';

import { useState } from 'react';
import ConfirmationMessage from '../app/contact/components/ConfirmationMessage';
import { apiFetch } from '@/utils/api';

interface ContactFormProps {
  returnPath?: string;
  returnLabel?: string;
}

export default function ContactForm({ 
  returnPath = '/', 
  returnLabel = "Retourner à l'accueil" 
}: ContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des champs requis
    if (!formData.organization.trim() || 
        !formData.lastName.trim() || 
        !formData.firstName.trim() || 
        !formData.email.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
        !formData.classCount || 
        (formData.wantsCallback && !formData.phone.trim())
      ) {
      return;
    }
    
    // Parsing classCount to number
    const classCountNumber = parseInt(formData.classCount, 10);

    const dataToSend = {
      ...formData,
      classCount: classCountNumber,
    };
    
    const { data, error } = await apiFetch('/contact', {
      method: 'POST',
      body: dataToSend,
    });

    if (!error && data?.success) {
      setIsSubmitted(true);
    } else {
      console.error('Erreur lors de l\'envoi:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <>
      {isSubmitted ? (
        <ConfirmationMessage returnPath={returnPath} returnLabel={returnLabel} />
      ) : (
        <>
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
                  École ou organisme <span className="text-red-500">*</span>
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
                    Nom <span className="text-red-500">*</span>
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
                    Prénom <span className="text-red-500">*</span>
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
                  Email professionnel <span className="text-red-500">*</span>
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
                  Nombre approximatif de classes <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
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
        </>
      )}
    </>
  );
}
