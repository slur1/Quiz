import { Users, BarChart3, Layers } from "lucide-react";

export default function Ongoing() {
  return (
    <div className="flex flex-col items-center mt-14 bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
        <div className="flex justify-center mb-6">
          <Layers className="w-16 h-16 text-blue-500 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Page in Progress
        </h1>
        <p className="text-gray-600 mb-4">
          This page is currently under development. 🚧
        </p>
        <p className="text-gray-500 text-sm">
          We are working hard to bring this feature to you soon.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
            Go Back
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
