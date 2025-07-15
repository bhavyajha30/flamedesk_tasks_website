import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Flame, LogOut, Settings } from "lucide-react";

function Navbar({ user = {}, onLogout }) {
  const menuref = useRef(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuref.current && !menuref.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleLogout = () => {
    setMenuOpen(false);
    onLogout();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-bold border-gray-200 shadow-sm font-sans">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto ">
        {/* Left Side */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => useNavigate("/")}
        >
          {/* Logo */}
          <div className="relative h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 shadow-lg group-hover:shadow-purple-300/50 group-hover:scale-105 transition-all duration-300">
            <img className="h-7 w-7 object-contain" src="Images/Logo.png" alt="Logo" />
            <div className="absolute -bottom-1 -middle-1 w-3 h-3 rounded-full bg-white shadow-md animate-ping" />
          </div>

          {/* Brand Name */}
          <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent tracking-wide">
            FlameDesk
          </span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 text-gray-600 hover:text-purple-500 hover:bg-purple-50 transition-colors duration-300 rounded-full"
            onClick={() => navigate("/profile")}
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Dropdown */}
          <div ref={menuref} className="relative">
            <button
              onClick={handleMenuToggle}
              className=" flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer hover:bg-purple-50 transition-colors duration-300 border broder-transparent hover:border-purple-200"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className=" w-9 h-9 rounded-full shadow-sm"
                />
              ) : (
                <div className="relative h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white font-semibold shadow-md">
                  {user.name?.[0]?.toUpperCase || "U"}
                  <div className="absolute h-3 w-3 -bottom-0.5 -right-0.5 rounded-full bg-green-500 border-2 border-white animatie-pusle " />
                </div>
              )}

              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs font-normal text-gray-500">
                  {user.email}
                </p>
              </div>

              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <ul className="absolute  bg-purple-50 top-14 right-0 w-56 rounded-2xl shadow-xl border border-purple-100 z-50 overflow-hidden animate-fadeIn">
                <li className="p-2">
                  <button
                    className="w-full py-2.5 px-4 text-left hover:bg-purple-50 text-sm text-gray-700 transition-colors flex items gap-2 group"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false), navigate("/profile");
                    }}
                  >
                    <Settings className="w-4 h-4 text-gray-700" />
                    Profile Setting
                  </button>
                </li>

                <li className="p-2">
                  <button
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-red-50 text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
