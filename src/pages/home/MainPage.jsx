import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bigcat from "/src/assets/bigcat.png";
import cat from "/src/assets/cat.png";
import stair from "/src/assets/stair.png";
import layla from "/src/assets/layla.png";
import arrow from "/src/assets/arrow.png";
import bow from "/src/assets/bow.png";
import graph from "/src/assets/bar-graph.png";
import sponsor1 from "/src/assets/sponsors/sponsor1.png";
import sponsor2 from "/src/assets/sponsors/sponsor2.png";
import sponsor3 from "/src/assets/sponsors/sponsor3.png";
import sponsor4 from "/src/assets/sponsors/sponsor4.png";
import sponsor5 from "/src/assets/sponsors/sponsor5.png";
import sponsor6 from "/src/assets/sponsors/sponsor6.png";

export default function MainPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username") || "User";
  // keep role for later use
  const role = localStorage.getItem("role") || "regular";

  const carouselImages = [cat, bigcat, stair, layla];
  const sponsors = [sponsor1, sponsor2, sponsor3, sponsor4, sponsor5, sponsor6];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const isActive = (path) => {
    const normalized = location.pathname === "/" ? "/home" : location.pathname;
    return normalized === path;
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFAF0] flex flex-col pb-32 font-sans text-[#10284C]">
      {/* Decorative Background Element */}
      <div className="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-[#FFF3DB] to-transparent pointer-events-none -z-0" />

      {/* Header */}
      <div className="relative z-10 px-6 pt-14 pb-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">
            Selamat Datang,
          </p>
          <h1 className="text-2xl font-bold text-[#10284C] tracking-tight truncate max-w-[200px]">
            {username}
          </h1>
        </div>

        <button
          onClick={() => navigate("/notification")}
          className="relative w-12 h-12 bg-white rounded-2xl shadow-sm border border-[#10284C]/10 flex items-center justify-center active:scale-95 transition-transform"
          aria-label="notifications"
        >
          <span className="absolute top-2 right-2 bg-red-500 border-2 border-white w-3 h-3 rounded-full"></span>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3602/3602145.png"
            alt="notif"
            className="w-6 h-6 opacity-80"
          />
        </button>
      </div>

      {/* Carousel */}
      <div className="relative z-10 px-6 mb-8">
        <div className="w-full rounded-3xl overflow-hidden shadow-xl shadow-[#10284C]/10 relative aspect-[16/9]">
          <img
            src={carouselImages[currentIndex]}
            alt={`slide-${currentIndex}`}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
          />
          {/* Subtle overlay gradient for better contrast if text is added later */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center mt-4 gap-2">
          {carouselImages.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? "w-6 bg-[#10284C]" : "w-2 bg-[#10284C]/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Panel Menu */}
      <div className="relative z-10 px-6 mb-10">
        <div className="bg-white rounded-3xl shadow-lg shadow-[#10284C]/5 p-6 flex justify-between items-center border border-[#10284C]/5">
          <MenuButton
            label="Acara"
            icon={bow}
            onClick={() => navigate("/acara")}
            color="bg-blue-50"
          />
          <div className="w-[1px] h-12 bg-gray-100"></div>
          <MenuButton
            label="Peralatan"
            icon={arrow}
            onClick={() => navigate("/peralatan")}
            color="bg-orange-50"
          />
          <div className="w-[1px] h-12 bg-gray-100"></div>
          <MenuButton
            label="Hasil"
            icon={graph}
            onClick={() => navigate("/hasil")}
            color="bg-green-50"
          />
        </div>
      </div>

      {/* Sponsor Section */}
      <div className="relative z-10 mb-6">
        <h2 className="text-center font-bold text-[#10284C] text-lg mb-4 opacity-90">
          Partner Resmi
        </h2>

        {/* Infinite Scroll Container */}
        <div className="overflow-hidden py-2 bg-white/50 backdrop-blur-sm border-y border-[#10284C]/5">
          <div className="flex gap-8 whitespace-nowrap animate-scroll min-w-max px-4 items-center">
            {/* Original List */}
            {sponsors.map((logo, i) => (
              <div
                key={i}
                className="w-20 h-20 bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex items-center justify-center"
              >
                <img
                  src={logo}
                  className="w-full h-full object-contain"
                  alt="sponsor"
                />
              </div>
            ))}
            {/* Duplicate List for Smooth Loop */}
            {sponsors.map((logo, i) => (
              <div
                key={`dup-${i}`}
                className="w-20 h-20 bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex items-center justify-center"
              >
                <img
                  src={logo}
                  className="w-full h-full object-contain"
                  alt="sponsor"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navbar */}
      <nav className="fixed left-6 right-6 bottom-6 z-40">
        <div className="bg-[#FFFFFF]/90 backdrop-blur-md border border-white/20 shadow-2xl shadow-[#10284C]/10 rounded-2xl h-[72px] flex justify-around items-center px-2">
          <SimpleNavButton
            label="Home"
            icon="https://cdn-icons-png.flaticon.com/512/1946/1946436.png"
            active={isActive("/home")}
            onClick={() => navigate("/home")}
          />
          <SimpleNavButton
            label="Acara Saya"
            icon="https://cdn-icons-png.flaticon.com/512/747/747310.png"
            active={isActive("/acarasaya")}
            onClick={() => navigate("/acarasaya")}
          />
          <SimpleNavButton
            label="Akun"
            icon="https://cdn-icons-png.flaticon.com/512/747/747545.png"
            active={isActive("/account")}
            onClick={() => navigate("/account")}
          />
        </div>
      </nav>
    </div>
  );
}

/* Helper Component for Main Menu Buttons */
function MenuButton({ label, icon, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center group active:scale-95 transition-transform duration-200"
    >
      <div
        className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-all`}
      >
        <img
          src={icon}
          className="w-8 h-8 object-contain drop-shadow-sm"
          alt={label}
        />
      </div>
      <span className="text-sm font-semibold text-[#10284C]">{label}</span>
    </button>
  );
}

/* Helper Component for Bottom Nav */
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
