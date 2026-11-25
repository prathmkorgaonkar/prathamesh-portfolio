
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Projects", path: "/admin/projects", icon: "📁" },
    { name: "Skills", path: "/admin/skills", icon: "💻" },
    { name: "Experience", path: "/admin/experience", icon: "💼" },
    { name: "Contacts", path: "/admin/contacts", icon: "✉️" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setMenuOpen(false);
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Mobile Header */}
      <div className="flex items-center justify-between bg-white p-4 shadow-sm dark:bg-gray-900 lg:hidden">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Portfolio Admin
        </h2>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg bg-gray-100 px-3 py-2 text-gray-900 dark:bg-gray-800 dark:text-white"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        {menuOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          />
        )}
        <aside
          className={`${menuOpen ? "block" : "hidden"
            } fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg dark:bg-gray-900 lg:static lg:block`}
        >
          <div className="border-b border-gray-200 p-6 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Portfolio Admin
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Management Panel
            </p>
          </div>

          <nav className="space-y-2 p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`
                }
              >
                <span>{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="absolute bottom-0 w-full border-t border-gray-200 p-4 dark:border-gray-800 lg:static lg:mt-8">
            <button
              onClick={handleLogout}
              className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
