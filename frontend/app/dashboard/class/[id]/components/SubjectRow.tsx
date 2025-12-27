import React from "react";
import { FiArrowUpRight, FiEdit2, FiTrash2 } from "react-icons/fi";
import MomentCard, { Moment } from "./MomentCard";

export interface Subject {
  id: number;
  name: string;
  teacher: string;
  dateRange: string;
  status: "pending" | "active" | "active_resent";
  formType: string | null;
  feedbackCount?: number;
  totalStudents: number;
  moments?: Moment[];
}

interface SubjectRowProps {
  subject: Subject;
}

export default function SubjectRow({ subject }: SubjectRowProps) {
  return (
    <div className="p-6 transition-colors hover:bg-gray-50/30 min-w-7xl">
      <div className="grid grid-cols-24 gap-4 items-start">
        {/* Colonne 1: Info matière */}
        <div className="col-span-6">
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="font-bold text-gray-900">{subject.name}</h3>
            <span className="text-xs font-semibold text-gray-500">
              {subject.teacher}
            </span>
          </div>
          <p className="text-xs text-gray-400 font-medium mb-4">
            {subject.dateRange}
          </p>

          {subject.status === "pending" ? (
            <button className="bg-primary-orange hover:bg-orange-600 text-white text-sm font-medium px-5 py-3 rounded-lg transition-colors flex items-center gap-2">
              Choisir le type de formulaire
              <FiArrowUpRight className="w-4 h-4" />
            </button>
          ) : (
            <div>
              <button className="bg-primary-yellow hover:bg-yellow-400 text-gray-900 text-sm font-medium px-5 py-3 rounded-lg transition-colors flex items-center gap-2 mb-2">
                Modifier le formulaire
                <FiArrowUpRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-gray-500 leading-tight max-w-xs">
                Le formulaire sélectionné s'applique à tous les moments
                d'évaluation de cette matière.
              </p>
            </div>
          )}
        </div>

        {/* Colonnes 2-4: Moments ou actions */}
        {subject.status === "pending" ? (
          <>
            <div className="col-span-17 space-y-3 relative" />
            <div className="col-span-1 flex flex-col justify-end items-end gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="col-span-17 space-y-3 relative">
              {subject.moments?.map((moment, idx) => (
                <MomentCard key={idx} moment={moment} />
              ))}
            </div>
            <div className="col-span-1 flex flex-col justify-end items-end gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
