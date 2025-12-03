import React, { useState } from "react";
import batik from "/src/assets/batik blur 7.png";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conpassword, setConPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setConShowPassword] = useState(false);
  const [username, setUsername] = useState("");

  const handleRegister = async () => {
    const res = await fetch("http://3.229.130.181:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password, conpassword }),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFF6EA] font-sans">
      <div
        className="w-full h-[25vh] bg-top bg-repeat-x"
        style={{
          backgroundImage: `url(${batik})`, // ✅ use imported variable
          backgroundSize: "cover", // optional, adjust fit
        }}
      ></div>

      <h1 className="mt-6 text-2xl font-extrabold text-[#0B132B]">
        MyJemparingan
      </h1>
      {/*username*/}
      <div className="w-[85%] max-w-sm mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
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
              type="email"
              placeholder="jemparingan@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
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
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
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
              placeholder="letsgojemparingan"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="text-xs text-gray-500 ml-2"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
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
              type={showConPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={conpassword}
              onChange={(e) => setConPassword(e.target.value)}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
            <button
              type="button"
              onClick={() => setConShowPassword((p) => !p)}
              className="text-xs text-gray-500 ml-2"
            >
              {showConPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Main buttons */}
        <button
          onClick={handleRegister}
          className="w-full bg-[#0B132B] text-white font-semibold py-2 rounded-md hover:bg-[#1C2541] transition"
        >
          Daftar
        </button>

        <button className="w-full border border-[#0B132B]/30 text-[#0B132B] font-medium py-2 rounded-md bg-white hover:bg-gray-100 transition">
          Masuk sebagai Tamu
        </button>

        <p className="text-center text-sm text-gray-700">
          Sudah punya akun?{" "}
          <Link to="/" className="text-blue-600 font-medium hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
