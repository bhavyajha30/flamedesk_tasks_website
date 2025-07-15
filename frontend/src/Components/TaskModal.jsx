import {
  AlignLeft,
  Calendar,
  CheckCircle,
  Flag,
  PlusCircle,
  Save,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import createAxiosInstance from "../Utils/axios";


function TaskModal({ isOpen, onClose, taskToEdit, onSave, onLogout }) {
  const DEFAULT_TASK = {
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    completed: "No",
    id: null,
  };

  const priorityStyles = {
    Low: "bg-[#e7fbe7] text-green-800 border-green-200",
    Medium: "bg-[#ede7ff] text-[#8b91f3] border-[#cfcfff]",
    High: "bg-[#fbe7ff] text-[#bc72f7] border-[#eec9ff]",
  };

  const [taskData, setTaskData] = useState(DEFAULT_TASK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axios = createAxiosInstance();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!isOpen) return;
    if (taskToEdit) {
      const normalized =
        taskToEdit.completed === "Yes" || taskToEdit.completed === true
          ? "Yes"
          : "No";
      setTaskData({
        ...DEFAULT_TASK,
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        priority: taskToEdit.priority || "Low",
        dueDate: taskToEdit.dueDate?.split("T")[0] || "",
        completed: normalized,
        id: taskToEdit._id,
      });
    } else {
      setTaskData(DEFAULT_TASK);
    }
    setError(null);
  }, [isOpen, taskToEdit]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  });

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth Token Found");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (taskData.dueDate < today) {
        setError("Due date cannot be in the past.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const isEdit = Boolean(taskData.id);
        const url = isEdit ? `tasks/${taskData.id}/gp` : `tasks/gp`;

      
        let resp;
        if (isEdit) {
          resp = await axios.put(url, taskData);
        } else {
          resp = await axios.post(url, taskData);
        }
      

        if (resp.status === 401) {
          return onLogout?.();
        }
      
        const saved = resp.data; 
        onSave?.(saved?.task);
        onClose();
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
      
    },
    [taskData, today, getHeaders, onLogout, onSave, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed -top-4 inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#8b91f3]/20 rounded-xl max-w-md w-full shadow-xl relative p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            {taskData.id ? (
              <Save className="text-[#8b91f3] w-5 h-5" />
            ) : (
              <PlusCircle className="text-[#8b91f3] w-5 h-5" />
            )}
            {taskData.id ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#fdf6f2] rounded-lg transition-colors text-gray-500 hover:text-[#8b91f3]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <div className="flex items-center border mb-3 border-[#8b91f3]/20 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#8b91f3] focus-within:border-[#8b91f3] transition-all duration-200">
              <input
                type="text"
                name="title"
                required
                value={taskData.title}
                onChange={handleChange}
                className="w-full focus:outline-none text-sm"
                placeholder="Enter task title"
              />
            </div>

            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
              <AlignLeft className="w-4 h-4 text-[#8b91f3]" /> Description
            </label>
            <textarea
              name="description"
              rows="3"
              onChange={handleChange}
              value={taskData.description}
              className="w-full px-4 py-2.5 border border-[#8b91f3]/20 mb-3 rounded-lg focus:ring-2 focus:ring-[#8b91f3] focus:border-[#8b91f3] text-sm"
              placeholder="Add details about your task"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                <Flag className="w-4 h-4 text-[#8b91f3]" /> Priority
              </label>
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border border-[#8b91f3]/20 mb-3 rounded-lg focus:ring-2 focus:ring-[#8b91f3] focus:border-[#8b91f3] text-sm ${priorityStyles[taskData.priority]}`}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 text-[#8b91f3]" /> Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                required
                min={today}
                value={taskData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#8b91f3]/20 rounded-lg focus:ring-2 focus:ring-[#8b91f3] focus:border-[#8b91f3] text-sm"
              />
            </div>
          </div>

          <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
            <CheckCircle className="w-4 h-4 text-[#8b91f3]" /> Status
          </label>
          <div className="flex gap-4">
            {[
              { val: "Yes", label: "Completed" },
              { val: "No", label: "In Progress" },
            ].map(({ val, label }) => (
              <label key={val} className="flex items-center">
                <input
                  type="radio"
                  name="completed"
                  value={val}
                  checked={taskData.completed === val}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#8b91f3] focus:ring-[#8b91f3] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-xl transition-all duration-300"
          >
            {loading ? (
              "Saving..."
            ) : taskData.id ? (
              <>
                <Save className="w-4 h-4" /> Update Task
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" /> Create Task
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
