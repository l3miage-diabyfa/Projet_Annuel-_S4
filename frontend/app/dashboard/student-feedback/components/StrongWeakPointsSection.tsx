import React from "react";

export default function StrongWeakPointsSection() {
  const points = {
    weak: [
      "Beauté, rarissime, comme-on en fait rarement",
      "Trop fort",
      "Trop fort",
      "Trop fort",
      "Trop fort",
      "Trop fort",
      "Trop fort",
    ],
    strong: [
      "Beauté, rarissime, comme-on en fait rarement",
      "Trop fort",
      "Trop fort",
      "Trop fort",
      "Trop fort",
      "Trop fort",
      "Trop fort",
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl border h-full">
        <h3 className="font-bold text-gray-800 mb-6">Points faibles</h3>
        <ul className="space-y-3">
          {points.weak.map((point, idx) => (
            <li
              key={idx}
              className="text-sm text-gray-600 border-b border-gray-50 pb-2 last:border-0 last:pb-0"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-2xl border h-full">
        <h3 className="font-bold text-gray-800 mb-6">Points forts</h3>
        <ul className="space-y-3">
          {points.strong.map((point, idx) => (
            <li
              key={idx}
              className="text-sm text-gray-600 border-b border-gray-50 pb-2 last:border-0 last:pb-0"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
