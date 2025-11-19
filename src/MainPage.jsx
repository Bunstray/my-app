import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bigcat from "./assets/bigcat.png";
import cat from "./assets/cat.png";
import stair from "./assets/stair.png";
import layla from "./assets/layla.png";
import arrow from "./assets/arrow.png";
import bow from "./assets/bow.png";
import graph from "./assets/bar-graph.png";
import sponsor1 from "./assets/sponsors/sponsor1.png";
import sponsor2 from "./assets/sponsors/sponsor2.png";
import sponsor3 from "./assets/sponsors/sponsor3.png";
import sponsor4 from "./assets/sponsors/sponsor4.png";
import sponsor5 from "./assets/sponsors/sponsor5.png";
import sponsor6 from "./assets/sponsors/sponsor6.png";

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
    <div className="min-h-screen w-full bg-[#FAF7EF] flex flex-col pb-28">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Halo,</p>
            <h1 className="text-xl font-semibold text-[#12203D] truncate">
              {username}
            </h1>
          </div>

          <button
            onClick={() => navigate("/notification")}
            className="relative w-10 h-10 flex items-center justify-center rounded-lg"
            aria-label="notifications"
          >
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              1
            </span>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3602/3602145.png"
              alt="notif"
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
      {/* Carousel */}
      <div className="px-4">
        <div className="w-full rounded-2xl overflow-hidden shadow-lg">
          <img
            src={carouselImages[currentIndex]}
            alt={`slide-${currentIndex}`}
            className="w-full h-64 md:h-72 object-cover"
          />
        </div>

        <div className="flex justify-center mt-3 mb-4 gap-2">
          {carouselImages.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === currentIndex ? "bg-[#12203D]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      {/* Main Panel */}
      <div className="mx-4 mt-2 bg-white rounded-2xl shadow-sm p-5 flex justify-around">
        <button
          onClick={() => navigate("/acara")}
          className="flex flex-col items-center"
        >
          <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
            <img src={bow} className="w-8" alt="acara" />
          </div>
          <span className="text-sm mt-2">Acara</span>
        </button>

        <button
          onClick={() => navigate("/peralatan")}
          className="flex flex-col items-center"
        >
          <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
            <img src={arrow} className="w-8" alt="peralatan" />
          </div>
          <span className="text-sm mt-2">Peralatan</span>
        </button>

        <button
          onClick={() => navigate("/hasil")}
          className="flex flex-col items-center"
        >
          <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
            <img src={graph} className="w-8" alt="hasil" />
          </div>
          <span className="text-sm mt-2">Hasil</span>
        </button>
      </div>
      {/* Sponsor */}
      <h2 className="text-center mt-6 text-gray-600">Sponsor</h2>
      <div className="overflow-hidden mt-2 px-4">
        <div className="flex gap-6 whitespace-nowrap animate-scroll min-w-max">
          {sponsors.map((logo, i) => (
            <img
              key={i}
              src={logo}
              className="w-20 h-20 rounded-lg inline-block"
            />
          ))}
          {/* duplicate for smooth infinite scroll */}
          {sponsors.map((logo, i) => (
            <img
              key={"dup-" + i}
              src={logo}
              className="w-20 h-20 rounded-lg inline-block"
            />
          ))}
        </div>
      </div>

      <div className="h-28" />
      {/* Bottom Navbar - simple, no animation */}
      <nav className="fixed left-4 right-4 bottom-4 z-30">
        <div className="bg-white border shadow-lg rounded-2xl h-18 flex justify-around items-center px-6 py-2">
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

/* Simple nav button: when active, the icon is wrapped by a rounded square */
function SimpleNavButton({ label, icon, active, onClick }) {
  return (
    <button
      className="flex flex-col items-center focus:outline-none"
      onClick={onClick}
    >
      <div className="mb-1">
        {active ? (
          <div className="bg-[#C89F63] rounded-lg w-10 h-10 flex items-center justify-center shadow-sm">
            <img src={icon} alt={label} className="w-6 h-6" />
          </div>
        ) : (
          <div className="bg-transparent rounded-lg w-10 h-10 flex items-center justify-center">
            <img src={icon} alt={label} className="w-6 h-6 opacity-80" />
          </div>
        )}
      </div>
      <span
        className={`text-sm ${active ? "text-[#C89F63]" : "text-gray-500"}`}
      >
        {label}
      </span>
    </button>
  );
}
