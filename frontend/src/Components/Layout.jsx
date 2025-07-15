import React, { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Circle, TrendingUp, Clock, HomeIcon, TrophyIcon } from "lucide-react";
import createAxiosInstance from "../Utils/axios";
import Challenges from "./Challenges";

function Layout({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onGoingChallenges, setOnGoingChallenges] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const location = useLocation().pathname;

  const axios = createAxiosInstance();

  const fetchTasks = useCallback(async () => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) console.log("Auth token not found");

      const { data } = await axios.get("tasks/gp");

      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.tasks)
        ? data.tasks
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setTasks(arr);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load task");
      if (err.response?.status === 401) onLogout();
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(
      (t) =>
        t.completed === true ||
        t.completed === 1 ||
        (typeof t.completed === "string" && t.completed.toLowerCase() === "yes")
    ).length;

    const totalCount = tasks.length;
    const pendingCount = totalCount - completedTasks;
    const completionPercentage = totalCount
      ? Math.round((completedTasks / totalCount) * 100)
      : 0;

    return {
      completedTasks,
      totalCount,
      pendingCount,
      completionPercentage,
    };
  }, [tasks]);

  const StatsCard = ({ title, value, icon }) => (
    <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-[#fdf6e3]/50 via-[#e5e9ff]/50 to-[#f9ecff]/50 shadow-sm border border-[#8b91f3]/30 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-[#8b91f3]/10 group-hover:bg-[#8b91f3]/20">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#fdbd5c] via-[#BC72F7] to-[#2fb6fd] bg-clip-text text-transparent">
            {value}
          </p>
          <p className="text-xs text-gray-500 font-medium">{title}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-[#8b91f3]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 p-6 flex items-center justify-center">
        <div className="bg-white text-red-600 p-4 rounded-xl border max-w-md">
          <p className="font-medium mb-2">Error loading tasks</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchTasks}
            className="mt-4 py-2 px-4 bg-[#fdbd5c]/20 text-[#bc5b00] rounded-lg text-sm font-medium hover:bg-[#fdbd5c]/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} tasks={tasks} onLogout={onLogout} />

      <div className="ml-0 xl:ml-64 lg:ml-64 md:ml-16 sm:pt-16 p-3 sm:p-4 md:p-4 transition-all flex duration-300">
        <div className="grid grid-cols-1 xl:grid-cols-10 gap-4 sm:gap-7">
          <div className="xl:col-span-7 space-y-3 sm:space-y-4">
            {(location === "/" || location ==="/challenges") && <Challenges
              challenges={challenges}
              setChallenges={setChallenges}
              onGoingChallenges={onGoingChallenges}
              setOnGoingChallenges={setOnGoingChallenges}
            />}
            {location !== "/challenges" && <Outlet context={{ tasks, refreshTasks: fetchTasks }} />}
            
          </div>

          <div className="xl:col-span-3 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-[#8b91f3]/30">
              <div className="min-h-64">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center gap-2">
                  <svg
                    className="text-indigo-400 w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 6.99999C16.4183 6.99999 20 10.5817 20 15C20 19.4183 16.4183 23 12 23C7.58172 23 4 19.4183 4 15C4 10.5817 7.58172 6.99999 12 6.99999ZM12 8.99999C8.68629 8.99999 6 11.6863 6 15C6 18.3137 8.68629 21 12 21C15.3137 21 18 18.3137 18 15C18 11.6863 15.3137 8.99999 12 8.99999ZM12 10.5L13.3225 13.1797L16.2798 13.6094L14.1399 15.6953L14.645 18.6406L12 17.25L9.35497 18.6406L9.86012 15.6953L7.72025 13.6094L10.6775 13.1797L12 10.5ZM18 1.99999V4.99999L16.6366 6.13755C15.5305 5.5577 14.3025 5.17884 13.0011 5.04948L13 1.99899L18 1.99999ZM11 1.99899L10.9997 5.04939C9.6984 5.17863 8.47046 5.55735 7.36441 6.13703L6 4.99999V1.99999L11 1.99899Z"></path>
                  </svg>
                  Challenge Statistics
                </h3>

                {onGoingChallenges.length > 0 ? (
                  onGoingChallenges.map((item, index) => (
                    <div className="space-y-2 sm:space-y-3 mb-5">
                      <div className="flex items-center justify-between text-gray-700">
                        <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                          <TrophyIcon className="w-4 h-4 text-[#2fb6fd]" />
                          {item.title}
                        </span>
                        <span className="text-xs bg-[#8b91f3]/10 text-[#8b91f3] px-2 py-0.5 rounded-full">
                          {item.count} / {item.day}
                        </span>
                      </div>

                      <div className="relative pt-1">
                        <div className="flex gap-1.5 items-center">
                          <div className="w-full h-2 sm:h-3 bg-[#8b91f3]/20 rounded-full overflow-hidden">
                            <div
                              style={{
                                width: `${(item.count / item.day) * 100}%`,
                              }}
                              className="h-full bg-gradient-to-r from-[#2fb6fd] to-[#bc72f7] transition-all duration-500"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center pr-3 justify-center gap-8 animate-fade-in">
                    <img
                      className="h-32 w-32 object-contain"
                      src="Images/NoChallenges.png"
                    />
                    <h1 className="text-2xl text-gray-800 font-bold">
                      No Active Challenge
                    </h1>
                  </div>
                )}
              </div>
              <hr className="my-5 mb-10 border-[#8b91f3]/20" />

              <h3 className=" text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                Task Statistics
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {[
                  { title: "Total Tasks", value: stats.totalCount },
                  { title: "Completed Tasks", value: stats.completedTasks },
                  { title: "Pending Tasks", value: stats.pendingCount },
                  {
                    title: "Completion Percentage",
                    value: `${stats.completionPercentage}%`,
                  },
                ].map(({ title, value }) => (
                  <StatsCard
                    key={title}
                    title={title}
                    value={value}
                    icon={<Circle className="w-4 h-4 text-[#2fb6fd]" />}
                  />
                ))}
              </div>

              <hr className="my-3 border-[#8b91f3]/20" />

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between text-gray-700">
                  <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                    <Circle className="w-3 h-3 text-[#2fb6fd]" />
                    Task Progress
                  </span>
                  <span className="text-xs bg-[#8b91f3]/10 text-[#8b91f3] px-2 py-0.5 rounded-full">
                    {stats.completedTasks} / {stats.totalCount}
                  </span>
                </div>

                <div className="relative pt-1">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-full h-2 sm:h-3 bg-[#8b91f3]/20 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${stats.completionPercentage}%` }}
                        className="h-full bg-gradient-to-r from-[#2fb6fd] to-[#bc72f7] transition-all duration-500"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#fdf6e3]/50 via-[#e5e9ff]/50 to-[#f9ecff]/50 rounded-xl p-4 sm:p-5 shadow-sm border mt-8 border-[#8b91f3]/30">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#fdbd5c]" />
                  Recent Activity
                </h3>

                <div className="space-y-2 sm:space-y-3">
                  {tasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id || task._id}
                      className="flex items-center justify-center p-2 sm:p-3 hover:bg-[#BC72F7]/10 rounded-lg transition-colors duration-200 border border-transparent hover:border-[#BC72F7]/30"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 break-words whitespace-normal">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {task.createdAt
                            ? new Date(task.createdAt).toLocaleDateString()
                            : "No date"}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ml-2 ${
                          task.completed
                            ? "bg-green-100 text-green-700"
                            : "bg-[#fdbd5c]/20 text-[#bc5b00]"
                        }`}
                      >
                        {task.completed ? "Done" : "Pending"}
                      </span>
                    </div>
                  ))}

                  {tasks.length === 0 && (
                    <div className="text-center py-4 sm:py-6 px-2">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto sm:mb-4 rounded-full bg-[#8b91f3]/20 flex items-center justify-center">
                        <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-[#8b91f3]" />
                      </div>
                      <p className="text-sm text-gray-500">
                        No recent activity
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Tasks will appear here once created
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
