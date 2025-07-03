import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

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

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "students"));
      const studentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsData);
    } catch (err) {
      toast.error("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        const studentRef = doc(db, "students", editId);
        await updateDoc(studentRef, newStudent);
        toast.success("Student updated!");
      } else {
        await addDoc(collection(db, "students"), newStudent);
        toast.success("Student added!");
      }
      resetForm();
      fetchStudents();
    } catch (error) {
      toast.error("Failed to save student.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, "students", id));
      toast.success("Student deleted!");
      fetchStudents();
    } catch (error) {
      toast.error("Failed to delete student.");
    } finally {
      setSaving(false);
    }
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

      <div className="mb-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-6">
          {editId ? "Edit Student" : "Add New Student"}
        </h2>
        <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Section"
            className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={newStudent.section}
            onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Grade"
            className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={newStudent.grade}
            onChange={(e) =>
              setNewStudent({ ...newStudent, grade: parseFloat(e.target.value) || 0 })
            }
            required
          />
          <select
            className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              className={`px-6 py-2 rounded-lg text-white font-semibold shadow ${
                saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={saving}
            >
              {saving ? "Saving..." : editId ? "Update Student" : "Add Student"}
            </button>
            {editId && (
              <button
                type="button"
                className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded-lg"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Search & Table */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-2 mb-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg w-full md:w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400">Loading students...</div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700">
          <table className="min-w-full table-auto text-left">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Section</th>
                <th className="px-6 py-3">Grade</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-6 py-3">{student.name}</td>
                    <td className="px-6 py-3">{student.section}</td>
                    <td className="px-6 py-3">{student.grade}</td>
                    <td className="px-6 py-3">{student.status}</td>
                    <td className="px-6 py-3 space-x-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-yellow-600 dark:text-yellow-300 hover:underline"
                        disabled={saving}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 dark:text-red-300 hover:underline"
                        disabled={saving}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-gray-500 dark:text-gray-400 px-6 py-6"
                  >
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
