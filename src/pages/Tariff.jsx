import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaBoxOpen, FaDollarSign } from "react-icons/fa";
import { HiChartBar } from "react-icons/hi";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

// ---------------- ErrorMessage ----------------
function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 text-red-400 bg-red-900/30 border border-red-700 p-3 rounded-xl shadow-md"
    >
      <ExclamationTriangleIcon className="w-6 h-6" />
      <span className="font-medium">{message}</span>
    </motion.div>
  );
}

// ---------------- ImpactForm ----------------
function ImpactForm({ filters, setFilters, onSubmit, loading }) {
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900/80 p-4 rounded-xl shadow">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <FaBoxOpen /> Product Info
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-1 font-semibold">Product ID</label>
            <input
              type="text"
              value={filters.productId}
              onChange={(e) => handleChange("productId", e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-gray-100"
              placeholder="e.g. P001"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Category</label>
            <input
              type="text"
              value={filters.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-gray-100"
              placeholder="e.g. Electronics"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Tariff %</label>
            <input
              type="number"
              value={filters.tariffPercentage}
              onChange={(e) =>
                handleChange("tariffPercentage", Number(e.target.value))
              }
              className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-gray-100"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition disabled:opacity-60"
      >
        {loading ? "Loading..." : "Analyze Tariff Impact"}
      </button>
    </div>
  );
}

// ---------------- ImpactMetrics ----------------
function ImpactMetrics({ data }) {
  if (!data) return null;

  const metrics = [
    {
      label: "Current Avg Price",
      value: `$${data.current_metrics.average_price}`,
    },
    {
      label: "Projected Price",
      value: `$${data.projected_impact.estimated_new_price}`,
    },
    { label: "Current Avg Sales", value: data.current_metrics.average_sales },
    {
      label: "Projected Sales",
      value: data.projected_impact.projected_daily_sales,
    },
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
          <p className="text-xl font-bold">{metric.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ---------------- ImpactChart ----------------
function ImpactChart({ data }) {
  if (!data) return null;

  const chartData = [
    {
      name: "Price",
      Current: data.current_metrics.average_price,
      Projected: data.projected_impact.estimated_new_price,
    },
    {
      name: "Sales",
      Current: data.current_metrics.average_sales,
      Projected: data.projected_impact.projected_daily_sales,
    },
  ];

  return (
    <div className="bg-gray-800/80 backdrop-blur-md p-5 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <HiChartBar className="text-indigo-500" />
        Impact Chart
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData}>
          <CartesianGrid stroke="#444" strokeDasharray="4 4" />
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              borderRadius: "8px",
              border: "1px solid #374151",
            }}
          />
          <Bar dataKey="Current" fill="#22c55e" />
          <Bar dataKey="Projected" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------------- RecommendationsBox ----------------
function RecommendationsBox({ data }) {
  if (!data) return null;

  return (
    <div className="bg-slate-800/80 p-6 rounded-2xl shadow-md space-y-3">
      <h2 className="text-lg font-bold text-indigo-400">Recommendations</h2>
      <p className="text-sm text-gray-300 whitespace-pre-line">
        {data.ai_analysis}
      </p>
      <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
        {data.action_items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

// ---------------- Main App ----------------
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";

export default function Tariff() {
  const [filters, setFilters] = useState({
    productId: "P001",
    category: "Electronics",
    tariffPercentage: 15,
  });

  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchImpact = async () => {
    setLoading(true);
    setError("");
    setImpact(null);
    try {
      const { data } = await axios.post(
        "https://tariff-impact-api.onrender.com/analyze-tariff",
        {
          product_id: filters.productId,
          category: filters.category,
          tariff_percentage: filters.tariffPercentage,
        }
      );
      setImpact(data);
    } catch (err) {
      setError("Failed to fetch impact analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-80 p-6 bg-gray-800/90 backdrop-blur-md border-b md:border-b-0 md:border-r border-gray-700 flex-shrink-0">
        <h1 className="text-2xl font-bold mb-6">Tariff Impact Filters</h1>
        <ImpactForm
          filters={filters}
          setFilters={setFilters}
          onSubmit={fetchImpact}
          loading={loading}
        />
          <Link to={"/"}>
      <motion.button 
        whileTap={{ scale: 0.95 }}
        className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 mt-3 rounded-xl font-semibold transition disabled:opacity-60"
      >
       Forecast
      </motion.button>
      </Link>
      </aside>
      

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        {error && <ErrorMessage message={error} />}

        {loading && (
          <div className="flex flex-col items-center justify-center bg-gray-800/80 p-8 rounded-2xl shadow-md text-gray-300">
            <p className="text-lg font-medium">Analyzing tariff impact...</p>
          </div>
        )}

        {!impact && !loading && !error && (
          <div className="bg-gray-800/80 p-8 rounded-2xl shadow text-gray-300 text-center">
            Enter details and click <strong>Analyze Tariff Impact</strong> to
            view results.
          </div>
        )}

        {impact && !loading && (
          <div className="space-y-6">
            <ImpactMetrics data={impact} />
            <ImpactChart data={impact} />
            <RecommendationsBox data={impact.recommendations} />
          </div>
        )}
      </main>
    </div>
  );
}
