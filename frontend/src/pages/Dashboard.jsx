import {
  Calendar1Icon,
  Filter,
  Icon,
  Plus,
  HomeIcon,
  Flame,
  LayoutDashboard,
  LayoutDashboardIcon,
} from "lucide-react";
import React, { useMemo, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import TaskItem from "../Components/TaskItem";
import TaskModal from "../Components/TaskModal";
import createAxiosInstance from "../Utils/axios";

function Dashboard() {
  const { tasks, refreshTasks } = useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState("all");

  const axios = createAxiosInstance();

  const stats = useMemo(
    () => ({
      total: tasks.length,
      lowPriority: tasks.filter((t) => t.priority?.toLowerCase() === "low")
        .length,
      mediumPriority: tasks.filter((t) => t.priority.toLowerCase() === "medium")
        .length,
      highPriority: tasks.filter((t) => t.priority.toLowerCase === "high")
        .length,
      completed: tasks.filter(
        (t) =>
          t.completed == true ||
          t.completed == 1 ||
          (typeof t.completed === "string" &&
            t.completed.toLowerCase() === "yes")
      ).length,
    }),
    [tasks]
  );

  const FILTER_OPTIONS = ["all", "today", "week", "high", "medium", "low"];
  const FILTER_LABELS = {
    all: "All Tasks",
    today: "Today's Tasks",
    week: "This Week",
    high: "High Priority",
    medium: "Medium Priority",
    low: "Low Priority",
  };

  // FITER TASKS
  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        switch (filter) {
          case "today":
            return dueDate.toDateString() === today.toDateString();
          case "week":
            return dueDate >= today && dueDate <= nextWeek;
          case "high":
          case "low":
          case "medium":
            return task.priority?.toLowerCase() === filter;
          default:
            return true;
        }
      }),
    [tasks, filter]
  );

  const STATS = [
    {
      key: "total",
      label: "Total Tasks",
      icon: HomeIcon,
      iconColor: "bg-purple-100 text-purple-600",
      valueKey: "total",
      gradient: true,
    },
    {
      key: "lowPriority",
      label: "Low Priority",
      icon: Flame,
      iconColor: "bg-green-100 text-green-600",
      borderColor: "border-green-200",
      valueKey: "lowPriority",
      textColor: "text-green-600",
    },
    {
      key: "mediumPriority",
      label: "Medium Priority",
      icon: Flame,
      iconColor: "bg-orange-100 text-orange-600",
      borderColor: "border-orange-200",
      valueKey: "mediumPriority",
      textColor: "text-orange-600",
    },
    {
      key: "highPriority",
      label: "High Priority",
      icon: Flame,
      iconColor: "bg-red-100 text-red-600",
      borderColor: "border-red-200",
      valueKey: "highPriority",
      textColor: "text-red-600",
    },
  ];

  //SAVING TASKS
  const handleTaskSave = useCallback(
    async (taskData) => {
      try {
        if (taskData.id) {
          const { data } = await axios.put('tasks/${taskData.id}/gp', taskData);
        }
        refreshTasks();
        setShowModal(false);
        setSelectedTask(null);
      } catch (error) {
        console.error("Error saving tasks:", error);
      }
    },
    [refreshTasks]
  );

  return (
    <div className="p-4 md:p-6 min-h-screen overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3">
        <div className="min-w-0">
          <h1 className="ext-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <LayoutDashboardIcon className="text-indigo-400 w-5 h-5 md:w-7 md:h-7 shrink-0" />
            <span className="truncate">Task Overview</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-7 truncate">
            Manage your tasks efficiently
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 w-full md:w-auto justify-center text-sm md:text-base"
        >
          <Plus size={18} />
          Add New Task
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        {STATS.map(
          ({
            key,
            label,
            icon: Icon,
            iconColor,
            borderColor = "border-purple-200",
            valueKey,
            textColor,
            gradient,
          }) => (
            <div
              key={key}
              className={`p-3 md:p-4 rounded-xl bg-gradient-to-r from-[#fdbd5c]/10 via-[#8b91f3]/10 to-[#bc72f7]/10 shadow-sm border border-purple-200 hover:shadow-md transition-all duration-300 min-w-0 ${borderColor}`}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className={`p-1.5 md:p-2 rounded-lg ${iconColor}`}>
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>

                <div className="min-w-0">
                  <p
                    className={`text-lg md:text-2xl font-bold truncate ${
                      gradient
                        ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent"
                        : textColor
                    }`}
                  >
                    {stats[valueKey]}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{label}</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
      {/* CONTENT */}
      <div className="space-y-6">
        {/* FILTER */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            <Filter className="w-5 h-5 text-purple-500 shrink-0" />
            <h2 className="text-base md:text-lg font-semibold text-gray-800 truncate">
              {FILTER_LABELS[filter]}
            </h2>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500 md:hidden text-sm"
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>

          <div className="hidden md:flex space-x-1 bg-purple-50 p-1 rounded-lg">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter
                    ? "bg-white text-purple-600 shadow-md border"
                    : "text-gray-600 hover:bg-purple-100/50"
                }`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {/* TASK LIST  */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="p-6 bg-white rounded-xl shadow-sm border border-purple-100 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar1Icon className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg fornt-semibold text-gray-800 mb-2">
                No tasks found
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {filter === "all"
                  ? "Create your first task to get started"
                  : "No tasks match this filter"}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 text-white rounded-lg text-sm font-medium"
              >
                Add New Task
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task._id || task.id}
                task={task}
                onRefresh={refreshTasks}
                showCompleteCheckbox
                onEdit={() => {
                  setSelectedTask(task);
                  setShowModal(true);
                }}
              />
            ))
          )}
        </div>

        {/* ADD TASK DESKTOP */}
        <div
          onClick={() => setShowModal(true)}
          className="hidden md:flex items-center justify-center p-4 border-2 border-dashed border-indigo-300 rounded-xl hover:border-purple-400 bg-purple-50/50 cursor-pointer transition-colors"
        >
          <Plus className="w-5 h-5 text-indigo-500 mr-2" />
          <span className="text-gray-600 font-medium">Add New Task</span>
        </div>
      </div>

      {/* MODAL */}
      <TaskModal
        isOpen={showModal || !!selectedTask}
        onClose={() => {
          setShowModal(false);
          setSelectedTask(null);
        }}
        taskToEdit={selectedTask}
        onSave={handleTaskSave}
      />
    </div>
  );
}

export default Dashboard;
