"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiArrowUpRight, FiEdit2, FiTrash2, FiClock, FiCheck, FiDownload, FiRefreshCw, FiCopy } from "react-icons/fi";
import { type Subject } from "@/lib/api";
import MomentCard from "./MomentCard";

interface SubjectRowProps {
  subject: Subject & {
    duringForm?: any;
    afterForm?: any;
  };
  classId: string;
  totalStudents: number;
  onChooseForm: () => void;
  onFormUpdated: () => void;
}

export default function SubjectRow({ 
  subject, 
  classId, 
  totalStudents,
  onChooseForm,
  onFormUpdated 
}: SubjectRowProps) {
  const hasForms = subject.duringForm || subject.afterForm;

  // Format dates
  const dateRange = subject.firstLessonDate && subject.lastLessonDate
    ? `${new Date(subject.firstLessonDate).toLocaleDateString('fr-FR')} - ${new Date(subject.lastLessonDate).toLocaleDateString('fr-FR')}`
    : 'Dates non définies';

  return (
    <div className="p-6 transition-colors hover:bg-gray-50/30 min-w-7xl">
      <div className="grid grid-cols-24 gap-4 items-start">
        {/* Column 1: Subject Info */}
        <div className="col-span-6">
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="font-bold text-gray-900">{subject.name}</h3>
            {subject.instructorName && (
              <span className="text-xs font-semibold text-gray-500">
                {subject.instructorName}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 font-medium mb-4">
            {dateRange}
          </p>

          {!hasForms ? (
            <button 
              onClick={onChooseForm}
              className="bg-primary-orange hover:bg-orange-600 text-white text-sm font-medium px-5 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              Choisir le type de formulaire
              <FiArrowUpRight className="w-4 h-4" />
            </button>
          ) : (
            <div>
              <button 
                onClick={onChooseForm}
                className="bg-primary-yellow hover:bg-yellow-400 text-gray-900 text-sm font-medium px-5 py-3 rounded-lg transition-colors flex items-center gap-2 mb-2"
              >
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

        {/* Columns 2-4: Forms/Moments */}
        {!hasForms ? (
          <>
            <div className="col-span-17 space-y-3 relative" />
            <div className="col-span-1 flex flex-col justify-end items-end gap-2">
              <Link
                href={`/dashboard/subjects/${subject.id}/edit?classId=${classId}`}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiEdit2 className="w-4 h-4" />
              </Link>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="col-span-17 space-y-3 relative">
              {/* During Form */}
              {subject.duringForm && (
                <MomentCard
                  moment={{
                    type: "during",
                    label: "Pendant le cours",
                    formId: subject.duringForm.id,
                    publicLink: subject.duringForm.publicLink,
                    feedbackCount: subject.duringForm._count?.reviews || 0,
                    totalStudents,
                  }}
                  classId={classId}
                />
              )}

              {/* After Form */}
              {subject.afterForm && (
                <MomentCard
                  moment={{
                    type: "end",
                    label: "Fin du cours (automatique)",
                    formId: subject.afterForm.id,
                    publicLink: subject.afterForm.publicLink,
                    feedbackCount: subject.afterForm._count?.reviews || 0,
                    totalStudents,
                  }}
                  classId={classId}
                />
              )}
            </div>
            <div className="col-span-1 flex flex-col justify-end items-end gap-2">
              <Link
                href={`/dashboard/subjects/${subject.id}/edit?classId=${classId}`}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiEdit2 className="w-4 h-4" />
              </Link>
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