import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const dataGlobal = [
  { date: "28 jan 2025", value: 10 },
  { date: "29 jan 2025", value: 12 },
  { date: "30 jan 2025", value: 12 },
  { date: "1 fév 2025", value: 15 },
  { date: "2 fév 2025", value: 20 },
];

const dataSatisfaction = [
  { date: "28 jan 2025", value: 50 },
  { date: "29 jan 2025", value: 60 },
  { date: "30 jan 2025", value: 25 },
  { date: "1 fév 2025", value: 75 },
  { date: "2 fév 2025", value: 100 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border p-2 rounded">
        <p className="text-xs font-medium text-gray-900">{label}</p>
        <p className="text-xs text-orange-600">Val: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const RechartsLineChart = ({
  data,
  suffix = "",
}: {
  data: any[];
  suffix?: string;
}) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f3f4f6"
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            dy={10}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#d1d5db" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}${suffix}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#ea580c"
            strokeWidth={2}
            dot={{ fill: "#ea580c", r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function TimeRecapSection() {
  return (
    <div className="space-y-6">
      {/* Section Title & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">Récap' temporel</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-sm font-bold text-gray-800 mb-4">
            Globalement vous avez trouvé ce cours
          </h3>
          <RechartsLineChart data={dataGlobal} />
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-sm font-bold text-gray-800 mb-4">
            Évolution de la satisfaction moyenne
          </h3>
          <RechartsLineChart data={dataSatisfaction} suffix="%" />
        </div>
      </div>
    </div>
  );
}
