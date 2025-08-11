import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './utils/db.js';
import {serve} from "inngest/express";
import userRoutes from './routes/user.js';
import ticketRoutes from './routes/ticket.js'
import { inngest } from './inngest/client.js';
import { onUserSignup } from './inngest/functions/on-signup.js';
import { onTicketCreate } from './inngest/functions/on-ticket-create.js';
// ✅ Load env variables
dotenv.config();

const app = express();

app.use(cors({
  origin: "https://ai-powered-ticket-assignment-system.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Middleware for JSON parsing (optional but common)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*app.use(cors({
  origin: "*",
  credentials: true, // if using cookies or sessions
}));*/

// connect to database
connectDB();

const PORT = process.env.PORT || 8080;

app.use("/api/auth",userRoutes);
 app.use("/api/tickets", ticketRoutes);
 app.use(
   "/api/inngest",
   serve({
     client: inngest,
     functions:[onUserSignup,onTicketCreate],
   })
 )

app.listen(PORT, () => {
  console.log(`✅ Server is listening at port ${PORT}`);
});
