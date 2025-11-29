import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { getFromEndpoint, postToEndpoint } from "../../components/apiService";

export default function Settings() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch current maintenance status
    useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      setLoading(true);
      try {
        const { data } = await getFromEndpoint("getMaintenanceStatus.php");
        setIsMaintenance(data.maintenance);
      } catch (error) {
        console.error("Error fetching maintenance status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceStatus();
  }, []);

  // Toggle maintenance status
  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const newStatus = !isMaintenance;
      setIsMaintenance(newStatus);

      await postToEndpoint("setMaintenanceStatus.php", {
        maintenance: newStatus,
      });

      alert(`Website is now ${newStatus ? "under maintenance" : "live"}!`);
    } catch (error) {
      console.error("Error updating maintenance status:", error);
      alert("Failed to update maintenance status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex justify-center items-start p-6">
        <div className="w-full max-w-md bg-gray-700 text-white rounded-xl shadow-lg p-6 mt-10">
          <h1 className="text-2xl font-bold mb-6 text-center">Settings</h1>

          {/* Maintenance toggle row */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-base leading-none">Maintenance Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isMaintenance}
                onChange={handleToggle}
                className="sr-only peer"
                disabled={loading}
              />
              <div className="w-11 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 transition-all"></div>
              <span className="ml-2 text-sm font-medium">
                {isMaintenance ? "On" : "Off"}
              </span>
            </label>
          </div>

          {/* Loading text */}
          {loading && (
            <p className="text-sm text-gray-300 mt-2 text-center">
              Updating status...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
