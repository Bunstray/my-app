import { useParams } from "react-router-dom";

export default function AdminEventPage() {
  const { id } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Admin Event Page</h1>
      <p>Event ID: {id}</p>
      <p>This is a placeholder. The real design will be added later.</p>
    </div>
  );
}
