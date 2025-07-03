import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendEmail } from "./sendgrid";
import { z } from "zod";

const emailSchema = z.object({
  to: z.string().email(),
  from: z.string().email(),
  subject: z.string(),
  html: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Email endpoint for ROI calculator results
  app.post("/api/send-email", async (req, res) => {
    try {
      const emailData = emailSchema.parse(req.body);
      
      const success = await sendEmail({
        to: emailData.to,
        from: emailData.from,
        subject: emailData.subject,
        html: emailData.html,
      });

      if (success) {
        res.json({ success: true, message: "Email sent successfully" });
      } else {
        res.status(500).json({ success: false, message: "Failed to send email" });
      }
    } catch (error) {
      console.error("Email endpoint error:", error);
      res.status(400).json({ success: false, message: "Invalid email data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
