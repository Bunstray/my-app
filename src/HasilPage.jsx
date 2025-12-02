import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import placeholderbanner from "/src/assets/Banner/placeholderbanner.png";

export default function HasilPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("http://34.204.192.78/events");
        const data = await res.json();
        // Filter ONLY completed events
        const completedEvents = data.filter((e) => e.status === "completed");
        setEvents(completedEvents);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500 bg-[#FFFAF0] min-h-screen pt-20">
        Memuat data...
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-[#FFFAF0] px-4 py-6 font-poppins pb-24">
      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate("/home")}
        className="mb-4 text-[#10284C] font-semibold flex items-center gap-2"
      >
        <span>←</span> Kembali
      </button>

      <h1 className="text-xl font-bold text-[#10284C] mb-2">
        Hasil Pertandingan
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Daftar acara yang telah selesai.
      </p>

      <div className="flex flex-col gap-4">
        {events.length === 0 ? (
          <div className="text-center py-10 opacity-50">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl grayscale opacity-50">
              📊
            </div>
            <p className="text-gray-500">
              Belum ada pertandingan yang selesai.
            </p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all"
              onClick={() => navigate(`/event/${event.id}`)}
            >
              {/* Banner Image Section */}
              <div className="h-32 w-full bg-gray-200 relative overflow-hidden">
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
                  <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded shadow-sm border border-gray-300">
                    Selesai
                  </span>
                </div>
              </div>

              <div className="p-4 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-[#10284C] text-lg">
                    {event.title}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(event.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="w-full bg-[#FFFAF0] text-[#10284C] text-sm font-bold py-2 rounded-lg text-center border border-[#10284C]/10 hover:bg-[#10284C] hover:text-white transition-colors">
                  Lihat Peringkat & Skor
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
