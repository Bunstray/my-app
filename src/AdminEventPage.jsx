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
        <button onClick={() => navigate("/acara")} className="fixed bg-[#10284C] top-12 left-5 p-2 text-[#FFFFFF] rounded-xl text-sm cursor-pointer">Kembali</button>
        <img src="/src/assets/banner/PlaceholderBanner.png" alt="" className="w-full" />
        <div className="p-4">
          <div className="font-poppins">
            <h2 className="font-bold">{event.title}</h2>
            <p>{event.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
