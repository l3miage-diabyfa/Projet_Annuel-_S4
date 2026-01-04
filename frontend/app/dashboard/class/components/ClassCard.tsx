import React from "react";
import Link from "next/link";
import { FiArrowUpRight, FiEye } from "react-icons/fi";

interface ClassItem {
  id: number | string; // Accept both
  name: string;
  description: string;
  students: number;
}

interface ClassCardProps {
  cls: ClassItem;
  onArchive: (id: number | string) => void;
  onEdit: (cls: ClassItem) => void;
}

export default function ClassCard({
  cls,
  onArchive,
  onEdit,
}: ClassCardProps) {
  return (
    <Link
      href={`/dashboard/class/${cls.id}`}
      className="bg-white rounded-xl p-6 border border-gray-100 flex flex-col justify-between min-h-[180px] group hover:border-gray-300 focus:ring-2 focus:ring-primary-yellow outline-none cursor-pointer group"
      style={{ textDecoration: "none" }}
      aria-label={`Voir la classe ${cls.name}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{cls.name}</h3>
          <p className="text-xs text-gray-500 mb-0 font-medium">
            {cls.description}
          </p>
          <p className="text-xs font-bold text-gray-900 mt-1">
            {cls.students} étudiant{cls.students !== 1 ? 's' : ''}
          </p>
        </div>
        <span
          className="bg-primary-yellow w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 group-hover:rotate-45 transition-all shrink-0"
          aria-label="Voir la classe"
        >
          <FiArrowUpRight className="w-5 h-5 text-gray-900" />
        </span>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4">
        <span className="flex items-center gap-2 text-xs text-gray-600 group-hover:text-gray-900 font-medium underline">
          <FiEye className="w-3.5 h-3.5" /> voir la classe
        </span>
        <div className="flex items-center gap-3">
          <button
            className="text-xs text-gray-500 hover:text-gray-700 underline decoration-gray-300"
            tabIndex={-1}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(cls);
            }}
          >
            Modifier
          </button>
          <button
            className="text-xs text-gray-500 hover:text-gray-700 underline decoration-gray-300"
            tabIndex={-1}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onArchive(cls.id);
            }}
          >
            Archiver
          </button>
        </div>
      </div>
    </Link>
  );
}