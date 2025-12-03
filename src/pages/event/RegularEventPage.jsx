import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import placeholderbanner from "/src/assets/Banner/PlaceholderBanner.png";

export default function RegularEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("id"); // Get logged in user ID

  // -- STATE --
  const [event, setEvent] = useState(null);
  const [userStatus, setUserStatus] = useState({
    isRegistered: false,
    data: null,
  });
  const [banduls, setBanduls] = useState([]);

  // Registration State
  const [selectedBandulToJoin, setSelectedBandulToJoin] = useState("");

  // Leaderboard State
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [rankType, setRankType] = useState("total"); // 'total' or 'rambahan'
  const [rambahan, setRambahan] = useState(1);
  const [selectedBandulFilter, setSelectedBandulFilter] = useState(null);

  const componentRef = useRef(null);

  // -- FETCHING --
  useEffect(() => {
    fetchEventDetails();
    fetchUserStatus();
    fetchBanduls();
  }, [id]);

  useEffect(() => {
    // Only fetch leaderboard if we are NOT in registration mode
    // (Or if we want to show leaderboard during preparation too, we can)
    fetchLeaderboard();
  }, [id, rankType, rambahan, selectedBandulFilter]);

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`http://3.229.130.181:5000/event/${id}`);
      if (!res.ok) throw new Error("Event not found");
      const data = await res.json();
      setEvent(data);
    } catch (err) {
      alert("Gagal memuat event");
      navigate("/home");
    }
  };

  const fetchUserStatus = async () => {
    if (!userId) return;
    const res = await fetch(
      `http://3.229.130.181:5000/event/${id}/user-status/${userId}`
    );
    const data = await res.json();
    setUserStatus(data);
  };

  const fetchBanduls = async () => {
    const res = await fetch(`http://3.229.130.181:5000/event/${id}/bandul`);
    const data = await res.json();
    setBanduls(data);
  };

  const fetchLeaderboard = async () => {
    let url = `http://3.229.130.181:5000/event/${id}/leaderboard?type=${rankType}&rambahan=${rambahan}`;
    if (selectedBandulFilter) url += `&bandulId=${selectedBandulFilter}`;
    else url += `&bandulId=all`;

    const res = await fetch(url);
    const data = await res.json();
    setLeaderboardData(data);
  };

  // -- HANDLERS --

  const handleJoinEvent = async () => {
    if (!selectedBandulToJoin) {
      alert("Pilih bandul terlebih dahulu!");
      return;
    }
    if (!userId) {
      alert("Silakan login untuk mendaftar.");
      navigate("/");
      return;
    }

    try {
      const res = await fetch("http://3.229.130.181:5000/join-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: id,
          userId: userId,
          bandulId: selectedBandulToJoin,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Berhasil mendaftar!");
        fetchUserStatus(); // Refresh status
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem.");
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Hasil-${event?.title || "Jemparingan"}`,
  });

  if (!event) return <div className="p-4">Loading...</div>;

  // -- RENDER LOGIC --
  const isPreparation = event.status === "preparation";
  const showRegistration = isPreparation && !userStatus.isRegistered;

  return (
    <div className="bg-[#FFFAF0] min-h-screen flex flex-col font-poppins pb-24">
      {/* HEADER */}
      <button
        onClick={() => navigate("/home")} // Assuming regular users go back to home
        className="fixed top-4 left-4 z-20 bg-[#10284C] text-white p-2 rounded-xl text-sm shadow-md flex gap-2 items-center"
      >
        <img
          src="/src/assets/back.svg"
          alt=""
          className="w-4 h-4 brightness-0 invert"
        />
        Kembali
      </button>

      <div className="bg-[#FFFAF0] sticky top-0 z-10 shadow-sm">
        <div className="w-full h-48 overflow-hidden relative">
          <img
            src={event.banner || placeholderbanner}
            alt="Event Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 w-full h-10 bg-gradient-to-t from-[#FFFAF0] to-transparent"></div>
        </div>
        <div className="px-4 pb-4">
          <h1 className="text-xl font-bold text-[#10284C] mt-2">
            {event.title}
          </h1>
          <p className="text-sm text-gray-600">
            Kategori: {event.category} | Status:{" "}
            <span className="font-bold uppercase">{event.status}</span>
          </p>
        </div>
      </div>

      <div className="p-4 flex-1 max-w-lg mx-auto w-full">
        {/* === SECTION 1: REGISTRATION (Preparation Phase Only) === */}
        {showRegistration && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#10284C]/10 mb-8">
            <h2 className="text-lg font-bold text-[#10284C] mb-2">
              Pendaftaran Peserta
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Acara ini sedang dalam tahap persiapan. Silakan pilih Bandul untuk
              bergabung.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Pilih Bandul
              </label>
              <select
                value={selectedBandulToJoin}
                onChange={(e) => setSelectedBandulToJoin(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-[#FFFAF0] focus:ring-2 focus:ring-[#10284C] outline-none"
              >
                <option value="">-- Pilih Bandul --</option>
                {banduls.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleJoinEvent}
              className="w-full bg-[#10284C] text-white py-3 rounded-lg font-bold hover:bg-[#1C2541] transition"
            >
              Daftar Sekarang
            </button>
          </div>
        )}

        {/* === SECTION 2: USER STATUS (If Registered) === */}
        {userStatus.isRegistered && (
          <div className="bg-green-100 border border-green-300 p-4 rounded-xl mb-6 flex items-center gap-3">
            <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <p className="text-green-800 font-bold text-sm">Anda Terdaftar</p>
              <p className="text-green-700 text-xs">
                Posisi: {userStatus.data.bandul_name}
              </p>
            </div>
          </div>
        )}

        {/* === SECTION 3: LEADERBOARD / SCORE === */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#10284C]">Papan Skor</h2>
            <button
              onClick={handlePrint}
              className="bg-white border p-2 rounded shadow-sm text-xs font-bold flex items-center gap-1"
            >
              🖨️ Cetak
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button
              onClick={() => setRankType("total")}
              className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${
                rankType === "total" ? "bg-[#10284C] text-white" : "bg-white"
              }`}
            >
              Total
            </button>
            <button
              onClick={() => setRankType("rambahan")}
              className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${
                rankType === "rambahan" ? "bg-[#10284C] text-white" : "bg-white"
              }`}
            >
              Per Rambahan
            </button>

            <div className="w-[1px] bg-gray-300 mx-1"></div>

            <button
              onClick={() => setSelectedBandulFilter(null)}
              className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${
                !selectedBandulFilter ? "bg-[#10284C] text-white" : "bg-white"
              }`}
            >
              Semua Bandul
            </button>
            {banduls.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBandulFilter(b.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${
                  selectedBandulFilter === b.id
                    ? "bg-[#10284C] text-white"
                    : "bg-white"
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>

          {/* Table */}
          <div
            ref={componentRef}
            className="bg-white p-4 rounded-lg shadow-sm print:shadow-none min-h-[300px]"
          >
            <h2 className="text-center font-bold text-lg mb-2 hidden print:block">
              Hasil {event.title} -{" "}
              {rankType === "total" ? "Overall" : `Rambahan ${rambahan}`}
            </h2>

            <table className="w-full text-sm text-left">
              <thead className="text-[#10284C] uppercase bg-gray-50 text-xs">
                <tr>
                  <th className="px-2 py-3 rounded-tl-lg">#</th>
                  <th className="px-2 py-3">Nama</th>
                  {rankType === "rambahan" && (
                    <th className="px-2 py-3 text-center">Detail</th>
                  )}
                  <th className="px-2 py-3 text-center">Hit</th>
                  <th className="px-2 py-3 text-center rounded-tr-lg">Total</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-b hover:bg-gray-50 ${
                      row.name === localStorage.getItem("username")
                        ? "bg-yellow-50"
                        : ""
                    }`}
                  >
                    <td className="px-2 py-3 font-bold">{idx + 1}</td>
                    <td className="px-2 py-3">
                      <div className="font-bold text-[#10284C]">
                        {row.name}{" "}
                        {row.name === localStorage.getItem("username") &&
                          "(Anda)"}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {row.bandul_name}
                      </div>
                    </td>
                    {rankType === "rambahan" && (
                      <td className="px-2 py-3 text-center font-mono text-xs">
                        {row.a1}-{row.a2}-{row.a3}-{row.a4}
                      </td>
                    )}
                    <td className="px-2 py-3 text-center">{row.hits}</td>
                    <td className="px-2 py-3 text-center font-bold text-lg">
                      {row.total}
                    </td>
                  </tr>
                ))}
                {leaderboardData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-400">
                      Belum ada data skor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FOOTER NAV (Only needed if viewing Per Rambahan) */}
      <div className="fixed bottom-0 left-0 w-full bg-[#FCE8CA] border-t border-[#00000080] p-4 rounded-t-xl z-20">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button
            disabled={rambahan <= 1}
            onClick={() => setRambahan((r) => r - 1)}
            className={`bg-white border border-[#1E1E1E] rounded-lg px-4 py-2 flex items-center gap-2 disabled:opacity-50 ${
              rankType === "total" ? "opacity-0 pointer-events-none" : ""
            }`}
          >
            ← Prev
          </button>

          <div className="font-bold text-[#10284C]">
            {rankType === "rambahan"
              ? `Rambahan: ${rambahan} / 20`
              : "Total Skor"}
          </div>

          <button
            disabled={rambahan >= 20}
            onClick={() => setRambahan((r) => r + 1)}
            className={`bg-[#10284C] text-white border border-[#1E1E1E] rounded-lg px-4 py-2 flex items-center gap-2 disabled:opacity-50 ${
              rankType === "total" ? "opacity-0 pointer-events-none" : ""
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
