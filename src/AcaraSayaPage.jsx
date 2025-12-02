import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import placeholderbanner from "/src/assets/Banner/PlaceholderBanner.png";

export default function AcaraSayaPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    fetchJoinedEvents();
  }, [userId]);

  const fetchJoinedEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://34.204.192.78:5000/user/${userId}/joined-events`
      );
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((ev) => {
    if (filterStatus === "all") return true;
    return ev.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "preparation":
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
            Persiapan
          </span>
        );
      case "uncompleted":
        return (
          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded animate-pulse">
            ● Berlangsung
          </span>
        );
      case "completed":
        return (
          <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded">
            Selesai
          </span>
        );
      default:
        return null;
    }
  };

  if (loading)
    return <div className="p-6 text-center text-gray-500">Memuat acara...</div>;

  return (
    <div className="bg-[#FFFAF0] min-h-screen flex flex-col font-poppins pb-32">
      {/* HEADER */}
      <div className="p-6 pb-2">
        <h1 className="text-2xl font-bold text-[#10284C] mb-1">Acara Saya</h1>
        <p className="text-sm text-gray-500">
          Daftar kompetisi yang Anda ikuti.
        </p>
      </div>

      {/* FILTER TABS */}
      <div className="px-6 mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: "all", label: "Semua" },
          { id: "preparation", label: "Persiapan" },
          { id: "uncompleted", label: "Berlangsung" },
          { id: "completed", label: "Selesai" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all ${
              filterStatus === tab.id
                ? "bg-[#10284C] text-white border-[#10284C]"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* EVENT LIST */}
      <div className="p-6 space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-10 opacity-50">
            <img
              src="/src/assets/bow.png"
              className="w-16 h-16 mx-auto mb-4 grayscale"
              alt="empty"
            />
            <p className="text-gray-500">Belum ada acara dengan status ini.</p>
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const isOngoing = ev.status === "uncompleted";
            const targetId = ev.eventId || ev.id;

            return (
              <div
                key={targetId || Math.random()}
                onClick={() => targetId && navigate(`/event/${targetId}`)}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden cursor-pointer transition-all hover:shadow-md relative
                  ${
                    isOngoing
                      ? "border-green-500 border-2 ring-2 ring-green-500/20"
                      : "border-gray-200"
                  }
                `}
              >
                <div className="h-32 w-full bg-gray-200 relative">
                  <img
                    src={ev.banner || placeholderbanner}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(ev.status)}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-[#10284C] text-lg leading-tight">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(ev.date).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="bg-[#FFF3DB] px-2 py-1 rounded text-xs font-bold text-[#10284C]">
                      {ev.category}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                    <span className="text-gray-600">
                      Posisi:{" "}
                      <span className="font-bold">{ev.bandul_name}</span>
                    </span>
                    <span className="text-[#10284C] font-bold flex items-center gap-1">
                      Lihat Detail →
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
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
            active={true}
            onClick={() => navigate("/acarasaya")}
          />
          <SimpleNavButton
            label="Akun"
            icon="https://cdn-icons-png.flaticon.com/512/747/747545.png"
            active={false}
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
