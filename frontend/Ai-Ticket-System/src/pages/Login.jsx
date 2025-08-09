import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
/*
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/login", form);
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        navigate("/tickets");
      }
    } catch (error) {
      alert(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
*/
const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await apiRequest("POST", "/api/auth/login", form);

    if (res.token && res.user) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      // Role-based redirection
      const role = res.user.role;
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "user") {
        navigate("/tickets");
      } else {
        alert("Login successful, but unknown role");
      }
    } else {
      alert("Login successful but token or user data missing");
    }
  } catch (error) {
    alert(error.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-transparent relative z-10">
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 text-white shadow-md border border-blue-500 border-opacity-50">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-500">
          Login Page
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block mb-1 text-lg text-black">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-700 text-black bg-transparent placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password with toggle */}
          <div className="relative">
            <label className="block mb-1 text-lg text-black">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-700 text-black bg-transparent placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
            <div
              className="absolute right-3 top-[39px] cursor-pointer text-black"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </div>
          </div>

          {/* Role Selection (Admin/User) */}
          <div>
            <label className="block mb-2 text-sm font-medium text-black">Select Role</label>
            <div className="flex gap-4">
              {["user", "admin"].map((roleOption) => (
                <label
                  key={roleOption}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border transition-all duration-200 
                    ${
                      form.role === roleOption
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-black border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                    }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={roleOption}
                    checked={form.role === roleOption}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="capitalize font-medium">{roleOption}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
