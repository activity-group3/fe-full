import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet, NavLink } from "react-router-dom";
import {
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaCalendar,
  FaUsers,
  FaBuilding,
  FaPlus,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaInfoCircle,
  FaChartBar,
  FaBell,
  FaUserCircle,
  FaUserCog,
} from "react-icons/fa";
import NotificationDropdown from "../../components/NotificationDropdown";
import AccountManagementModal from "../../components/AccountManagementModal";

interface User {  
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ORGANIZATION" | "STUDENT";
  organization_name?: string;
}

interface NavigationItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}

const OrganizationLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);
  const [accountModalOpen, setAccountModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/auth/login");
      return;
    }
    const user: User = JSON.parse(userData);
    if (user.role !== "ORGANIZATION") {
      navigate("/dashboard");
      return;
    }
    setUser(user);
  }, [navigate]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleLogout = (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  const toggleMobileSidebar = (): void => setIsMobileOpen(!isMobileOpen);
  const toggleProfileMenu = (): void => setProfileMenuOpen(!profileMenuOpen);

  const navigationItems: NavigationItem[] = [
    {
      path: "/organization/activities",
      icon: <FaCalendar /> as React.ReactNode,
      label: "Activities",
      end: true
    },
    {
      path: "/organization/activities/create",
      icon: <FaPlus /> as React.ReactNode,
      label: "Create Activity"
    },
    {
      path: "/organization/analysis",
      icon: <FaChartBar /> as React.ReactNode,
      label: "Analysis"
    },
    {
      path: `/organization/${user?.id}/information`,
      icon: <FaInfoCircle /> as React.ReactNode,
      label: "Organization Info"
    }
  ];

  return (
    <>
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 p-2 rounded-md shadow-md"
      >
        {isMobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Top Header - Transparent with only bell and user */}
        <div className="fixed top-0 right-0 z-50 h-16 flex items-center justify-end pr-4">
          <div className="flex items-center space-x-4">
            {/* Notification Dropdown */}
            <div className="relative">
              <NotificationDropdown />
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center text-white hover:text-gray-200 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.organization_name?.charAt(0) || "O"}
                </div>
                <span className="ml-2 font-medium hidden lg:block">{user?.organization_name || "Organization"}</span>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      setAccountModalOpen(true);
                      setProfileMenuOpen(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaUserCog className="mr-2" />
                    <span>Account Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaSignOutAlt className="mr-2" />
                    <span>Logout</span>
                  </button>
                  <button
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {theme === "light" ? <FaMoon className="mr-2" /> : <FaSun className="mr-2" />}
                    <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside
          className={`${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0 fixed md:relative z-50 transition-all duration-300 
            w-64 h-screen bg-white dark:bg-slate-800 shadow-lg flex-none`}
        >
          <div className="flex flex-col h-full">
            {/* Profile Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  <FaBuilding className="inline-block mr-2" />
                  Organization
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {user?.organization_name || "Organization Name"}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-blue-500 text-white"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                        }`
                      }
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="ml-3">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center justify-between mb-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                  <span className="ml-5">Logout</span>
                </button>
                <button
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="flex items-center w-full px-4 py-2 mt-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  {theme === "light" ? (
                    <FaMoon className="w-5 h-5" />
                  ) : (
                    <FaSun className="w-5 h-5" />
                  )}
                  <span className="ml-5">
                    {theme === "light" ? "Dark Mode" : "Light Mode"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden mt-16 md:mt-0">
          <div className="md:hidden flex items-center justify-between pb-4">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Organization</h1>
            <div className="flex items-center space-x-3">
              <NotificationDropdown />
              <button
                onClick={toggleProfileMenu}
                className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white"
              >
                {user?.organization_name?.charAt(0) || "O"}
              </button>
              {profileMenuOpen && (
                <div className="absolute right-4 top-16 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      setAccountModalOpen(true);
                      setProfileMenuOpen(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaUserCog className="mr-2" />
                    <span>Account Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaSignOutAlt className="mr-2" />
                    <span>Logout</span>
                  </button>
                  <button
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {theme === "light" ? <FaMoon className="mr-2" /> : <FaSun className="mr-2" />}
                    <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="p-6 w-full max-w-full">
            <div className="w-full max-w-full break-words">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Account Management Modal */}
      <AccountManagementModal
        open={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />
    </>
  );
};

export default OrganizationLayout; 
 