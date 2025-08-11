import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Tickets() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTickets = async () => {
    try {
      const data = await apiRequest("GET", "/api/tickets");
      setTickets(data.tickets || data);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      if (err?.error?.includes("Access Denied")) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchTickets();
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest("POST", "/api/tickets/create", form);
      setForm({ title: "", description: "" });
      fetchTickets();
    } catch (err) {
      alert(err.message || "Ticket creation failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteTicket = async (id) => {
    

    try {
      await apiRequest("DELETE", `/api/tickets/delete/${id}`);
      toast.success("Ticket deleted successfully");
      fetchTickets();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err.message || "Failed to delete ticket");
    }
  };

  return (
    <div className="px-4 py-10 max-w-4xl mx-auto relative z-10 text-white">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-400">
        Create Support Ticket
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4  bg-white  bg-opacity-90 border border-[#1f6feb] rounded-lg p-6 shadow-pink-700"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Ticket Title"
          className="w-full px-4 py-2 rounded-md bg-transparent text-black border border-[#1f6feb] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Ticket Description"
          rows={4}
          className="w-full px-4 py-2 rounded-md bg-transparent text-black border border-blue-500 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        ></textarea>
        <button
          className="w-full sm:w-auto px-6 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-md transition disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>

      <h2 className="text-xl md:text-2xl font-semibold mt-10 mb-4 text-center text-blue-700 ">
        All Submitted Tickets
      </h2>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="bg-white text-black border border-blue-500 p-4 rounded-lg shadow-md hover:shadow-lg transition relative  shadow-pink-800"
          >
            <Link to={`/tickets/${ticket._id}`}>
              <h3 className="text-lg font-semibold text-blue-700">
                {ticket.title}
              </h3>
              <p className="text-sm mt-1 text-black">{ticket.description}</p>
              <p className="text-xs text-black text-shadow-white mt-2">
                Created At: {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </Link>

            {/* ✅ Show Delete Button Only If Created by Logged-in User */}
            {(ticket.createdBy?._id?.toString?.() || ticket.createdBy?.toString?.()) === user._id && (
              <button
                onClick={() => deleteTicket(ticket._id)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                title="Delete Ticket"
              >
                <FaTrash />
              </button>
            )}
          </div>
        ))}
        {tickets.length === 0 && (
          <p className="text-center text-blue-700 text-sm mt-6">
            No tickets submitted yet.
          </p>
        )}
      </div>
    </div>
  );
}
