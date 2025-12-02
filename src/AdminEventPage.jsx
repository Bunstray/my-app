import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

export default function AdminEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // -- STATE --
  const [event, setEvent] = useState(null);
  const [banduls, setBanduls] = useState([]);
  const [selectedBandulId, setSelectedBandulId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [rambahan, setRambahan] = useState(1);
  const [viewMode, setViewMode] = useState("input"); // 'input' or 'rank'

  // UI State
  const [expandedParticipant, setExpandedParticipant] = useState(null);
  const [selectedArrowSlot, setSelectedArrowSlot] = useState(1);
  const [unsavedChanges, setUnsavedChanges] = useState({});
  const [showLockConfirm, setShowLockConfirm] = useState(false); // Modal state

  // Leaderboard State
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [rankType, setRankType] = useState("total");

  const componentRef = useRef(null);

  // -- FETCHING DATA --
  useEffect(() => {
    fetchEventDetails();
    fetchBanduls();
  }, [id]);

  useEffect(() => {
    if (viewMode === "input" && selectedBandulId) {
      fetchParticipants();
    } else if (viewMode === "rank") {
      fetchLeaderboard();
    }
  }, [selectedBandulId, rambahan, viewMode, rankType]);

  const fetchEventDetails = async () => {
    const res = await fetch(`http://34.204.192.78/event/${id}`);
    const data = await res.json();
    setEvent(data);
  };

  const fetchBanduls = async () => {
    const res = await fetch(`http://34.204.192.78/event/${id}/bandul`);
    const data = await res.json();
    setBanduls(data);
    if (data.length > 0 && !selectedBandulId) setSelectedBandulId(data[0].id);
  };

  const fetchParticipants = async () => {
    if (!selectedBandulId) return;
    const res = await fetch(
      `http://34.204.192.78/bandul/${selectedBandulId}/participants?rambahan=${rambahan}`
    );
    const data = await res.json();

    const initialScores = {};
    data.forEach((p) => {
      initialScores[p.id] = {
        arrow1: p.arrow1 || 0,
        arrow2: p.arrow2 || 0,
        arrow3: p.arrow3 || 0,
        arrow4: p.arrow4 || 0,
      };
    });
    setUnsavedChanges(initialScores);
    setParticipants(data);
  };

  const fetchLeaderboard = async () => {
    let url = `http://34.204.192.78/event/${id}/leaderboard?type=${rankType}&rambahan=${rambahan}`;
    if (selectedBandulId) url += `&bandulId=${selectedBandulId}`;
    else url += `&bandulId=all`;
    const res = await fetch(url);
    const data = await res.json();
    setLeaderboardData(data);
  };

  // -- LOGIC HELPERS --
  const currentBandul = banduls.find((b) => b.id === selectedBandulId);
  const allBandulsLocked =
    banduls.length > 0 && banduls.every((b) => !!b.is_locked); // Fixed boolean check

  const isInputAllowed =
    event?.status === "uncompleted" &&
    currentBandul &&
    !currentBandul.is_locked; // This checks 0 or 1 correctly in logic

  // -- HANDLERS --

  const handleUpdateEventStatus = async (newStatus) => {
    const confirmMsg =
      newStatus === "uncompleted"
        ? "Mulai acara? Status akan berubah menjadi 'Uncompleted'."
        : "Selesaikan acara? Event akan ditutup.";

    if (!window.confirm(confirmMsg)) return;

    try {
      await fetch(`http://34.204.192.78/event/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchEventDetails();
    } catch (err) {
      alert("Gagal update status");
    }
  };

  const handleLockBandul = async () => {
    try {
      await fetch(`http://34.204.192.78/bandul/${selectedBandulId}/lock`, {
        method: "PUT",
      });
      setShowLockConfirm(false);
      fetchBanduls(); // Refresh to get new lock status
    } catch (err) {
      alert("Gagal mengunci bandul");
    }
  };

  const handleScoreInput = (value) => {
    if (!expandedParticipant || !isInputAllowed) return;

    setUnsavedChanges((prev) => ({
      ...prev,
      [expandedParticipant]: {
        ...prev[expandedParticipant],
        [`arrow${selectedArrowSlot}`]: value,
      },
    }));

    if (selectedArrowSlot < 4) setSelectedArrowSlot(selectedArrowSlot + 1);
  };

  const saveScore = async (participantId) => {
    const scores = unsavedChanges[participantId];
    try {
      await fetch("http://34.204.192.78/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant_id: participantId,
          rambahan: rambahan,
          ...scores,
        }),
      });
      setExpandedParticipant(null);
      fetchParticipants();
    } catch (err) {
      alert("Failed to save score");
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Hasil-${event?.title || "Jemparingan"}`,
  });

  const handleModeSwitch = (mode) => {
    setViewMode(mode);
    if (mode === "input" && !selectedBandulId && banduls.length > 0) {
      setSelectedBandulId(banduls[0].id);
    }
  };

  if (!event) return <div className="p-4">Loading event...</div>;

  const getScoreButtons = () => {
    const category = event.category;
    const buttons = [];
    if (category === "3-2-1") {
      buttons.push({ val: 3, label: "3", color: "bg-red-500 text-white" });
      buttons.push({ val: 2, label: "2", color: "bg-yellow-400 text-black" });
      buttons.push({ val: 1, label: "1", color: "bg-white text-black" });
    } else {
      buttons.push({
        val: 3,
        label: "3 (Kepala)",
        color: "bg-red-500 text-white",
      });
      buttons.push({
        val: 1,
        label: "1 (Badan)",
        color: "bg-white text-black",
      });
    }
    buttons.push({ val: 0, label: "Meleset", color: "bg-black text-white" });
    return buttons;
  };

  return (
    <div className="bg-[#FFFAF0] min-h-screen flex flex-col font-poppins pb-32">
      {/* NAVIGATION OVERLAY BUTTON */}
      <button
        onClick={() => navigate("/acara")}
        className="fixed top-4 left-4 z-20 bg-[#10284C] text-white p-2 rounded-xl text-sm shadow-md flex gap-2 items-center"
      >
        <img
          src="/src/assets/back.svg"
          alt=""
          className="w-4 h-4 brightness-0 invert"
        />
        Kembali
      </button>

      {/* HEADER SECTION */}
      <div className="bg-[#FFFAF0] sticky top-0 z-10 shadow-sm">
        <div className="w-full h-48 overflow-hidden relative">
          <img
            src={event.banner || "/src/assets/banner/PlaceholderBanner.png"}
            alt="Event Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 w-full h-10 bg-gradient-to-t from-[#FFFAF0] to-transparent"></div>
        </div>

        <div className="px-4 pb-4">
          <div className="flex justify-between items-start mt-2">
            <div>
              <h1 className="text-xl font-bold text-[#10284C]">
                {event.title}
              </h1>
              <p className="text-sm text-gray-600">
                Kategori: {event.category} | Status:{" "}
                <span className="font-bold uppercase">{event.status}</span>
              </p>
            </div>

            {/* --- START / FINISH EVENT BUTTON --- */}
            <div>
              {event.status === "preparation" && (
                <button
                  onClick={() => handleUpdateEventStatus("uncompleted")}
                  className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md hover:bg-green-700 animate-pulse"
                >
                  Mulai Acara ▶
                </button>
              )}

              {event.status === "uncompleted" && allBandulsLocked && (
                <button
                  onClick={() => handleUpdateEventStatus("completed")}
                  className="bg-[#10284C] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md hover:bg-blue-900"
                >
                  Selesai Acara ✅
                </button>
              )}

              {event.status === "completed" && (
                <span className="bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded">
                  Selesai
                </span>
              )}
            </div>
          </div>

          {/* MODE TOGGLE */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => handleModeSwitch("input")}
              className={`flex-1 p-2 rounded-lg font-bold transition ${
                viewMode === "input"
                  ? "bg-[#10284C] text-white"
                  : "bg-[#FFF3DB] border border-black/20"
              }`}
            >
              Input Skor
            </button>
            <button
              onClick={() => handleModeSwitch("rank")}
              className={`flex-1 p-2 rounded-lg font-bold transition ${
                viewMode === "rank"
                  ? "bg-[#10284C] text-white"
                  : "bg-[#FFF3DB] border border-black/20"
              }`}
            >
              Peringkat
            </button>
          </div>

          {/* BANDUL FILTER */}
          <div className="mt-4">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Pilih Bandul
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 mt-1 scrollbar-hide">
              {viewMode === "rank" && (
                <button
                  onClick={() => setSelectedBandulId(null)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm border ${
                    !selectedBandulId ? "bg-[#10284C] text-white" : "bg-white"
                  }`}
                >
                  Semua
                </button>
              )}

              {banduls.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBandulId(b.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm border flex items-center gap-1 ${
                    selectedBandulId === b.id
                      ? "bg-[#10284C] text-white"
                      : "bg-white"
                  }`}
                >
                  {/* FIXED: Use !! to force boolean so '0' doesn't print */}
                  {!!b.is_locked && <span>🔒</span>}
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="p-4 flex-1">
        {/* === INPUT MODE === */}
        {viewMode === "input" && (
          <div className="space-y-4">
            {!isInputAllowed && selectedBandulId && (
              <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm font-bold text-center border border-red-200">
                {event.status === "preparation"
                  ? "Acara belum dimulai."
                  : event.status === "completed"
                  ? "Acara sudah selesai."
                  : "Bandul ini terkunci (Selesai)."}
              </div>
            )}

            {participants.map((p) => {
              const isExpanded = expandedParticipant === p.id;
              const currentScores = unsavedChanges[p.id] || {
                arrow1: 0,
                arrow2: 0,
                arrow3: 0,
                arrow4: 0,
              };
              const total =
                currentScores.arrow1 +
                currentScores.arrow2 +
                currentScores.arrow3 +
                currentScores.arrow4;
              const misses = [
                currentScores.arrow1,
                currentScores.arrow2,
                currentScores.arrow3,
                currentScores.arrow4,
              ].filter((x) => x === 0).length;

              return (
                <div
                  key={p.id}
                  className={`rounded-lg border border-black/20 overflow-hidden transition-all ${
                    isExpanded ? "bg-[#FFF3DB]" : "bg-white"
                  }`}
                >
                  <div
                    onClick={() => {
                      if (isInputAllowed)
                        setExpandedParticipant(isExpanded ? null : p.id);
                    }}
                    className={`p-4 flex justify-between items-center cursor-pointer ${
                      !isInputAllowed ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    <div>
                      <p className="font-bold text-[#10284C]">{p.name}</p>
                      <p className="text-xs text-gray-600">
                        Total: {total} | Miss: {misses}
                      </p>
                    </div>
                    <div className="text-lg font-bold text-[#10284C]">
                      {isInputAllowed ? (isExpanded ? "▲" : "▼") : "🔒"}
                    </div>
                  </div>

                  {isExpanded && isInputAllowed && (
                    <div className="p-4 border-t border-black/10 bg-[#F2CE92]/20">
                      <p className="text-sm font-bold mb-2">
                        Pilih Anak Panah:
                      </p>
                      <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4].map((num) => (
                          <button
                            key={num}
                            onClick={() => setSelectedArrowSlot(num)}
                            className={`h-10 w-10 rounded-lg border font-bold ${
                              selectedArrowSlot === num
                                ? "bg-[#10284C] text-white ring-2 ring-offset-1 ring-[#10284C]"
                                : "bg-white"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>

                      <p className="text-sm font-bold mb-2">
                        Isi Nilai (untuk Panah {selectedArrowSlot}):
                      </p>
                      <div className="flex gap-2 mb-4 flex-wrap">
                        {getScoreButtons().map((btn) => (
                          <button
                            key={btn.val}
                            onClick={() => handleScoreInput(btn.val)}
                            className={`px-4 py-2 rounded-lg border font-bold shadow-sm ${btn.color}`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      <div className="flex justify-between items-center bg-white p-2 rounded-lg mb-4">
                        <span className="text-xs">Preview:</span>
                        {[1, 2, 3, 4].map((n) => (
                          <span
                            key={n}
                            className="font-mono bg-gray-100 px-2 rounded"
                          >
                            {currentScores[`arrow${n}`] === 0
                              ? "M"
                              : currentScores[`arrow${n}`]}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => saveScore(p.id)}
                        className="w-full bg-[#10284C] text-white py-2 rounded-lg font-bold"
                      >
                        Simpan Skor
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {participants.length === 0 && viewMode === "input" && (
              <div className="text-center text-gray-500 mt-10">
                Pilih Bandul untuk melihat peserta.
              </div>
            )}
          </div>
        )}

        {/* === RANK MODE === */}
        {viewMode === "rank" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2 bg-white rounded-lg p-1 border">
                <button
                  onClick={() => setRankType("rambahan")}
                  className={`px-3 py-1 rounded text-xs font-bold ${
                    rankType === "rambahan" ? "bg-[#10284C] text-white" : ""
                  }`}
                >
                  Rambahan Ini
                </button>
                <button
                  onClick={() => setRankType("total")}
                  className={`px-3 py-1 rounded text-xs font-bold ${
                    rankType === "total" ? "bg-[#10284C] text-white" : ""
                  }`}
                >
                  Total
                </button>
              </div>
              <button
                onClick={handlePrint}
                className="bg-white border p-2 rounded shadow-sm text-xs font-bold"
              >
                🖨️ Cetak
              </button>
            </div>

            <div
              ref={componentRef}
              className="bg-white p-4 rounded-lg shadow-sm print:shadow-none"
            >
              <h2 className="text-center font-bold text-lg mb-2 hidden print:block">
                Hasil {event.title} -{" "}
                {rankType === "total" ? "Overall" : `Rambahan ${rambahan}`}
              </h2>
              <table className="w-full text-sm text-left">
                <thead className="text-[#10284C] uppercase bg-gray-50">
                  <tr>
                    <th className="px-2 py-3">#</th>
                    <th className="px-2 py-3">Nama</th>
                    {rankType === "rambahan" && (
                      <th className="px-2 py-3 text-center">Detail</th>
                    )}
                    <th className="px-2 py-3 text-center">Hit</th>
                    <th className="px-2 py-3 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-2 py-3 font-bold">{idx + 1}</td>
                      <td className="px-2 py-3">
                        <div className="font-medium">{row.name}</div>
                        <div className="text-xs text-gray-500">
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
                      <td colSpan="5" className="text-center py-4">
                        Belum ada data skor.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === RAMBAHAN 20 LOCK BUTTON === */}
        {viewMode === "input" && rambahan === 20 && isInputAllowed && (
          <div className="mt-8 mb-4">
            <button
              onClick={() => setShowLockConfirm(true)}
              className="w-full bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-red-700 transition flex justify-center items-center gap-2"
            >
              🔒 Kunci Bandul (Selesai)
            </button>
            <p className="text-center text-xs text-gray-500 mt-2">
              Tekan tombol ini jika seluruh sesi pada bandul ini telah selesai.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER NAV */}
      <div className="fixed bottom-0 left-0 w-full bg-[#FCE8CA] border-t border-[#00000080] p-4 rounded-t-xl z-20">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button
            disabled={rambahan <= 1}
            onClick={() => setRambahan((r) => r - 1)}
            className="bg-white border border-[#1E1E1E] rounded-lg px-4 py-2 flex items-center gap-2 disabled:opacity-50"
          >
            ← Prev
          </button>

          <div className="font-bold text-[#10284C]">
            Rambahan: {rambahan} / 20
          </div>

          <button
            disabled={rambahan >= 20}
            onClick={() => setRambahan((r) => r + 1)}
            className="bg-[#10284C] text-white border border-[#1E1E1E] rounded-lg px-4 py-2 flex items-center gap-2 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>

      {/* === LOCK CONFIRMATION MODAL === */}
      {showLockConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-[#10284C] mb-2">
              Kunci Bandul?
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Anda tidak akan bisa mengubah skor lagi setelah bandul dikunci.
              Pastikan semua skor di Rambahan 1-20 sudah benar.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLockConfirm(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleLockBandul}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold"
              >
                Ya, Kunci
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
