import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Students", path: "/students" },
    { name: "Reports", path: "/reports" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="fixed top-0 left-0 h-full w-64 
                bg-white dark:bg-gray-900 
                text-gray-800 dark:text-white 
                border-r border-gray-200 dark:border-gray-700 
                shadow-sm dark:shadow-md 
                transition-all duration-500 ease-in-out">
      <aside className="p-6">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-10">
          🎓 Dashboard
        </h1>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-4 py-2 rounded-lg text-md font-medium transition-all ${
                location.pathname === item.path
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
