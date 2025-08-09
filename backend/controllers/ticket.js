import { inngest } from "../inngest/client.js";
import Ticket from "../models/Ticket.js";


//  Ticket Creation Controller
export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const newTicket = await Ticket.create({
      title,
      description,
      createdBy: req.user._id.toString(),
    });

    await inngest.send({
      name: "ticket/created",
      data: {
        ticketId: newTicket._id.toString(),
        title,
        description,
        createdBy: req.user._id.toString(),
      },
    });

    return res.status(201).json({
      message: "Ticket created and processing started",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("❌ Error creating ticket:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//  Fetch All Tickets Controller
export const getTickets = async (req, res) => {
  try {
    const user = req.user;
    let tickets = [];

    if (user.role !== "user") {
      tickets = await Ticket.find({})
        .populate("assignedTo", ["email", "_id"])
        .populate("createdBy", ["_id", "email"]) // ✅ Include creator info for delete check
        .sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ createdBy: user._id })
        .select("title description status createdAt createdBy") // ✅ Include createdBy field
        .sort({ createdAt: -1 });
    }

    return res.status(200).json(tickets);
  } catch (error) {
    console.error("❌ Error fetching tickets:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//  Get Single Ticket Details Controller
export const getTicket = async (req, res) => {
  try {
    const user = req.user;
    let ticket;

    if (user.role !== "user") {
      // ✅ Admin/Moderator can view all ticket data
      ticket = await Ticket.findById(req.params.id)
        .populate("assignedTo", ["email", "_id"])
        .populate("createdBy", ["email", "_id"]);
    } else {
      // ✅ Users can only access their own tickets
      ticket = await Ticket.findOne({
        _id: req.params.id,
        createdBy: user._id,
      })
        .select(
          "title description status createdAt priority helpfulNotes relatedSkills assignedTo createdBy"
        )
        .populate("assignedTo", ["email", "_id"]);
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(200).json({ ticket });
  } catch (error) {
    console.error("❌ Error fetching ticket:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
//Delete Single Ticket Details Controller
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // ✅ Only allow deletion if user created the ticket
    if (ticket.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this ticket" });
    }

    await Ticket.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting ticket:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
