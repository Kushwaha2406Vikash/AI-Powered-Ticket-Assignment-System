import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { apiRequest } from "../utils/api.js";
import { toast } from "react-toastify";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await apiRequest("GET", `/api/tickets/${id}`);
        setTicket(data.ticket);
      } catch (err) {
        console.error("Error fetching ticket:", err);
        toast.error(err.message || "Failed to fetch ticket");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading)
    return <div className="text-center mt-10">Loading ticket details...</div>;
  if (!ticket) return <div className="text-center mt-10">Ticket not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Ticket Details</h2>

      <div className="card bg-white shadow p-4 space-y-4 text-black">
        <h3 className="text-xl font-semibold text-blue-600">{ticket.title}</h3>
        <p className="text-blue-400">{ticket.description}</p>

        {ticket.status && (
          <>
            <div className="divider border-t border-gray-600 my-4"></div>
            <p>
              <strong>Status:</strong> {ticket.status}
            </p>
            {ticket.priority && (
              <p>
                <strong>Priority:</strong> {ticket.priority}
              </p>
            )}
            {ticket.relatedSkills?.length > 0 && (
              <p>
                <strong>Related Skills:</strong>{" "}
                {ticket.relatedSkills.join(", ")}
              </p>
            )}
            {ticket.helpfulNotes && (
              <div>
                <strong>Helpful Notes:</strong>
                <div className="prose prose-invert max-w-none rounded mt-2 text-blue-600 ">
                  <ReactMarkdown >{ticket.helpfulNotes}</ReactMarkdown>
                </div>
              </div>
            )}
            {ticket.assignedTo && (
              <p>
                <strong>Assigned To:</strong> {ticket.assignedTo?.email}
              </p>
            )}
            {ticket.createdAt && (
              <p className="text-sm text-black mt-2">
                Created At: {new Date(ticket.createdAt).toLocaleString()}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
