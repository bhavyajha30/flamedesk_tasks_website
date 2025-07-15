import createAxiosInstance from "../Utils/axios";
import {
  Save,
  Shield,
  UserCircle,
  User,
  Mail,
  ChevronLeft,
  LogOut,
  Lock,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Contact from "./Contact";

function Profile({ onLogout, setCurrentUser }) {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const navigate = useNavigate("/");
  const axios = createAxiosInstance();

  const personalFields = [
    { name: "name", type: "text", placeholder: "Full Name", icon: User },
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
  ];

  const securityFields = [
    { name: "current", placeholder: "Current Password" },
    { name: "new", placeholder: "New Password" },
    { name: "confirm", placeholder: "Confirm Password" },
  ];

  useEffect(() => {
    axios
      .get("user/me")
      .then(({ data }) => {
        if (data.success) {
          setProfile({ name: data.user.name, email: data.user.email });
        } else toast.error(data.message);
      })
      .catch(() => toast.error("UNABLE TO LOAD PROFILE."));
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `/api/user/profile`,
        { name: profile.name, email: profile.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setCurrentUser((prev) => ({
          ...prev,
          name: profile.name,
          email: profile.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.name || "User"
          )}&background=random`,
        }));
        toast.success("Profile updated");
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      return toast.error("Passwords do not match");
    }
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `/api/user/password`,
        { currentPassword: password.current, newPassword: password.new },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Password Changed");
        setPassword({ current: "", new: "", confirm: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    }
  };

  return (
    <div className="min-h-screen rounded-md bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 font-semibold hover:text-[#8b91f3] mb-8 transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Go back to dashboard
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-md">
            {profile.name ? profile.name[0].toUpperCase() : "U"}
          </div>

          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800">
              Account Settings
            </h1>
            <p className="text-gray-500 text-sm">
              Manage your profile and security settings
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 ">
          <section className="h-fit rounded-xl shadow-sm bg-white border border-[#8b91f3]/30 p-6">
            <div className="flex items-center gap-2 mb-6">
              <UserCircle className="text-[#8b91f3] w-5 h-5" />
              <h2 className="text-xl font-semibold">Personal Information</h2>
            </div>
            <form onSubmit={saveProfile} className="space-y-4">
              {personalFields.map(({ name, type, placeholder, icon: Icon }) => (
                <div
                  key={name}
                  className="flex items-center border border-[#8b91f3]/30 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#2fb6fd] focus-within:border-[#2fb6fd] transition-all duration-200"
                >
                  <Icon className="text-[#2fb6fd] w-5 h-5 mr-2" />
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={profile[name]}
                    onChange={(e) =>
                      setProfile({ ...profile, [name]: e.target.value })
                    }
                    className="w-full focus:outline-none text-sm"
                    required
                  />
                </div>
              ))}
              <button className="w-full bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 text-white py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </form>
          </section>

          <section className="bg-white mt-24 rounded-xl shadow-sm border border-[#8b91f3]/30 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="text-[#8b91f3] w-5 h-5" />
              <h2 className="text-xl font-semibold">Security</h2>
            </div>

            <form onSubmit={changePassword} className="space-y-4">
              {securityFields.map(({ name, placeholder }) => (
                <div
                  key={name}
                  className="flex items-center border border-[#8b91f3]/30 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#BC72F7] focus-within:border-[#BC72F7] transition-all duration-200"
                >
                  <Lock className="text-[#BC72F7] w-5 h-5 mr-2" />
                  <input
                    type="password"
                    placeholder={placeholder}
                    value={password[name]}
                    onChange={(e) =>
                      setPassword({ ...password, [name]: e.target.value })
                    }
                    className="w-full focus:outline-none text-sm"
                    required
                  />
                </div>
              ))}
              <button className="w-full bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 text-white py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" /> Save Changes
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#8b91f3]/20">
              <h3 className="text-red-600 font-semibold mb-4 flex items-center justify-center gap-2">
                <LogOut className="w-4 h-4" /> Danger Zone
              </h3>
              <button
                className="w-full text-red-600 border border-red-200 py-2.5 rounded-lg hover:bg-red-50 transition-colors duration-200"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          </section>
        </div>
      </div>

      <Contact profile={profile}/>
    </div>
  );
}

export default Profile;
