import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import placeholderbanner from "/src/assets/Banner/PlaceholderBanner.png";

export default function AcaraPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [role, setRole] = useState(null);
  // Filter state: 'all' (excluding completed), 'preparation', 'uncompleted'
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch(
          "https://unpitiful-defilingly-floretta.ngrok-free.dev:5000/events"
        );
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events", err);
      }
    }
    loadEvents();
  }, []);

  const filtered = events.filter((e) => {
    // 1. Exclude 'completed' events (they go to HasilPage)
    if (e.status === "completed") return false;

    // 2. Search Filter
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());

    // 3. Status Filter (Tabs)
    const matchesStatus =
      filterStatus === "all" ? true : e.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleEventClick = (id) => {
    if (role === "admin") navigate(`/admin/event/${id}`);
    else navigate(`/event/${id}`);
  };

  const getStatusBadge = (status) => {
    if (status === "uncompleted")
      return (
        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded animate-pulse">
          ● Berlangsung
        </span>
      );
    if (status === "preparation")
      return (
        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
          Persiapan
        </span>
      );
    return null;
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFAF0] px-4 py-6 font-poppins pb-24">
      <button
        onClick={() => navigate("/home")}
        className="mb-4 text-[#10284C] font-semibold flex items-center gap-2"
      >
        <span>←</span> Kembali
      </button>

      <h1 className="text-xl font-bold text-[#10284C] mb-4">Daftar Acara</h1>

      {/* SEARCH BAR */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Cari Acara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#10284C] pl-10"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: "all", label: "Semua" },
          { id: "preparation", label: "Persiapan" },
          { id: "uncompleted", label: "Berlangsung" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterStatus(f.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all ${
              filterStatus === f.id
                ? "bg-[#10284C] text-white border-[#10284C]"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* EVENT LIST */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 && (
          <div className="text-center py-10 opacity-50">
            <p className="text-gray-500">Tidak ada acara yang tersedia.</p>
          </div>
        )}

        {filtered.map((event) => {
          const isOngoing = event.status === "uncompleted";

          return (
            <div
              key={event.id}
              className={`rounded-xl overflow-hidden shadow-sm bg-white cursor-pointer transition-all hover:shadow-md border 
                        ${
                          isOngoing
                            ? "border-green-500 ring-2 ring-green-500/30"
                            : "border-gray-200"
                        }
                    `}
              onClick={() => handleEventClick(event.id)}
            >
              {/* Image Section */}
              <div className="relative h-40 w-full bg-gray-200 overflow-hidden">
                <img
                  src={event.banner || placeholderbanner}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = placeholderbanner;
                  }}
                />

                <div className="absolute top-2 right-2">
                  {getStatusBadge(event.status)}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 bg-white">
                <div className="flex justify-between items-start">
                  <h2 className="font-bold text-lg text-[#10284C]">
                    {event.title}
                  </h2>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium text-gray-600">
                    {event.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  📅{" "}
                  {new Date(event.date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADMIN ONLY BUTTON */}
      {role === "admin" && (
        <button
          onClick={() => navigate("/acara/create")}
          className="fixed bottom-6 right-6 bg-[#10284C] text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-3xl hover:bg-[#1C2541] active:scale-95 transition-all z-50"
        >
          +
        </button>
      )}
    </div>
  );
}
