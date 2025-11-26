import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import batik from "/src/assets/batik blur 7.png";

export default function ChangePasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Gets the token from the URL (?token=...)
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!token) return alert("Token hilang/invalid.");
    if (password !== confirmPassword) return alert("Password tidak cocok.");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password berhasil diubah! Silakan login.");
        navigate("/");
      } else {
        alert(data.message || "Gagal mereset password.");
      }
    } catch (error) {
      console.error("Reset Error:", error);
      alert("Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFF6EA] font-sans">
      <div
        className="w-full h-[25vh] bg-top bg-repeat-x"
        style={{ backgroundImage: `url(${batik})`, backgroundSize: "cover" }}
      ></div>

      <h1 className="mt-6 text-2xl font-extrabold text-[#0B132B]">
        Password Baru
      </h1>

      <div className="w-[85%] max-w-sm mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password Baru
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-[#0B132B]">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 outline-none text-gray-700 bg-transparent"
              placeholder="Minimal 6 karakter"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Konfirmasi Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-[#0B132B]">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 outline-none text-gray-700 bg-transparent"
              placeholder="Ulangi password"
            />
          </div>
        </div>

        <button
          onClick={handleReset}
          disabled={loading}
          className={`w-full bg-[#0B132B] text-white font-semibold py-2 rounded-md hover:bg-[#1C2541] transition shadow-sm mt-6 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Menyimpan..." : "Simpan Password Baru"}
        </button>
      </div>
    </div>
  );
}
