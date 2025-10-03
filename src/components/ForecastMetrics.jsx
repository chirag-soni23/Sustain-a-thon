import { motion } from "framer-motion";

export default function ForecastMetrics({ data }) {
  const metrics = [
    { label: "Reorder Point", value: data["Reorder Point"] },
    { label: "Safety Stock", value: data["Safety Stock"] },
    { label: "Min Level", value: data["Minimum Level"] },
    { label: "Max Level", value: data["Maximum Level"] },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-4 rounded-2xl shadow-md hover:scale-105 transition-transform"
        >
          <p className="text-sm opacity-80">{metric.label}</p>
          <p className="text-2xl font-bold">{metric.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
