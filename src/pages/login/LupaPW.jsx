import React, { useState } from "react";
import batik from "/src/assets/batik blur 7.png"; // Matches your specific asset path
import { Link, useNavigate } from "react-router-dom";

export default function LupaPwWage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async () => {
    if (!email) {
      alert("Harap masukkan email Anda");
      return;
    }

    setLoading(true);
    try {
      // 1. Send the email to the backend
      const res = await fetch("http://3.229.130.181:5000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        // 2. Success feedback
        alert("Jika email terdaftar, link reset telah dikirim ke inbox Anda.");
        navigate("/"); // Redirect back to login page
      } else {
        alert(data.message || "Gagal mengirim request.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal terhubung ke server. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFF6EA] font-sans">
      {/* Header Image (Batik) */}
      <div
        className="w-full h-[25vh] bg-top bg-repeat-x"
        style={{
          backgroundImage: `url(${batik})`,
          backgroundSize: "cover",
        }}
      ></div>

      <h1 className="mt-6 text-2xl font-extrabold text-[#0B132B]">
        Lupa Password
      </h1>

      <p className="w-[85%] max-w-sm mt-2 text-center text-sm text-gray-600 leading-relaxed">
        Masukkan email yang terdaftar untuk menerima link reset password.
      </p>

      {/* Input Container */}
      <div className="w-[85%] max-w-sm mt-6 space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
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
              type="email"
              placeholder="jemparingan@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleResetRequest}
          disabled={loading}
          className={`w-full bg-[#0B132B] text-white font-semibold py-2 rounded-md hover:bg-[#1C2541] transition shadow-sm mt-6 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Mengirim..." : "Kirim Link Reset"}
        </button>

        {/* Back to Login Link */}
        <div className="text-center mt-4">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-[#0B132B] hover:underline flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali ke Halaman Login
          </Link>
        </div>
      </div>
    </div>
  );
}
