import React, { useState, useEffect } from "react";
import batik from "/src/assets/batik blur 7.png";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // If token exists, we are in RESET mode (forgot password).
  // If no token, we are in CHANGE mode (logged in user).
  const isResetMode = !!token;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      alert("Password baru tidak cocok!");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password minimal 6 karakter");
      return;
    }

    try {
      let url = "";
      let body = {};

      if (isResetMode) {
        // Forgot Password Flow
        url = "http://34.204.192.78/reset-password";
        body = { token, newPassword };
      } else {
        // Logged In Change Password Flow
        const userId = localStorage.getItem("id");
        if (!userId) {
          alert("Sesi habis. Silakan login kembali.");
          navigate("/");
          return;
        }
        if (!oldPassword) {
          alert("Harap masukkan password lama Anda.");
          return;
        }

        url = "http://34.204.192.78/change-password-logged-in";
        body = { userId, oldPassword, newPassword };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Password berhasil diubah! Silakan login.");
        navigate("/");
      } else {
        alert(data.message || "Gagal mengubah password.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server.");
    }
  };

  const handleBack = () => {
    if (isResetMode) {
      // If coming from email link, back goes to login
      navigate("/");
    } else {
      // If logged in, back goes to account page
      navigate("/account");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFF6EA] font-sans">
      <div
        className="w-full h-[25vh] bg-top bg-repeat-x"
        style={{
          backgroundImage: `url(${batik})`,
          // backgroundImage: "linear-gradient(to right, #0B132B, #1C2541)",
          backgroundSize: "cover",
        }}
      ></div>

      <div className="w-[85%] max-w-sm mt-8 space-y-6">
        <h1 className="text-2xl font-extrabold text-[#0B132B] text-center">
          {isResetMode ? "Reset Password" : "Ganti Password"}
        </h1>

        {/* --- OLD PASSWORD FIELD (Only for Logged In users) --- */}
        {!isResetMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Lama (Original)
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
              <input
                type={showOldPass ? "text" : "password"}
                placeholder="Masukkan password saat ini"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="flex-1 outline-none text-gray-700 bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowOldPass(!showOldPass)}
                className="text-xs text-gray-500 ml-2"
              >
                {showOldPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        )}

        {/* --- NEW PASSWORD FIELD --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password Baru
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
            <input
              type={showNewPass ? "text" : "password"}
              placeholder="Minimal 6 karakter"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="flex-1 outline-none text-gray-700 bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowNewPass(!showNewPass)}
              className="text-xs text-gray-500 ml-2"
            >
              {showNewPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* --- CONFIRM PASSWORD FIELD --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Konfirmasi Password Baru
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
            <input
              type={showConfirmPass ? "text" : "password"}
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 outline-none text-gray-700 bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="text-xs text-gray-500 ml-2"
            >
              {showConfirmPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* --- ACTIONS --- */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleBack}
            className="flex-1 border border-[#0B132B] text-[#0B132B] font-semibold py-2 rounded-md hover:bg-gray-100 transition"
          >
            Kembali
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[#0B132B] text-white font-semibold py-2 rounded-md hover:bg-[#1C2541] transition shadow-sm"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
