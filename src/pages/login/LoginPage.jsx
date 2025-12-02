import React, { useState, useEffect } from "react";
import batik from "/src/assets/batik blur 7.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  // Renamed 'email' to 'identifier' to match its new dual purpose
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (userId) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const res = await fetch("http://34.204.192.78/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send as 'identifier' to the backend
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (res.ok) {
        // alert(data.message); // Optional alert
        localStorage.setItem("id", data.user.id);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("role", data.user.role);

        navigate("/home");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Terjadi kesalahan pada server");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFF6EA] font-sans">
      <div
        className="w-full h-[25vh] bg-top bg-repeat-x"
        style={{
          // Use a placeholder for the preview, uncomment the line below for local use
          backgroundImage: `url(${batik})`,
          // backgroundImage: "linear-gradient(to right, #0B132B, #1C2541)",
          backgroundSize: "cover",
        }}
      ></div>

      <h1 className="mt-6 text-2xl font-extrabold text-[#0B132B]">
        MyJemparingan
      </h1>

      {/* Input Container */}
      <div className="w-[85%] max-w-sm mt-6 space-y-4">
        {/* Email / Username Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email / Username
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-[#0B132B] focus-within:border-transparent transition">
            <svg
              className="w-5 h-5 text-gray-400 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 4 12 13 2 4" />
            </svg>
            <input
              type="text"
              placeholder="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
          </div>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-[#0B132B] focus-within:border-transparent transition">
            <svg
              className="w-5 h-5 text-gray-400 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="text-xs text-gray-500 ml-2 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <Link
            to="/resetpw"
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
          >
            Lupa Password?
          </Link>
        </div>

        {/* Main buttons */}
        <button
          onClick={handleLogin}
          className="w-full bg-[#0B132B] text-white font-semibold py-2 rounded-md hover:bg-[#1C2541] transition shadow-sm mt-6"
        >
          Masuk
        </button>

        <button className="w-full border border-[#0B132B]/30 text-[#0B132B] font-medium py-2 rounded-md bg-white hover:bg-gray-100 transition shadow-sm">
          Masuk sebagai Tamu
        </button>

        <p className="text-center text-sm text-gray-700 pt-2">
          Belum punya akun?{" "}
          <Link
            to="/daftar"
            className="text-blue-600 font-medium hover:underline"
          >
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
