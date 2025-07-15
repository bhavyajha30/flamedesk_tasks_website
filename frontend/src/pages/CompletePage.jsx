import React, { useMemo, useState } from "react";
import { Award, CheckCircle2, Filter, SortAsc, SortDesc } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import TaskItem from "../Components/TaskItem";

function CompletePage() {
  const { tasks, refreshTasks } = useOutletContext();
  const [sortBy, setSortBy] = useState("newest");

  const SORT_OPTIONS = [
    { id: "newest", label: "Newest", icon: <SortDesc className="w-3 h-3" /> },
    { id: "oldest", label: "Oldest", icon: <SortAsc className="w-3 h-3" /> },
    { id: "priority", label: "Priority", icon: <Award className="w-3 h-3" /> },
  ];

  const sortedCompletedTasks = useMemo(() => {
    return tasks
      .filter((task) =>
        [true, 1, "yes"].includes(
          typeof task.completed === "string"
            ? task.completed.toLowerCase()
            : task.completed
        )
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createAt) - new Date(a.createAt);
          case "oldest":
            return new Date(a.createAt) - new Date(b.createAt);
          case "priority": {
            const order = { high: 3, medium: 2, low: 1 };
            return (
              order[b.priority?.toLowerCase()] -
              order[a.priority?.toLowerCase()]
            );
          }
          default:
            return 0;
        }
      });
  }, [tasks, sortBy]);

  return (
    <div className="p-4 md:p-6 min-h-screen overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-3 md:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2 truncate">
            <CheckCircle2 className="text-purple-500 w-5 h-5 md:w-6 md:h-6" />
            <span className="truncate">Completed Tasks</span>
          </h1>

          <p className="text-xs md:text-sm text-gray-500 mt-1 ml-7 md:ml-8">
            {sortedCompletedTasks.length} task
            {sortedCompletedTasks.length !== 1 && "s"} marked as completed
          </p>
        </div>

        {/* SORT CONTROLS */}
        <div className="w-full md:w-auto mt-2 md:mt-0">
          <div className="flex items-center justify-between bg-white p-2 md:p-3 rounded-xl shadow-sm border border-purple-100 w-full md:w-auto">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Filter className="w-4 h-4 text-purple-500" />
              <span className="text-xs md:text-sm">Sort by:</span>
            </div>

            {/* Mobile Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 py-1 md:px-3 md:py-2 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500 md:hidden text-xs md:text-sm"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                  {opt.id === "newest" ? "First" : ""}
                </option>
              ))}
            </select>

            {/* DESKTOP BUTTONS */}
            <div className="hidden md:flex space-x-1 bg-purple-50 p-1 rounded-lg ml-2 md:ml-3">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={[
                    "px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1",
                    sortBy == opt.id
                      ? "bg-white text-purple-700 shadow-sm border border-purple-100"
                      : "text-gray-600 hover:text-purple-700 hover:bg-purple-100/50",
                  ].join(" ")}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task Completed */}
      <div className="space-y-3 md:space-y-4">
        {sortedCompletedTasks.length === 0 ? (
          <div className="p-4 md:p-8 bg-white rounded-xl shadow-sm border border-purple-100 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-indigo-500" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
              No completed tasks yet!
            </h3>
            <p className="text-xs md:text-sm text-gray-500">
              Complete some tasks and they'll appear here
            </p>
          </div>
        ) : (
          sortedCompletedTasks.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onRefresh={refreshTasks}
              showCompletedCheckbox={false}
              className="opacity-90 hover:opacity-100 transition-opacity text-sm md:text-base"
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CompletePage;
