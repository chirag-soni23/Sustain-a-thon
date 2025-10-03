import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { HiChartBar } from "react-icons/hi";

export default function ForecastChart({ data }) {
  const chartData = Object.entries(data.Forecast).map(([date, value]) => ({
    date,
    forecast: value,
  }));

  return (
    <div className="bg-gray-800/80 backdrop-blur-md p-5 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <HiChartBar className="text-indigo-500" />
        Forecast Chart
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#444" strokeDasharray="4 4" />
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              borderRadius: "8px",
              border: "1px solid #374151",
            }}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ r: 5, fill: "#818cf8" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
