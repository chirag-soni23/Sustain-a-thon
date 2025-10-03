import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export default function WarningsBox({ warnings }) {
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
