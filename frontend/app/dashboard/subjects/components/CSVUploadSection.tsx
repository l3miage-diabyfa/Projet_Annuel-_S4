"use client";

import React from "react";
import { IoDownloadOutline, IoCloudUploadOutline } from "react-icons/io5";

type CSVUploadSectionProps = {
  classId: string;
};

export default function CSVUploadSection({ classId }: CSVUploadSectionProps) {
  function handleDownloadTemplate() {
    // TODO: Call backend endpoint to download CSV template
    console.log('Download CSV template for class:', classId);
    alert('Fonctionnalité à venir : Téléchargement du modèle CSV');
  }

  function handleUploadCSV() {
    // TODO: Implement CSV file upload
    console.log('Upload CSV for class:', classId);
    alert('Fonctionnalité à venir : Import CSV');
  }

  return (
    <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Télécharger le CSV pour ajouter toutes tes matières d'un coup.
      </h2>
      <div className="mb-6">
        <a href="#" className="text-sm text-gray-600 hover:underline">
          Comment ça marche ?
        </a>
        <span className="text-sm text-gray-600 ml-1">(1 minute)</span>
      </div>

      <div className="flex flex-wrap gap-4">
        <button 
          onClick={handleDownloadTemplate}
          className="button-outline"
          type="button"
        >
          <span>Télécharger notre modèle CSV</span>
          <IoDownloadOutline className="w-5 h-5" />
        </button>
        <button 
          onClick={handleUploadCSV}
          className="button-primary !w-fit"
          type="button"
        >
          <span>Importer un fichier CSV</span>
          <IoCloudUploadOutline className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}