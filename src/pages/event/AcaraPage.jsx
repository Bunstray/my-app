import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import placeholderbanner from "/src/assets/Banner/placeholderbanner.png";

export default function AcaraPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [role, setRole] = useState(null);

  // Load role
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  // Load events
  useEffect(() => {
    async function loadEvents() {
      const res = await fetch("http://localhost:5000/events");
      const data = await res.json();
      setEvents(data);
    }
    loadEvents();
  }, []);

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  // CLICK HANDLER
  const handleEventClick = (id) => {
    if (role === "admin") navigate(`/admin/event/${id}`);
    else navigate(`/event/${id}`);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F1E4] px-4 py-6">
      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate("/home")}
        className="mb-4 text-[#1F1F1F] font-semibold"
      >
        ← Kembali
      </button>

      {/* TITLE */}
      <h1 className="text-xl font-bold text-[#1F1F1F] mb-4">Acara Anda</h1>

      {/* SEARCH BAR */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Cari Acara Kamu"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none"
        />
        <span className="absolute right-4 top-2.5 text-gray-500 text-lg">
          🔍
        </span>
      </div>

      {/* EVENT LIST */}
      <div className="flex flex-col gap-6 pb-20">
        {filtered.length === 0 && (
          <p className="text-gray-600 text-center">
            Belum ada acara tersedia...
          </p>
        )}

        {filtered.map((event) => (
          <div
            key={event.id}
            className="rounded-xl overflow-hidden shadow-md bg-white cursor-pointer"
            onClick={() => handleEventClick(event.id)}
          >
            <img
              src={placeholderbanner}
              alt={event.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-4 bg-linear-to-b from-white to-[#DEC498]">
              <h2 className="font-semibold text-lg">{event.title}</h2>
              <p className="text-sm text-gray-700">{event.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ADMIN ONLY BUTTON */}
      {role === "admin" && (
        <button
          onClick={() => navigate("/acara/create")}
          className="fixed bottom-6 right-6 bg-[#1A1A1A] text-white px-5 py-3 rounded-full shadow-lg"
        >
          Buat Sesi Baru →
        </button>
      )}
    </div>
  );
}
