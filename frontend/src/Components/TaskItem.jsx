import React, { useEffect, useReducer, useRef, useState } from "react";
import createAxiosInstance from "../Utils/axios";
import { useOutletContext } from "react-router-dom";
import { format, isToday } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  MoreVertical,
  Trash2,
} from "lucide-react";
import TaskModal from "./TaskModal";

const MENU_OPTIONS = [
  {
    action: "edit",
    label: "Edit Task",
    icon: <Edit2 size={14} className="text-purple-600" />,
  },
  {
    action: "delete",
    label: "Delete Task",
    icon: <Trash2 size={14} className="text-red-600" />,
  },
];

const getPriorityColor = (priority) => {
  const colors = {
    low: "border-green-500 bg-green-50/50 text-green-700",
    medium: "border-purple-500 bg-purple-50/50 text-purple-600",
    high: "border-fuchsia-800 bg-fuchsia-50/50 text-fuchsia-800",
  };
  return (
    colors[priority?.toLowerCase()] ||
    "border-gray-500 bg-gray-50/50 text-gray-700"
  );
};

function TaskItem({ task, onRefresh, onLogout, showCompleteCheckbox = true }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const { refreshTasks } = useOutletContext();
  const [isCompleted, setIsCompleted] = useState(
    [true, 1, "yes"].includes(
      typeof task.completed === "string"
        ? task.completed.toLowerCase()
        : task.completed
    )
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);

  const axios = createAxiosInstance();

  useEffect(() => {
    setIsCompleted(
      [true, 1, "yes"].includes(
        typeof task.completed === "string"
          ? task.completed.toLowerCase()
          : task.completed
      )
    );

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const borderColor = isCompleted
    ? "border-green-500"
    : getPriorityColor(task.priority).split(" ")[0];

  const handleComplete = async () => {
    const newStatus = isCompleted ? "No" : "Yes";

    try {
      await axios.put(
        `tasks/${task._id}/gp`,
        { completed: newStatus },
      );
      setIsCompleted(!isCompleted);
      refreshTasks?.();
      onRefresh?.();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) onLogout?.();
    }
  };

  const handleAction = (action) => {
    setShowMenu(false);
    if (action === "edit") setShowEditModal(true);
    if (action === "delete") handleDelete();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`tasks/${task._id}/gp`);
      refreshTasks?.();
      onRefresh?.();
    } catch (err) {
      if (err.response?.status === 401) onLogout?.();
    }
  };

  const handleSave = async (updatedTask) => {
    try {
      const payload = (({
        title,
        description,
        priority,
        dueDate,
        completed,
      }) => ({ title, description, priority, dueDate, completed }))(
        updatedTask
      );

      await axios.put(`tasks/${task._id}/gp`, payload);
      setShowEditModal(false);
      refreshTasks?.();
      onRefresh?.();
    } catch (err) {}
  };

  const progress = subtasks.length
    ? (subtasks.filter((st) => st.completed).length / subtasks.length) * 100
    : 0;

  return (
    <>
      <div
        className={`group p-4 sm:p-5 rounded-xl flex items-start gap-2 shadow-sm bg-gradient-to-r from-[#fdbd5c]/10 via-[#8b91f3]/10 to-[#bc72f7]/10 border-l-4 hover:shadow-md transition-all duration-300 border border-[#bc72f7]/20`}
      >
        <div className="flex items-start max-w-[90%] gap-2 sm:gap-3 flex-1 min-w-0">
          {showCompleteCheckbox && (
            <button
              onClick={() => {
                handleComplete();
              }}
              className={`mt-0.5 sm:mt-1 p-1 sm:p-1.5 rounded-full hover:bg-purple-100 transition-colors duration-300 ${
                isCompleted ? `text-green-500` : `text-gray-300`
              }`}
            >
              <CheckCircle2
                size={18}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isCompleted ? "fill-green-500" : ""
                }`}
              />
            </button>
          )}

          <div className="flex-1 min-w-0 ">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <h3
                className={`text-base sm:text-lg font-medium truncate ${
                  isCompleted ? "text-gray-400 line-through" : "text-gray-800"
                }`}
              >
                {task.title}
              </h3>
              <span
                className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
            </div>

            {task.description && (
              <p className={`text-sm text-gray-500 mt-1 truncate`}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-end max-w-[15%] items-end w-auto  gap-2 sm:gap-3">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="absolute right-0 flex justify-end bg-white rounded-xl  z-10 overflow-hidden animate-fadeIn"
            >
              <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" size={18} />
            </button>
            {showMenu && (
              <div className="absolute   right-0 w-40 sm:w-48 bg-white border border-purple-100 rounded-xl shadow-xl z-10 overflow-hidden animate-fadeIn">
                {MENU_OPTIONS.map((opt) => (
                  <button
                    key={opt.action}
                    onClick={() => handleAction(opt.action)}
                    className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:text-purple-500 flex items-center gap-2 transition-colors duration-200"
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-8 -mr-1 sm:m-0">
            <div
              className={`flex  items-center gap-0.5 sm:gap-1.5 mb-1 text-xs font-medium whitespace-nowrap ${
                task.dueDate && isToday(new Date(task.dueDate))
                  ? "text-fuchsia-600"
                  : "text-gray-500"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:block">
              {task.dueDate
                ? `Due ${format(new Date(task.dueDate), "EEE MMM dd")}`
                : "-"}
                </span>
                <span className="sm:hidden">
                {task.dueDate
                ? `${format(new Date(task.dueDate), "MMM dd")}`
                : "-"}
                </span>
             
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400  whitespace-nowrap">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
             <span className="hidden sm:block">
               {task.createdAt
                ? `Built ${format(new Date(task.createdAt), "EEE MMM dd")}`
                : "No date"}
                </span>
                <span className="sm:hidden">
               {task.createdAt
                ? `${format(new Date(task.createdAt), "MMM dd")}`
                : "No date"}
                </span>
            </div>
          </div>
        </div>
       
      </div>
                
      <TaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        taskToEdit={task}
        onSave={handleSave}
      />
    </>
  );
}

export default TaskItem;
