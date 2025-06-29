import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const { isDark } = useContext(ThemeContext);

  const [newStudent, setNewStudent] = useState({
    name: "",
    section: "",
    grade: "",
    status: "Passed",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    setLoading(true);
    axios
      .get("http://localhost:3001/students")
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to fetch students.");
        setLoading(false);
      });
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    setSaving(true);

    const url = editId
      ? `http://localhost:3001/students/${editId}`
      : "http://localhost:3001/students";
    const method = editId ? "put" : "post";

    axios[method](url, newStudent)
      .then(() => {
        toast.success(editId ? "Student updated!" : "Student added!");
        resetForm();
        fetchStudents();
      })
      .catch(() => {
        toast.error("Failed to save student.");
      })
      .finally(() => setSaving(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    setSaving(true);
    axios
      .delete(`http://localhost:3001/students/${id}`)
      .then(() => {
        toast.success("Student deleted!");
        fetchStudents();
      })
      .catch(() => toast.error("Failed to delete student."))
      .finally(() => setSaving(false));
  };

  const handleEdit = (student) => {
    setEditId(student.id);
    setNewStudent({
      name: student.name,
      section: student.section,
      grade: student.grade,
      status: student.status,
    });
  };

  const resetForm = () => {
    setEditId(null);
    setNewStudent({ name: "", section: "", grade: "", status: "Passed" });
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 ml-64 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <ToastContainer theme={isDark ? "dark" : "light"} />

      <h1 className="text-3xl font-extrabold mb-8 tracking-tight">Students</h1>

      {/* Form */}
      <div className="mb-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-6">
          {editId ? "Edit Student" : "Add New Student"}
        </h2>
        <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-400 transition"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Section"
            className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-400 transition"
            value={newStudent.section}
            onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Grade"
            className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-400 transition"
            value={newStudent.grade}
            onChange={(e) =>
              setNewStudent({ ...newStudent, grade: parseFloat(e.target.value) || 0 })
            }
            required
          />
          <select
            className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-400 transition"
            value={newStudent.status}
            onChange={(e) => setNewStudent({ ...newStudent, status: e.target.value })}
          >
            <option value="Passed">Passed</option>
            <option value="Conditional">Conditional</option>
            <option value="At Risk">At Risk</option>
          </select>

          <div className="md:col-span-4 flex gap-3 mt-4">
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg text-white font-semibold shadow transition-all duration-150 ${
                saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
              }`}
              disabled={saving}
            >
              {saving ? "Saving..." : editId ? "Update Student" : "Add Student"}
            </button>
            {editId && (
              <button
                type="button"
                className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 font-semibold shadow transition-all duration-150"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Search & Legend */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg shadow-sm w-full md:w-80 focus:ring-2 focus:ring-blue-400 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-3">
          <span className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 font-semibold shadow-sm">
            <span className="text-lg">✅</span> Passed
          </span>
          <span className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 font-semibold shadow-sm">
            <span className="text-lg">⏳</span> Conditional
          </span>
          <span className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 font-semibold shadow-sm">
            <span className="text-lg">⚠️</span> At Risk
          </span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></span>
          <span className="ml-4 text-gray-500 dark:text-gray-400 text-lg">Loading students...</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700">
          <table className="min-w-full table-auto text-left">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">#</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Name</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Section</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Grade</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, idx) => (
                  <tr
                    key={student.id}
                    className="border-t border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-3">{student.id}</td>
                    <td className="px-6 py-3 font-medium">{student.name}</td>
                    <td className="px-6 py-3">{student.section}</td>
                    <td className="px-6 py-3">{student.grade}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`flex items-center gap-1 px-3 py-1 text-sm rounded-full font-semibold shadow-sm ${
                          student.status === "Passed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : student.status === "Conditional"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {student.status === "Passed" && <span className="text-lg">✅</span>}
                        {student.status === "Conditional" && <span className="text-lg">⏳</span>}
                        {student.status === "At Risk" && <span className="text-lg">⚠️</span>}
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-yellow-600 dark:text-yellow-300 hover:underline mr-3 font-semibold"
                        disabled={saving}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 dark:text-red-300 hover:underline font-semibold"
                        disabled={saving}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-gray-500 dark:text-gray-400">
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

export default Students;
