import { useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

import { IoIosSettings } from "react-icons/io";
import {
  FaChartBar,
  FaBoxOpen,
  FaDollarSign,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  HiChartBar,
  HiOutlineCalendar,
  HiOutlineTrendingUp,
} from "react-icons/hi";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ---------------- ErrorMessage ----------------
function ErrorMessage({ message }) {
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

// ---------------- WarningsBox ----------------
function WarningsBox({ warnings }) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="bg-gray-800/80 p-5 rounded-2xl shadow-md text-red-300 space-y-2 mt-6">
      <h2 className="text-lg font-bold flex items-center gap-2 text-red-400">
        <ExclamationTriangleIcon className="w-6 h-6" />
        Warnings / Alerts
      </h2>
      <ul className="list-disc list-inside space-y-1">
        {warnings.map((warn, idx) => (
          <li key={idx} className="text-sm leading-relaxed">
            {warn}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------- ForecastChart ----------------
function ForecastChart({ data }) {
  const chartData = Object.entries(data.Forecast).map(([date, value]) => ({
    date,
    forecast: value.forecast,
    lower: value.lower_bound,
    upper: value.upper_bound,
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
            dot={{ r: 4, fill: "#818cf8" }}
          />
          <Line
            type="monotone"
            dataKey="lower"
            stroke="#22c55e"
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="upper"
            stroke="#ef4444"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------------- ForecastTable ----------------
function ForecastTable({ data }) {
  return (
    <div className="overflow-x-auto bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-md">
      <div className="max-h-96 overflow-y-auto scrollbar-hide">
        <table className="min-w-full text-left text-gray-100 border-collapse">
          <thead className="sticky top-0 bg-gray-700/90 z-10">
            <tr>
              <th className="px-4 py-2 border-b border-gray-600">
                <div className="flex items-center gap-2">
                  <HiOutlineCalendar className="text-indigo-400" />
                  <span>Date</span>
                </div>
              </th>
              <th className="px-4 py-2 border-b border-gray-600">
                <div className="flex items-center gap-2">
                  <HiOutlineTrendingUp className="text-indigo-400" />
                  <span>Forecast</span>
                </div>
              </th>
              <th className="px-4 py-2 border-b border-gray-600">
                Lower Bound
              </th>
              <th className="px-4 py-2 border-b border-gray-600">
                Upper Bound
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.Forecast).map(([date, value]) => (
              <tr key={date} className="hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-2 border-b border-gray-600">{date}</td>
                <td className="px-4 py-2 border-b border-gray-600 font-semibold">
                  {value.forecast}
                </td>
                <td className="px-4 py-2 border-b border-gray-600 text-green-400">
                  {value.lower_bound}
                </td>
                <td className="px-4 py-2 border-b border-gray-600 text-red-400">
                  {value.upper_bound}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------- ForecastMetrics ----------------
function ForecastMetrics({ data }) {
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

// ---------------- ForecastForm ----------------
function ForecastForm({ filters, setFilters, onSubmit, loading }) {
  const [openSection, setOpenSection] = useState({
    productInfo: true,
    pricing: false,
    other: false,
  });

  const VALID_REGIONS = ["North", "South", "East", "West"];

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSection = (section) => {
    setOpenSection((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const Section = ({ title, icon, section, children }) => (
    <div className="bg-slate-900/80 p-4 rounded-xl shadow">
      <div
        className="flex justify-between items-center cursor-pointer select-none"
        onClick={() => toggleSection(section)}
      >
        <h2 className="font-semibold text-lg flex items-center gap-2">
          {icon} {title}
        </h2>
        <motion.span
          animate={{ rotate: openSection[section] ? 45 : 0 }}
          className="text-xl block transition-transform"
        >
          +
        </motion.span>
      </div>
      {openSection[section] && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <Section title="Product Info" icon={<FaBoxOpen />} section="productInfo">
        <div>
          <label className="block mb-1 font-semibold">Forecast Days</label>
          <input
            type="number"
            min={1}
            value={filters.days}
            onChange={(e) => handleChange("days", Number(e.target.value))}
            className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-gray-100"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Product ID</label>
          <input
            type="text"
            value={filters.productId}
            onChange={(e) => handleChange("productId", e.target.value)}
            placeholder="e.g. P017, P018"
            className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-gray-100"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Category</label>
          <input
            type="text"
            value={filters.category}
            onChange={(e) => handleChange("category", e.target.value)}
            placeholder="e.g. A, B, C"
            className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-gray-100"
          />
        </div>
      </Section>

      <Section
        title="Pricing & Discount"
        icon={<FaDollarSign />}
        section="pricing"
      >
        <div>
          <label className="block mb-1 font-semibold">Max Price</label>
          <input
            type="number"
            min={0}
            value={filters.maxPrice}
            onChange={(e) => handleChange("maxPrice", Number(e.target.value))}
            className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-gray-100"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Min Discount%</label>
          <input
            type="number"
            min={0}
            max={100}
            value={filters.minDiscount}
            onChange={(e) =>
              handleChange("minDiscount", Number(e.target.value))
            }
            className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-gray-100"
          />
        </div>
      </Section>

      <Section
        title="Region & Rating"
        icon={<FaMapMarkerAlt />}
        section="other"
      >
        <div>
          <label className="block mb-1 font-semibold">Region</label>
          <select
            value={filters.region}
            onChange={(e) => handleChange("region", e.target.value)}
            className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-gray-100"
          >
            {VALID_REGIONS.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Min Rating</label>
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={filters.minRating}
            onChange={(e) => handleChange("minRating", Number(e.target.value))}
            className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-gray-100"
          />
        </div>
      </Section>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onSubmit}
        disabled={loading}
        className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition disabled:opacity-60"
      >
        {loading ? "Loading..." : "Get Forecast"}
      </motion.button>
    </div>
  );
}

// ---------------- Main App ----------------
export default function App() {
  const [filters, setFilters] = useState({
    days: 7,
    productId: "P017",
    category: "A",
    region: "North",
    minRating: 4,
    maxPrice: 100,
    minDiscount: 5,
  });

  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchForecast = async () => {
    setLoading(true);
    setError("");
    setForecastData(null);
    try {
      const response = await axios.post(`${API_BASE_URL}`, {
        days: filters.days,
        product_id: filters.productId,
        category: filters.category,
        region: filters.region,
        min_rating: filters.minRating,
        max_price: filters.maxPrice,
        min_discount: filters.minDiscount,
      });
      setForecastData(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetch forecast.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-80 p-6 bg-gray-800/90 backdrop-blur-md border-b md:border-b-0 md:border-r border-gray-700 flex-shrink-0">
        <h1 className="text-2xl font-bold mb-6 border-b border-gray-700 flex items-center gap-2">
          <IoIosSettings className="text-indigo-500" />
          Filters
        </h1>
        <ForecastForm
          filters={filters}
          setFilters={setFilters}
          onSubmit={fetchForecast}
          loading={loading}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        {error && <ErrorMessage message={error} />}

        {loading && (
          <div className="flex flex-col items-center justify-center bg-gray-800/80 p-8 rounded-2xl shadow-md text-gray-300">
            <svg
              className="animate-spin h-12 w-12 mb-4 text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <p className="text-lg font-medium">Fetching forecast...</p>
          </div>
        )}

        {!forecastData && !loading && !error && (
          <div className="bg-gray-800/80 p-8 rounded-2xl shadow text-gray-300 text-center flex items-center justify-center gap-2">
            <FaChartBar className="text-indigo-500 w-6 h-6" />
            <p className="text-lg">
              Enter your filters and click <strong>Get Forecast</strong> to view
              results.
            </p>
          </div>
        )}

        {forecastData && !loading && (
          <div className="space-y-6">
            <ForecastMetrics data={forecastData} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ForecastTable data={forecastData} />
              <ForecastChart data={forecastData} />
            </div>
            {/* ✅ Show Warnings */}
            <WarningsBox warnings={forecastData.Warnings} />
          </div>
        )}
      </main>
    </div>
  );
}
