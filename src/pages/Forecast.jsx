import { useState } from "react";
import axios from "axios";
import { IoIosSettings } from "react-icons/io";
import { FaChartBar } from "react-icons/fa";

import ErrorMessage from "../components/ErrorMessage";
import WarningsBox from "../components/WarningBox";
import ForecastChart from "../components/ForecastChart";
import ForecastTable from "../components/ForecastTable";
import ForecastMetrics from "../components/ForecastMetrics";
import ForecastForm from "../components/ForecastForm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Forecast() {
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
        <ForecastForm filters={filters} setFilters={setFilters} onSubmit={fetchForecast} loading={loading} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        {error && <ErrorMessage message={error} />}

        {loading && (
          <div className="flex flex-col items-center justify-center bg-gray-800/80 p-8 rounded-2xl shadow-md text-gray-300">
            <svg className="animate-spin h-12 w-12 mb-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <p className="text-lg font-medium">Fetching forecast...</p>
          </div>
        )}

        {!forecastData && !loading && !error && (
          <div className="bg-gray-800/80 p-8 rounded-2xl shadow text-gray-300 text-center flex items-center justify-center gap-2">
            <FaChartBar className="text-indigo-500 w-6 h-6" />
            <p className="text-lg">
              Enter your filters and click <strong>Get Forecast</strong> to view results.
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
            <WarningsBox warnings={forecastData.Warnings} />
          </div>
        )}
      </main>
    </div>
  );
}
