import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import TaskItem from "../Components/TaskItem";
import TaskModal from "../Components/TaskModal";
import {
  Award,
  Clock,
  Filter,
  ListChecks,
  Plus,
  SortAsc,
  SortDesc,
} from "lucide-react";

function PendingPage() {
  const { tasks = [], refreshTasks, handleDelete, handleToggleComplete } = useOutletContext();

  const [sortBy, setSortBy] = useState("newest");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const tabButton = (active) =>
    `px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
      active
        ? "bg-white text-purple-700 shadow-sm border border-purple-100"
        : "text-gray-600 hover:text-purple-700 hover:bg-purple-100/50"
    }`;

  const SORT_OPTIONS = [
    { id: "newest", label: "Newest", icon: <SortDesc className="w-3 h-3" /> },
    { id: "oldest", label: "Oldest", icon: <SortAsc className="w-3 h-3" /> },
    { id: "priority", label: "Priority", icon: <Award className="w-3 h-3" /> },
  ];

  const sortedPendingTasks = useMemo(() => {
    const filtered = tasks.filter(
      (t) =>
        !t.completed ||
        (typeof t.completed === "string" && t.completed.toLowerCase() === "no")
    );

    return filtered.sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      const order = { high: 3, medium: 2, low: 1 };
      return (
        order[b.priority.toLowerCase()] - order[a.priority.toLowerCase()]
      );
    });
  }, [tasks, sortBy]);

  return (
    <div className="px-2 sm:p-6  min-h-[150vw] sm:min-h-screen overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <ListChecks className="text-purple-500" /> Pending Task
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-7">
            {sortedPendingTasks.length} task
            {sortedPendingTasks.length !== 1 && "s"} needing your attention
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-purple-100 w-full md:w-auto">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Filter className="w-4 h-4 text-purple-500" />
            <span className="text-sm">Sort by:</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500 md:hidden text-sm ml-2"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">By Priority</option>
          </select>

          <div className="hidden md:flex space-x-1 bg-purple-50 p-1 rounded-lg ml-3">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={tabButton(sortBy === opt.id)}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Task (Desktop only) */}
      <div
        onClick={() => setShowModal(true)}
        className="hidden md:block p-5 border-2 border-dashed border-purple-200 rounded-xl hover:border-purple-400 transition-colors cursor-pointer mb-6 bg-purple-50/50 group"
      >
        <div className="flex items-center justify-center gap-3 text-gray-500 group-hover:text-purple-600 transition-colors">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
            <Plus className="text-purple-500" size={18} />
          </div>
          <span className="font-medium">Add New Task</span>
        </div>
      </div>

      {/* Task List or Empty State */}
      <div className="space-y-4">
        {sortedPendingTasks.length === 0 ? (
          <div className="mx-auto py-6 bg-white rounded-xl shadow-sm border border-purple-100 text-center">
            <div className="w-16 h-16 bg-purple-100 mx-auto mb-5 rounded-full flex items-center justify-center shadow-sm">
              <Clock className="w-8 h-8 text-indigo-400" />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              All caught up!
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              No pending tasks - great work!
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 tracking-wide hover:bg-purple-200 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Create New Task
            </button>
          </div>
        ) : (
          sortedPendingTasks.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              showCompleteCheckbox
              onDelete={() => handleDelete(task._id || task.id)}
              onToggleComplete={() =>
                handleToggleComplete(task._id || task.id, task.completed)
              }
              onEdit={() => {
                setSelectedTask(task);
                setShowModal(true);
              }}
              onRefresh={refreshTasks}
            />
          ))
        )}
      </div>

      {/* Modal */}
      <TaskModal
        isOpen={!!selectedTask || showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTask(null);
          refreshTasks();
        }}
        taskToEdit={selectedTask}
      />
    </div>
  );
}

export default PendingPage;
