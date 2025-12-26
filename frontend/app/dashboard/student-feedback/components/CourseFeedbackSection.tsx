import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const dataRating = [
  { name: "1", value: 0 },
  { name: "2", value: 2 },
  { name: "3", value: 3 },
  { name: "4", value: 2 },
  { name: "5", value: 6 },
];

const dataRatio = [
  { name: "Atelier", value: 60, color: "#f97316" }, // Orange
  { name: "Juste", value: 30, color: "#eab308" }, // Yellow
  { name: "Cours", value: 10, color: "#fef08a" }, // Light Yellow
];

const dataAmbiance = [
  { name: "Sympa", value: 80, color: "#fbbf24" },
  { name: "Moyen", value: 20, color: "#f59e0b" },
];

const dataHours = [
  { name: "Peu", value: 30, color: "#fef08a" },
  { name: "Bien", value: 40, color: "#facc15" },
  { name: "Trop", value: 30, color: "#ea580c" },
];

const dataRelevance = [
  { name: "Top", value: 70, color: "#f59e0b" },
  { name: "Null", value: 30, color: "#ea580c" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white text-sm px-2 py-1 rounded opacity-90">
        {payload[0].value} votes
      </div>
    );
  }
  return null;
};

export default function CourseFeedbackSection() {
  const [period, setPeriod] = useState("Tout voir");

  return (
    <div className="space-y-6">
      <div className="flex p-1 bg-gray-100 rounded-lg w-fit">
        {["22 novembre", "30 novembre", "Tout voir"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-6 py-3 rounded-lg transition-all ${
              period === p
                ? " bg-gray-900 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <h2 className="text-xl font-bold text-gray-900">Le cours</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Global Rating */}
        <div className="bg-white col-span-2 p-6 rounded-xl border h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-800">
              Globalement vous avez trouvé ce cours
            </h3>
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <span className="w-6 h-6 rounded-md bg-orange-500 mt-1 shrink-0 inline-block"></span>{" "}
              Note globale
            </span>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataRating} barSize={80}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "transparent" }}
                />
                <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Theory/Practice Ratio */}
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-sm font-bold text-gray-800 mb-6">
            Le ratio Théorie/Pratique
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* PieChart takes 2/3 width */}
            <div className="md:col-span-2 flex justify-center">
              <div className="w-[320px] h-[320px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataRatio}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      {dataRatio.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Legend takes 1/3 width */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex gap-2 text-sm text-gray-600">
                <span className="w-6 h-6 rounded-md bg-orange-500 mt-1 shrink-0 inline-block"></span>
                <p>
                  J'aurais aimé plus de mode atelier (on fait et on apprend)
                </p>
              </div>
              <div className="flex gap-2 text-sm text-gray-600">
                <span className="w-6 h-6 rounded-md bg-yellow-500 mt-1 shrink-0 inline-block"></span>
                <p>Juste comme il faut 😍</p>
              </div>
              <div className="flex gap-2 text-sm text-gray-600">
                <span className="w-6 h-6 rounded-md bg-yellow-200 mt-1 shrink-0 inline-block"></span>
                <p>
                  J'aurais aimé plus de mode cours (on écoute et on apprend) 😴
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Small Donut Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "L'ambiance durant le cours était",
            data: dataAmbiance,
            legend: [
              { c: "#fbbf24", l: "Sympa" },
              { c: "#ea580c", l: "Moyen" },
            ],
          },
          {
            title: "Le nombre d'heures",
            data: dataHours,
            legend: [
              { c: "#facc15", l: "Bien" },
              { c: "#ea580c", l: "Trop" },
            ],
          },
          {
            title: "Pertinence des infos",
            data: dataRelevance,
            legend: [
              { c: "#facc15", l: "Top" },
              { c: "#ea580c", l: "Nul" },
            ],
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl border flex flex-col items-center"
          >
            <h3
              className="text-sm font-bold text-gray-800 mb-6 w-full text-left truncate"
              title={item.title}
            >
              {item.title}
            </h3>
            <div className="flex gap-6 w-full justify-center">
              {/* PieChart deux fois plus grand */}
              <div className="w-[200px] h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={item.data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      stroke="none"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {item.data.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm space-y-2 text-gray-500">
                {item.legend.map((l, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-md inline-block"
                      style={{ backgroundColor: l.c }}
                    ></span>{" "}
                    {l.l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
