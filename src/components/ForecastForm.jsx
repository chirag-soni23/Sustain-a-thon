import { useState } from "react";
import { motion } from "framer-motion";
import { FaBoxOpen, FaDollarSign, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ForecastForm({
  filters,
  setFilters,
  onSubmit,
  loading,
}) {
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
      <Link to={"/tariff"}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition disabled:opacity-60"
        >
          Tarrif
        </motion.button>
      </Link>
    </div>
  );
}
