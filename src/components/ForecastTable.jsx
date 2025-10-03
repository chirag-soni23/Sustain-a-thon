import { HiOutlineCalendar, HiOutlineTrendingUp } from "react-icons/hi";

export default function ForecastTable({ data }) {
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
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.Forecast).map(([date, value]) => (
              <tr key={date} className="hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-2 border-b border-gray-600">{date}</td>
                <td className="px-4 py-2 border-b border-gray-600 font-semibold">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
