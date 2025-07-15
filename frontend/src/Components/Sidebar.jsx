import {
  CheckCircle2,
  Home,
  Lightbulb,
  ListChecks,
  Menu,
  Sparkles,
  TrophyIcon,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ user, tasks }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: "Dashboard", path: "/", icon: <Home className="w-8 h-8 sm:w-5 sm:h-5" /> },
    { text: "Pending Tasks", path: "/pending", icon: <ListChecks className="w-8 h-8 sm:w-5 sm:h-5" /> },
    { text: "Completed Tasks", path: "/complete", icon: <CheckCircle2 className="w-8 h-8 sm:w-5 sm:h-5" /> },
    { text: "Challenges", path: "/challenges", icon: <TrophyIcon className="w-8 h-8 sm:w-5 sm:h-5" /> },
  ];

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.completed).length || 0;
  const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const username = user?.name || "user";
  const initial = username.charAt(0).toUpperCase();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  const renderMenuItems = (isMobile = false) => (
    <ul className="space-y-2">
      {menuItems.map(({ text, path, icon }) => (
        <li key={text}>
          <NavLink
            to={path}
            className={({ isActive }) =>
              [
                "group flex items-center px-4 py-3 mb-2 rounded-xl transition-all duration-300",
                isActive
                  ? "bg-gradient-to-r from-[#fdbd5c]/15 via-[#8b91f3]/15 to-[#bc72f7]/10 border-l-4 border-[#8b91f3] text-purple-900 font-medium shadow-md"
                  : "hover:bg-gradient-to-r from-[#fdbd5c]/20 via-[#8b91f3]/20 to-[#bc72f7]/15 text-gray-700 hover:text-purple-800",
                isMobile ? "justify-start" : "lg:justify-start",
              ].join(" ")
            }
            onClick={() => setMobileOpen(false)}
          >
            <span className="text-2xl transition-transform duration-300 mr-1 group-hover:scale-110 text-indigo-500">
              {icon}
            </span>
            <span className={`${isMobile ? "block" : "hidden lg:block"} text-xl sm:text-sm font-medium ml-2`}>
              {text}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex flex-col fixed h-full w-20 lg:w-64 bg-white/90 backdrop-blur-sm border-r border-[#8b91f3]/30 shadow-md z-20 transition-all duration-300">
        <div className="p-5 border-b border-[#8b91f3]/30 lg:block hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
              {initial}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Hey, {username}</h2>
              <p className="text-sm text-[#8b91f3] font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Let’s crush some tasks!
              </p>
            </div>
          </div>
        </div>

        <div className=" p-4 space-y-6 overflow-y-auto flex-1">
          {/* PRODUCTIVITY BAR */}
          <div className=" hidden lg:block bg-gradient-to-r from-[#fdf6e3]/50 via-[#e5e9ff]/50 to-[#f9ecff]/50 rounded-xl p-3 border border-[#8b91f3]/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-[#8b91f3]">PRODUCTIVITY</h3>
              <span className="text-xs bg-[#e0d8ff] text-[#6f6ae5] px-2 py-0.5 rounded-full">
                {productivity}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#e0d8ff] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#2fb6fd] to-[#bc72f7] transition-[width] duration-700 ease-in-out"
                style={{ width: `${productivity}%` }}
              ></div>
            </div>
          </div>

          {renderMenuItems()}

          <div className="-mt-4 lg:block hidden">
            <div className="bg-gradient-to-r from-[#fdf6e3]/50 via-[#eaeaff]/50 to-[#f7ecff]/50 rounded-xl p-4 border border-[#8b91f3]/30">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#e3e0ff] rounded-lg">
                  <Lightbulb className="w-5 h-5 text-[#8b91f3]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Pro Tip</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Use keyboard shortcuts to boost productivity!
                  </p>
                  <a
                    href="https://flick-query.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-sm text-[#8b91f3] hover:underline"
                  >
                    Visit Flick Query
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU BUTTON */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed md:hidden top-20 right-5 z-50 bg-gradient-to-r from-[#2fb6fd] to-[#bc72f7] text-white p-2 rounded-full shadow-lg hover:opacity-90 transition"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40">
          <div className="fixed inset-0 bg-purple-200/10 backdrop-blur-xl p-4">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-bold text-[#8b91f3]">Menu</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-purple-700 hover:text-[#8b91f3]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6 px-3">
              <div className="w-16 h-16 sm:w-10 sm:h-10 rounded-full mt-12 text-2xl sm:regular bg-gradient-to-br from-[#fdbd5c] via-[#2fb6fd] to-[#bc72f7] flex items-center justify-center text-white font-bold shadow-md">
                {initial}
              </div>
              <div>
                <h2 className="text-2xl sm:text-lg font-bold mt-12 sm:mt-16 text-gray-800">Hey, {username}</h2>
                <p className="text-sm text-[#8b91f3] font-medium flex items-center gap-1">
                  <Sparkles className="w-5 h-5 sm:w-3 sm:h-3" /> Let’s crush some tasks!
                </p>
              </div>
            </div>

            {renderMenuItems(true)}
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
