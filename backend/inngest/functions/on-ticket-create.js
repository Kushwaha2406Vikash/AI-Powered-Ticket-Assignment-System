import { inngest } from "../client.js";
import User from "../../models/User.js";
import Ticket from "../../models/Ticket.js";
import { NonRetriableError } from "inngest";
import sendMail from "../../utils/mailer.js";
import analyzeTicket from "../../utils/agent.js";

export const onTicketCreate = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;
      if (!ticketId) {
        return { success: false };
      }

      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId).lean();
        if (!ticketObject) {
          throw new NonRetriableError("Ticket not found");
        }
        return ticketObject;
      });

      await step.run("update-ticket-status", async () => {
        await Ticket.findByIdAndUpdate(ticketId, { status: "TODO" });
      });

      const aiResponse = await analyzeTicket(ticket);
      

      const relatedSkills = await step.run("ai-processing", async () => {
        let skills = [];
        if (aiResponse) {
          await Ticket.findByIdAndUpdate(ticketId, {
            priority: ["low", "medium", "high"].includes(aiResponse.priority)
              ? aiResponse.priority
              : "medium",
            helpfulNotes: aiResponse.helpfulNotes,
            status: "IN_PROGRESS",
            relatedSkills: aiResponse.relatedSkills,
          });
          skills = aiResponse.relatedSkills;
        }
        return skills;
      });

      const moderator = await step.run("assign-moderator", async () => {
        let user = await User.findOne({
          role: "moderator",
          skills: {
            $elemMatch: {
              $regex: relatedSkills.join("|"),
              $options: "i",
            },
          },
        });

        if (!user) {
          user = await User.findOne({ role: "admin" });
        }

        await Ticket.findByIdAndUpdate(ticketId, {
          assignedTo: user?._id || null,
        });

        return user;
      });

      await step.run("send-email-notification", async () => {
        if (moderator) {
          const finalTicket = await Ticket.findById(ticketId).lean();
          await sendMail(
            moderator.email,
            "Ticket Assigned",
            `A new ticket titled "${finalTicket.title}" has been assigned to you.`
          );
        }
      });

      return { success: true };
    } catch (error) {
      console.error("❌ Error running step:", error.message);
      return { success: false };
    }
  }
);
