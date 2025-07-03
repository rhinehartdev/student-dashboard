import { useEffect, useState, useContext } from "react";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../context/ThemeContext";
import {
  collection,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase";

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [statusFilter, setStatusFilter] = useState("All");
  const [sectionFilter, setSectionFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const { isDark } = useContext(ThemeContext);

  const gradeRanges = [
    { label: "All Grades", value: "All" },
    { label: "90–100", value: "90-100" },
    { label: "85–89", value: "85-89" },
    { label: "75–84", value: "75-84" },
    { label: "Below 75", value: "0-74" },
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "students"));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStudents(data);
      } catch (err) {
        toast.error("Failed to load student data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const filteredList = students.filter((s) => {
      const grade = parseFloat(s.grade);
      let matchesGrade = true;

      if (gradeFilter !== "All") {
        const [min, max] = gradeFilter.split("-").map(Number);
        matchesGrade = grade >= min && grade <= max;
      }

      return (
        (statusFilter === "All" || s.status === statusFilter) &&
        (sectionFilter === "All" || s.section === sectionFilter) &&
        matchesGrade
      );
    });
    setFiltered(filteredList);
  }, [students, statusFilter, sectionFilter, gradeFilter]);

  const handleExport = () => {
    try {
      setExporting(true);
      const worksheet = XLSX.utils.json_to_sheet(filtered);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "StudentReports");
      XLSX.writeFile(workbook, "StudentReports.xlsx");
      toast.success("Exported to Excel!");
    } catch (err) {
      toast.error("Export failed.");
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const uniqueSections = [...new Set(students.map((s) => s.section))];

  return (
    <div className="p-6 ml-64 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <ToastContainer theme={isDark ? "dark" : "light"} />
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight">Reports</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-8">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="All">All Statuses</option>
          <option value="Passed">Passed</option>
          <option value="Conditional">Conditional</option>
          <option value="At Risk">At Risk</option>
        </select>

        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="All">All Sections</option>
          {uniqueSections.map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>

        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 transition"
        >
          {gradeRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleExport}
          disabled={exporting}
          className={`ml-auto px-6 py-2 rounded-lg text-white font-semibold shadow transition-all duration-150 ${
            exporting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400"
          }`}
        >
          {exporting ? "Exporting..." : "Export to Excel"}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></span>
          <span className="ml-4 text-gray-500 dark:text-gray-400 text-lg">
            Loading...
          </span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700">
          <table className="min-w-full table-auto text-left">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">ID</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Name</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Section</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Grade</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-3">{s.id}</td>
                    <td className="px-6 py-3 font-medium">{s.name}</td>
                    <td className="px-6 py-3">{s.section}</td>
                    <td className="px-6 py-3">{s.grade}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`flex items-center gap-1 px-3 py-1 text-sm rounded-full font-semibold shadow-sm ${
                          s.status === "Passed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : s.status === "Conditional"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {s.status === "Passed" && <span className="text-lg">✅</span>}
                        {s.status === "Conditional" && <span className="text-lg">⏳</span>}
                        {s.status === "At Risk" && <span className="text-lg">⚠️</span>}
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-6 text-center text-gray-500 dark:text-gray-400">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
