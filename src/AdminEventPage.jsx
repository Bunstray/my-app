import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function AdminEventPage() {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!id) return;
    async function fetchEvent() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/event/${id}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="p-4">
        <p>Loading event...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFAF0] h-screen">
      <div>
        <button onClick={() => navigate("/acara")} className="fixed bg-[#10284C] top-12 left-5 p-2 text-[#FFFFFF] rounded-xl text-sm cursor-pointer flex gap-2 items-center"><img src="/src/assets/back.svg" alt="" />Kembali</button>
        <img src="/src/assets/banner/PlaceholderBanner.png" alt="" className="w-full" />
        <div className="p-4">
          <div className="font-poppins flex justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="font-bold text-xl text-[#10284C]">{event.title}</h2>
              <p>{event.category}</p>
            </div>
            <div>
              <button>
                <img src="/src/assets/light-menu.svg" alt="" />
              </button>
            </div>
          </div>
          <div className="w-full flex flex-row gap-2 my-4">
            <div className="w-1/2 border-2 border-[#00000080] rounded-lg bg-[#FFF3DB]">
              <button className="flex justify-center items-center w-full p-3 h-full gap-2 cursor-pointer">
                <span className="font-bold text-lg">120</span>
                <p className="text-sm">Peserta Terdata</p>
              </button>
            </div>
            <div className="w-1/2 border-2 border-[#00000080] rounded-lg bg-[#F9DDAE]">
              <button className="flex justify-between items-center w-full p-3 h-full cursor-pointer">
                <p className="text-sm">Scan Peserta</p>
                <img src="/src/assets/arrow-right.svg" className="w-6" alt="" />
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-[#10284C]">Nama Peserta</p>
            <form action="" className="flex">
              <div className="relative flex items-center mb-2 w-full gap-2">
                <img src="/src/assets/person.svg" alt="name" className='absolute ml-3 w-3.5 pointer-events-none' />
                <input type="text" className="bg-[#FFFFFF] w-9/10 p-2 rounded-lg border-2 border-[#C4D3DF] pl-8" placeholder="hako" />
                <button type="submit" className="w-1/10 p-2 bg-[#10284C] text-white rounded-lg">+</button>
              </div>
            </form>
          </div>
        </div>
      </div>
        <div className="fixed bottom-0 bg-[#FCE8CA] rounded-t-lg h-[12vh] py-4 w-full text-sm border border-[#00000080]">
          <div className="flex justify-around items-center">
            <button className="bg-[#FFFFFF] border-[#1E1E1E] border rounded-lg p-2 flex items-center justify-around gap-1 w-28">
              <img src="/src/assets/back.svg" className="brightness-0" alt="" />
              <p>Kembali</p>
            </button>
            <p>
              Seri: 1/20
            </p>
            <button className="bg-[#10284C] border-[#1E1E1E] border rounded-lg p-2 text-white flex items-center justify-around gap-1 w-28">
              <p>Lanjut</p>
              <img src="/src/assets/right-white.svg" alt="" />
            </button>
          </div>
        </div>
    </div>
  );
}
