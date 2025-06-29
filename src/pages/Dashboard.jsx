import { useEffect, useState, useContext } from "react";
import axios from "axios";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ThemeContext } from "../context/ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const { isDark } = useContext(ThemeContext);

  useEffect(() => {
    axios
      .get("http://localhost:3001/students")
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to fetch students.");
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const total = students.length;
  const passed = students.filter((s) => s.status === "Passed").length;
  const conditional = students.filter((s) => s.status === "Conditional").length;
  const atRisk = students.filter((s) => s.status === "At Risk").length;

  const averageGrade =
    total > 0
      ? (
          students.reduce((sum, s) => sum + parseFloat(s.grade), 0) / total
        ).toFixed(2)
      : 0;

  const cards = [
    {
      title: "Total Students",
      value: total,
      color: "bg-blue-100 dark:bg-blue-900",
      text: "text-blue-600 dark:text-blue-300",
    },
    {
      title: "Average Grade",
      value: averageGrade,
      color: "bg-green-100 dark:bg-green-900",
      text: "text-green-600 dark:text-green-300",
    },
    {
      title: "At Risk",
      value: atRisk,
      color: "bg-red-100 dark:bg-red-900",
      text: "text-red-600 dark:text-red-300",
    },
    {
      title: "Passed",
      value: passed,
      color: "bg-emerald-100 dark:bg-emerald-900",
      text: "text-emerald-600 dark:text-emerald-300",
    },
    {
      title: "Conditional",
      value: conditional,
      color: "bg-yellow-100 dark:bg-yellow-900",
      text: "text-yellow-600 dark:text-yellow-300",
    },
  ];

  const chartData = [
    { status: "Passed", count: passed },
    { status: "Conditional", count: conditional },
    { status: "At Risk", count: atRisk },
  ];

  return (
    <div className="p-6 ml-64 text-gray-900 dark:text-white">
      <ToastContainer theme={isDark ? "dark" : "light"} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Overview</h1>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentTime.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {cards.map((card) => (
              <div
                key={card.title}
                className={`p-6 rounded-xl shadow ${card.color} hover:shadow-lg transition`}
              >
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                  {card.title}
                </h2>
                <p className={`text-3xl font-bold ${card.text}`}>
                  <CountUp
                    end={parseFloat(card.value)}
                    duration={1.2}
                    decimals={card.title === "Average Grade" ? 2 : 0}
                  />
                </p>
              </div>
            ))}
          </div>

          {/* 📊 Bar Chart */}
          <div className="bg-white dark:bg-[#1f2937] p-8 rounded-2xl shadow-xl transition-all duration-300 ease-in-out">
            <h2 className="text-base font-semibold text-gray-600 dark:text-gray-200 mb-4">Students by Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid stroke={isDark ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="status" stroke={isDark ? "#ccc" : "#333"} />
                <YAxis allowDecimals={false} stroke={isDark ? "#ccc" : "#333"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#333" : "#fff",
                    borderColor: "#888",
                  }}
                  labelStyle={{ color: isDark ? "#eee" : "#111" }}
                  itemStyle={{ color: isDark ? "#eee" : "#111" }}
                />
                <Bar
                  dataKey="count"
                  fill={isDark ? "#60A5FA" : "#3B82F6"}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
