import {
  AlignLeft,
  Calendar,
  CheckCircle,
  Flag,
  Link,
  PlusCircle,
  Save,
  Trophy,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import createAxiosInstance from "../Utils/axios";

function ChallengeModal({ refreshChallenges, data, setData, addChallenge, setAddChallenge }) {
  const today = new Date().toISOString().split("T")[0];

  const DEFAULT_Challenge = {
    count: 1,
    day: 1,
    image: "",
    isActive: false,
    startedOn: today,
    title: "",
  };

  const [challengeData, setChallengeData] = useState(data ? data : DEFAULT_Challenge);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axios = createAxiosInstance();

  useEffect(() => {
    if (data) {
      setChallengeData(data);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (challengeData.day <= 0) {
      setError("Challenge duration must be at least 1 day.");
      setLoading(false);
      return;
    }

    let updatedChallenge = { ...challengeData };

    if (data) {
      updatedChallenge = {
        ...updatedChallenge,
        isActive: true,
        startedOn: today,
      };
    }

    try {
      const response = await (data
        ? axios.put(`challenges/${data._id}/gp`, updatedChallenge)
        : axios.post("challenges/gp", challengeData));
      console.log(response.data);
      refreshChallenges();
      setAddChallenge(false);
    } catch (err) {
      console.error(err);
      setError("Failed to save challenge. Please try again.");
    } finally {
      setData(null);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChallengeData((prev) => ({ ...prev, [name]: value }));
  };

  if (!addChallenge) return null;

  return (
    <div className="fixed -top-4 inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#8b91f3]/20 rounded-xl max-w-md w-full shadow-xl relative p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Trophy className="text-[#8b91f3] w-5 h-5" />
            {data !== null ? "Take on the Challenge" : "Build Challenge"}
          </h2>
          <button
            onClick={() => {
              setAddChallenge(false);
              setData(null);
            }}
            className="p-2 hover:bg-[#fdf6f2] rounded-lg transition-colors text-gray-500 hover:text-[#8b91f3]"
            aria-label="Close Modal"
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
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
              <CheckCircle className="w-4 h-4 text-[#8b91f3]" /> Challenge Title
            </label>
            <div className="flex items-center border mb-3 border-[#8b91f3]/20 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#8b91f3] focus-within:border-[#8b91f3] transition-all duration-200">
              <input
                type="text"
                name="title"
                required
                value={challengeData.title}
                onChange={handleChange}
                className="w-full focus:outline-none text-sm"
                placeholder="Enter challenge title"
              />
            </div>

            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
              <Link className="w-4 h-4 text-[#8b91f3]" /> Custom Image URL
            </label>
            <input
              name="image"
              type="url"
              onChange={handleChange}
              value={challengeData.image}
              className="w-full px-4 py-2.5 border outline-none border-[#8b91f3]/20 mb-3 rounded-lg focus:ring-2 focus:ring-[#8b91f3] focus:border-[#8b91f3] text-sm"
              placeholder="Add custom image (optional)"
            />

            {challengeData.image && (
              <div className="mb-3">
                <img
                  src={challengeData.image}
                  alt="Challenge Preview"
                  className="w-full h-40 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {data !== null && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 text-[#8b91f3]" /> Start Date
                </label>
                <input
                  type="text"
                  name="startedOn"
                  value={today}
                  disabled
                  className="w-full px-4 py-2.5 border border-[#8b91f3]/20 rounded-lg focus:ring-2 focus:ring-[#8b91f3] focus:border-[#8b91f3] text-sm"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                  <Flag className="w-4 h-4 text-[#8b91f3]" /> Duration
                </label>
                <input
                  type="number"
                  name="day"
                  min={1}
                  value={challengeData.day}
                  onChange={handleChange}
                  placeholder="Challenge Day Count"
                  className="w-full px-4 py-2.5 border border-[#8b91f3]/20 mb-3 rounded-lg focus:ring-2 focus:ring-[#8b91f3] focus:border-[#8b91f3] text-sm"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-xl transition-all duration-300"
          >
            {loading ? (
              "Saving..."
            ) : data !== null ? (
              <>
                <Save className="w-4 h-4" /> Start Challenge
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" /> Create Challenge
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChallengeModal;
