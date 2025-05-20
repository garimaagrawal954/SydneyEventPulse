import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { startScraperScheduler } from "./scheduler";
import * as z from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize scraper scheduler
  startScraperScheduler();

  // API endpoints
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }
      
      const event = await storage.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  // Email collection and redirect
  const ticketSchema = z.object({
    email: z.string().email(),
    subscribed: z.boolean(),
    eventId: z.number(),
  });

  app.post("/api/tickets", async (req, res) => {
    try {
      const { email, subscribed, eventId } = ticketSchema.parse(req.body);
      
      const event = await storage.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      // Store the email subscription if opted in
      if (subscribed) {
        await storage.addSubscriber({ 
          email, 
          createdAt: new Date().toISOString() 
        });
      }
      
      // Track the ticket click
      await storage.trackTicketClick({
        email,
        eventId,
        timestamp: new Date().toISOString(),
        subscribed
      });
      
      res.status(200).json({ success: true, redirectUrl: event.ticketUrl });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error processing ticket request:", error);
      res.status(500).json({ error: "Failed to process ticket request" });
    }
  });

  // Newsletter subscription
  const newsletterSchema = z.object({
    email: z.string().email(),
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = newsletterSchema.parse(req.body);
      
      await storage.addSubscriber({ 
        email, 
        createdAt: new Date().toISOString() 
      });
      
      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error processing newsletter subscription:", error);
      res.status(500).json({ error: "Failed to process subscription" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
