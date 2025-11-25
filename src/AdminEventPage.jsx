import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function AdminEventPage() {
  const { id } = useParams();
  const { title } = useParams();
  const navigate = useNavigate();


  return (
    <div className="bg-[#FFFAF0] h-screen">
      <div>
        <button onClick={() => navigate("/acara")} className="fixed bg-[#10284C] top-12 left-5 p-2 text-[#FFFFFF] rounded-xl text-sm cursor-pointer">Kembali</button>
        <img src="/src/assets/banner/PlaceholderBanner.png" alt="" className="w-full" />
        <div className="p-4">
          <div className="font-poppins">
            <h2 className="font-bold">title</h2>
            <p>pilihan bandul</p>
          </div>
        </div>
      </div>
    </div>
  );
}
