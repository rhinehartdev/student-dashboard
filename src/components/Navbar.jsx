const Navbar = () => {
  return (
    <div className="sticky top-0 bg-white shadow px-6 py-4 flex justify-between items-center z-10">
      <h2 className="text-xl font-semibold text-gray-800">Student Performance Dashboard</h2>
      <div className="text-sm text-gray-500">Welcome, Admin</div>
    </div>
  );
};

export default Navbar;
