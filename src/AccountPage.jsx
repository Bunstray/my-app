import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "", role: "" });

  useEffect(() => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    setUser({ username, email, role });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#FFFAF0] font-sans p-6 flex flex-col pb-32">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/home")}
          className="font-bold text-xl text-[#10284C]"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-[#10284C]">Akun Saya</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-black/5 flex flex-col items-center">
        <div className="w-20 h-20 bg-[#10284C] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-[#10284C]/20">
          {user.username ? user.username.charAt(0).toUpperCase() : "?"}
        </div>
        <h2 className="text-xl font-bold text-[#10284C]">
          {user.username || "Tamu"}
        </h2>
        <p className="text-gray-500 text-sm mb-1">{user.email}</p>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-bold uppercase mt-2">
          {user.role || "Guest"}
        </span>
      </div>

      <div className="mt-8 space-y-3">
        <button
          onClick={() => navigate("/change-password")}
          className="w-full bg-white border border-[#10284C] text-[#10284C] py-3 rounded-xl font-bold active:scale-95 transition-transform"
        >
          Ganti Password
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-bold shadow-md shadow-red-600/20 hover:bg-red-700 active:scale-95 transition-all"
        >
          Keluar (Logout)
        </button>
      </div>

      {/* NEW FLOATING ISLAND NAVBAR */}
      <nav className="fixed left-6 right-6 bottom-6 z-40">
        <div className="bg-[#FFFFFF]/90 backdrop-blur-md border border-white/20 shadow-2xl shadow-[#10284C]/10 rounded-2xl h-[72px] flex justify-around items-center px-2">
          <SimpleNavButton
            label="Home"
            icon="https://cdn-icons-png.flaticon.com/512/1946/1946436.png"
            active={false}
            onClick={() => navigate("/home")}
          />
          <SimpleNavButton
            label="Acara Saya"
            icon="https://cdn-icons-png.flaticon.com/512/747/747310.png"
            active={false}
            onClick={() => navigate("/acarasaya")}
          />
          <SimpleNavButton
            label="Akun"
            icon="https://cdn-icons-png.flaticon.com/512/747/747545.png"
            active={true}
            onClick={() => navigate("/account")}
          />
        </div>
      </nav>
    </div>
  );
}

function SimpleNavButton({ label, icon, active, onClick }) {
  return (
    <button
      className="flex flex-col items-center justify-center w-full h-full focus:outline-none relative"
      onClick={onClick}
    >
      {active && (
        <div className="absolute -top-1 w-1/3 h-1 bg-[#10284C] rounded-b-full shadow-[0_0_10px_rgba(16,40,76,0.5)]"></div>
      )}

      <div
        className={`mb-1 transition-all duration-300 ${
          active ? "-translate-y-1" : ""
        }`}
      >
        <div
          className={`${
            active
              ? "bg-[#10284C] shadow-lg shadow-[#10284C]/30"
              : "bg-transparent"
          } rounded-xl w-10 h-10 flex items-center justify-center transition-colors duration-300`}
        >
          <img
            src={icon}
            alt={label}
            className={`w-5 h-5 transition-all duration-300 ${
              active ? "brightness-0 invert scale-110" : "opacity-60 grayscale"
            }`}
          />
        </div>
      </div>

      <span
        className={`text-[10px] font-bold tracking-wide transition-colors duration-300 ${
          active ? "text-[#10284C]" : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
