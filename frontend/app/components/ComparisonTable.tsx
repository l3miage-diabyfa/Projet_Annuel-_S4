'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faHands } from '@fortawesome/free-solid-svg-icons';
import PlanBadge, { PlanType } from './PlanBadge';

export interface ComparisonFeature {
  name: string;
  free: string;
  premium: string;
}

interface ComparisonTableProps {
  features: ComparisonFeature[];
  isAnnual: boolean;
}

export default function ComparisonTable({ features, isAnnual }: ComparisonTableProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('izzzi');

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">Comparez nos plans</h2>
      
      <div className="md:hidden mb-6 flex gap-2">
        <button
          onClick={() => setSelectedPlan('izzzi')}
          className={`flex-1 px-4 py-3 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            selectedPlan === 'izzzi'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <FontAwesomeIcon icon={faThumbsUp} />
          Izzzi
        </button>
        <button
          onClick={() => setSelectedPlan('super')}
          className={`flex-1 px-4 py-3 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            selectedPlan === 'super'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <FontAwesomeIcon icon={faHands} />
          Super Izzzi
        </button>
      </div>

      <div className="md:hidden bg-white rounded-lg overflow-hidden border border-gray-300">
        <div className="p-6 bg-gray-50 border-b border-gray-200 text-center">
          <div className="mb-3">
            <PlanBadge planType={selectedPlan} />
          </div>
          {selectedPlan === 'izzzi' ? (
            <>
              <p className="text-2xl font-bold mb-1">0€ <span className="text-sm font-normal">par mois</span></p>
              <p className="text-xs text-gray-500 mb-4">(4 mois d'essai illimités)</p>
              <button className="text-black px-6 py-3 rounded-lg text-sm font-medium hover:opacity-90 inline-flex items-center gap-2" style={{backgroundColor: '#FFE552'}}>
                Démarrer l'essai gratuit
                <span>↗</span>
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-1">À partir de</p>
              <p className="text-2xl font-bold mb-4">{isAnnual ? '17€' : '22€'} <span className="text-sm font-normal">par mois / classe</span></p>
              <button className="text-black px-6 py-3 rounded-lg text-sm font-medium hover:opacity-90 inline-flex items-center gap-2" style={{backgroundColor: '#FFE552'}}>
                Je choisis ce plan
                <span>↗</span>
              </button>
            </>
          )}
        </div>

        {features.map((feature, index) => (
          <div key={index} className="p-4 bg-white border-b border-gray-200">
            <div className="font-semibold text-sm mb-2">{feature.name}</div>
            <div className="text-sm text-gray-700">
              {selectedPlan === 'izzzi' ? feature.free : feature.premium}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-white rounded-lg overflow-hidden border border-gray-300">
        <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b border-gray-200">
          <div></div>
          <div className="text-center">
            <div className="mb-3 flex justify-center">
              <PlanBadge planType="izzzi" />
            </div>
            <p className="text-sm text-gray-600 mb-1">0€ <span className="text-xs">par mois</span></p>
            <p className="text-xs text-gray-500 mb-3">(4 mois d'essai illimités)</p>
            <button className="text-black px-4 py-2 rounded text-sm font-medium hover:opacity-90" style={{backgroundColor: '#FFE552'}}>
              Démarrer l'essai gratuit
              <span className="ml-1">↗</span>
            </button>
          </div>
          <div className="text-center">
            <div className="mb-3 flex justify-center">
              <PlanBadge planType="super" />
            </div>
            <p className="text-sm text-gray-600 mb-1">À partir de</p>
            <p className="text-sm text-gray-600 mb-3">{isAnnual ? '17€' : '22€'} <span className="text-xs">par mois / classe</span></p>
            <button className="text-black px-4 py-2 rounded text-sm font-medium hover:opacity-90" style={{backgroundColor: '#FFE552'}}>
              Je passe en mode illimité
              <span className="ml-1">↗</span>
            </button>
          </div>
        </div>

        {features.map((feature, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-white border-b border-gray-200">
            <div className="font-medium text-sm border-r border-gray-200 pr-4">{feature.name}</div>
            <div className="text-center text-sm border-r border-gray-200 pr-4">{feature.free}</div>
            <div className="text-center text-sm">{feature.premium}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
