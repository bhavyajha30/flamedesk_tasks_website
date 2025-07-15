import React, { useState } from "react";
import { UserPlus, Icon, Lock, User, Mail } from "lucide-react";
import axios from "axios";

const API_URL = "https://flamedesk-backend.onrender.com";
const INITIAL_FORM = { name: "", email: "", password: "" };

function Signup({ onSwitchMode }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const FIELDS = [
    { name: "name", type: "text", placeholder: "Full Name", icon: User },
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    { name: "password", type: "password", placeholder: "Password", icon: Lock },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const { data } = await axios.post(
        `${API_URL}/api/user/register`,
        formData
      );
      console.log("Signup Successfull", data);
      setMessage({
        text: "Registration successful! You can now log in.",
        type: "success",
      });
      setFormData(INITIAL_FORM);
    } catch (err) {
      console.error("Signup error :", err);
      setMessage({
        text:
          err.response?.data?.message || "An error occoured. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(true);
    }
  };

  return (
    <div className="max-w-xs sm:max-w-md w-full bg-white  shadow-lg border border-purple-100 rounded-xl p-8">
      {" "}
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 rounded-full mx-auto flex items-center justify-center mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="textg-gray-500 text-sm mt-1 w-full">
          Join Flamedesk to improve manage your tasks
        </p>
      </div>
      {message.text && (
        <div
          className={
            message.type === "success"
              ? "bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-100"
              : "bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100"
          }
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
          <div
            key={name}
            className={
              "flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200"
            }
          >
            <Icon className="text-purple-500 w-5 h-5 mr-2" />
            <input
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) =>
                setFormData({ ...formData, [name]: e.target.value })
              }
              className="w-full focus:outline-none text-sm text-gray-700"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-400  to-purple-500 text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            "Signing Up..."
          ) : (
            <>
              <UserPlus className="w-6 h-4" />
              Sign Up
            </>
          )}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account ?
        <button
          onClick={onSwitchMode}
          className="text-purple-600 hover:text-purple-700 hover:underline font-medium transition-colors"
        >
          &nbsp;Login
        </button>
      </p>
    </div>
  );
}

export default Signup;
