import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Settings = () => {
  const { isDark, setIsDark } = useContext(ThemeContext);
  const [defaultStatus, setDefaultStatus] = useState("Passed");
  const [theme, setTheme] = useState(isDark ? "dark" : "light");

  useEffect(() => {
    // Sync dropdown with actual theme on load
    setTheme(isDark ? "dark" : "light");
  }, [isDark]);

  const handleSave = () => {
    setIsDark(theme === "dark");
    alert("Settings saved (theme applied)");
  };

  return (
    <div className="p-6 ml-64">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-xl shadow space-y-6">
        {/* Theme Selection */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Theme</h2>
          <select
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>

        {/* Default Student Status Filter */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Default Status Filter</h2>
          <select
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
            value={defaultStatus}
            onChange={(e) => setDefaultStatus(e.target.value)}
          >
            <option value="Passed">Passed</option>
            <option value="Conditional">Conditional</option>
            <option value="At Risk">At Risk</option>
          </select>
        </div>

        {/* Save Settings */}
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleSave}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
