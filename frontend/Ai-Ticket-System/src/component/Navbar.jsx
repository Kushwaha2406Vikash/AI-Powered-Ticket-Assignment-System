import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { apiRequest } from "../utils/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (storedToken) {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
      } catch (e) {
        console.error("Invalid user data in localStorage");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#2E3A47] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link
              to="/tickets"
              className="text-2xl font-bold text-blue-400 hover:text-blue-600 transition duration-300"
            >
              🎫 Ticket AI
            </Link>
          </div>

          {/* Nav Buttons */}
          <div className="flex items-center gap-4">
            {!token ? (
              <>
                <Link
                  to="/signup"
                  className="bg-transparent border border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white font-medium py-1 px-4 rounded transition duration-300"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-4 rounded transition duration-300"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm font-medium text-gray-300 hidden sm:block">
                  Hi, {user?.email}
                </span>

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-1 px-4 rounded transition duration-300"
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-4 rounded transition duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
