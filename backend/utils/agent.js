import { createAgent, gemini } from "@inngest/agent-kit";

const analyzeTicket = async (ticket) => {
  

  const supportAgent = createAgent({
    model: gemini({
      model: "gemini-1.5-flash-8b",
      apiKey: process.env.GEMINI_API_KEY,
      responseMimeType: "application/json", 
    }),
    name: "AI Ticket Triage Assistant",
    system: `You are an expert AI assistant that processes technical support tickets.

Your job is to:
1. Summarize the issue.
2. Estimate its priority.
3. Provide helpful notes and resource links for human moderators.
4. List relevant technical skills required.

IMPORTANT:
- Respond with *only* valid raw JSON.
- Do NOT include markdown, code fences, comments, or any extra formatting.
- The format must be a raw JSON object.

Repeat: Do not wrap your output in markdown or code fences.`,
  });

  const response = await supportAgent.run(`You are a ticket triage agent. Only return a strict JSON object with no extra text, headers, or markdown.

Analyze the following support ticket and provide a JSON object with:

- summary: A short 1-2 sentence summary of the issue.
- priority: One of "low", "medium", or "high".
- helpfulNotes: A detailed technical explanation that a moderator can use to solve this issue. Include useful external links or resources if possible.
- relatedSkills: An array of relevant skills required to solve the issue (e.g., ["React", "MongoDB"]).

Respond ONLY in this JSON format and do not include any other text or markdown in the answer:

{
  "summary": "Short summary of the ticket",
  "priority": "high",
  "helpfulNotes": "Here are useful tips...",
  "relatedSkills": ["React", "Node.js"]
}

---

Ticket information:

- Title: ${ticket.title}
- Description: ${ticket.description}`);

  // 🔧 FIXED LINE — previously you had response.output[0].context which does not exist
  const raw = response?.output?.[0]?.content; // ✅ Use `content` instead of `context`

  if (!raw || typeof raw !== "string") {
    console.error("❌ Empty or malformed AI response (missing or invalid content)");
    console.log("Full AI Response Object (if available):", JSON.stringify(response, null, 2));
    return null;
  }

  let jsonString = raw.trim();

  // ✅ This is fine to keep in case AI still includes triple backticks
  if (jsonString.startsWith("```")) {
    const match = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (match) {
      jsonString = match[1].trim();
    }
  }

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("❌ Failed to parse JSON from AI response: " + e.message);
    console.error("Malformed JSON string received:", jsonString);
    return null;
  }
};

export default analyzeTicket;
