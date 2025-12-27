import React from "react";
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

const dataClarity = [
  { name: "1", value: 3 },
  { name: "2", value: 0 },
  { name: "3", value: 5 },
  { name: "4", value: 4 },
  { name: "5", value: 10 },
];

const dataSpeed = [
  { name: "Lent", value: 10, color: "#f97316" },
  { name: "Juste", value: 65, color: "#fefce8" }, // Lightest
  { name: "Rapide", value: 25, color: "#eab308" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white text-xs px-2 py-1 rounded opacity-90">
        {payload[0].value} votes
      </div>
    );
  }
  return null;
};

export default function InstructorFeedbackSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">L'intervenant</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-800">
              La clarté des informations et des notions
            </h3>
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <span className="w-6 h-6 rounded-lg bg-orange-500 inline-block"></span>{" "}
              Clarté
            </span>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataClarity} barSize={80}>
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
                <Bar dataKey="value" fill="#eab308" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border">
          <h3 className="text-sm font-bold text-gray-800 mb-6">
            Niveau vitesse
          </h3>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <div className="w-[320px] h-[320px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataSpeed}
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
                    {dataSpeed.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-6 h-6 rounded-lg bg-yellow-100 inline-block"></span>
                Juste comme il faut 😍
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-6 h-6 rounded-lg bg-orange-500 inline-block"></span>
                Trop lent 🐢
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-6 h-6 rounded-lg bg-yellow-500 inline-block"></span>
                Trop rapide 🚀
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
