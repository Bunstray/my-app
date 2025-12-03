import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import placeholderbanner from "/src/assets/Banner/PlaceholderBanner.png";
import bandul321 from "/src/assets/Bandul/Bandul3-2-1.png";
import bandul31 from "/src/assets/Bandul/Bandul3-1.png";

export default function CreateEventPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // Admin check
  useEffect(() => {
    const r = localStorage.getItem("role");
    setRole(r);
    if (r !== "admin") {
      navigate("/acara"); // prevent access for regular users
    }
  }, [navigate]);

  // Handle image upload
  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };
  const handleProceed = async () => {
    if (!title || !date || !selectedCategory) {
      alert("Mohon lengkapi semua data acara.");
      return;
    }

    const created_by = localStorage.getItem("id");

    const res = await fetch(
      "https://unpitiful-defilingly-floretta.ngrok-free.dev:5000/events",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          date,
          category: selectedCategory,
          banner: "", // placeholder
          created_by,
        }),
      }
    );

    const data = await res.json();

    navigate(`/admin/event/${data.eventId}`);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F1E4] pb-10">
      {/* BANNER UPLOAD */}
      <div className="w-full h-48 overflow-hidden relative">
        {bannerPreview ? (
          <img
            src={bannerPreview}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <p className="text-gray-600">Upload Banner Acara</p>
          </div>
        )}

        {/* Upload Button */}
        <input
          type="file"
          accept="image/*"
          onChange={handleBannerUpload}
          className="absolute top-2 right-2 bg-white rounded-md shadow px-3 py-1 cursor-pointer"
        />
      </div>

      {/* HEADER */}
      <div className="px-4 mt-5">
        <h1 className="text-xl font-bold text-[#1F1F1F] mb-4">
          Pembuatan Acara Baru
        </h1>

        {/* EVENT TITLE */}
        <label className="font-semibold text-sm">Nama sesi</label>
        <input
          type="text"
          placeholder="Masukkan nama acara..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mt-1 mb-3 border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm"
        />

        {/* EVENT DATE */}
        <label className="font-semibold text-sm">Tanggal acara</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mt-1 mb-5 border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm"
        />

        {/* DESCRIPTION TEXT */}
        <p className="text-sm text-black mb-5">
          Menembakkan <b>4 anak panah</b>/seri dengan maksimal <b>20 seri</b>{" "}
          untuk 1 sesi.
        </p>

        {/* CATEGORY SELECTION */}
        <div className="flex flex-col gap-5">
          {/* CAT 1 */}
          <div
            onClick={() => setSelectedCategory("3-2-1")}
            className={`cursor-pointer rounded-xl overflow-hidden shadow-md border ${
              selectedCategory === "3-2-1"
                ? "border-[#1A1A1A]"
                : "border-transparent"
            } bg-white`}
          >
            <div className="flex">
              <img
                src={bandul31}
                alt="321"
                className="w-28 h-28 object-cover"
              />
              <div className="p-3 bg-linear-to-b from-white to-[#F0DDBB] flex-1">
                <h2 className="font-semibold">Bandul : 3–2–1</h2>
                <p className="text-sm mt-1 text-gray-700">
                  Skor terdiri dari poin 3, poin 2, poin 1. Bandul ini terbagi
                  menjadi 3 bagian yaitu, Molo, Jonggo, dan Awal.
                </p>
              </div>
            </div>
          </div>

          {/* CAT 2 */}
          <div
            onClick={() => setSelectedCategory("3-1")}
            className={`cursor-pointer rounded-xl overflow-hidden shadow-md border ${
              selectedCategory === "3-1"
                ? "border-[#1A1A1A]"
                : "border-transparent"
            } bg-white`}
          >
            <div className="flex">
              <img src={bandul31} alt="31" className="w-28 h-28 object-cover" />
              <div className="p-3 bg-linear-to-b from-white to-[#F0DDBB] flex-1">
                <h2 className="font-semibold">Bandul : 3–1</h2>
                <p className="text-sm mt-1 text-gray-700">
                  Skor terdiri dari poin 3 dan poin 1. Bandul ini terbagi
                  menjadi 2 bagian yaitu, Molo dan Awal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleCancel}
            className="flex-1 py-2 border border-black rounded-lg bg-white"
          >
            Batal
          </button>

          <button
            onClick={handleProceed}
            className="flex-1 py-2 rounded-lg bg-[#0A192F] text-white"
          >
            Lanjut
          </button>
        </div>
      </div>
    </div>
  );
}
