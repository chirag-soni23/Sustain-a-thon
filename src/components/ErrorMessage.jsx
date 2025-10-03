import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export default function ErrorMessage({ message }) {
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
