import { useNavigate } from "react-router-dom";

export default function PeralatanPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#FFFAF0] px-6 py-8 font-poppins flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[#10284C] opacity-5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-[#C89F63] opacity-10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-sm">
        <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg border border-[#10284C]/5 animate-bounce-slow">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3094/3094849.png"
            alt="Construction"
            className="w-16 h-16 opacity-80"
          />
        </div>

        <h1 className="text-2xl font-bold text-[#10284C] mb-2">
          Sedang Dalam Pengerjaan
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed mb-8">
          Halaman <strong>Peralatan</strong> sedang kami persiapkan untuk
          memberikan pengalaman terbaik bagi Anda. Silakan cek kembali nanti!
        </p>

        <button
          onClick={() => navigate("/home")}
          className="w-full bg-[#10284C] text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-[#1C2541] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1946/1946436.png"
            className="w-4 h-4 brightness-0 invert"
            alt="home"
          />
          Kembali ke Beranda
        </button>
      </div>

      {/* Footer Text */}
      <div className="absolute bottom-8 text-xs text-gray-400">
        MyJemparingan © 2025
      </div>
    </div>
  );
}
