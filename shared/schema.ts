import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Event table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  date: text("date").notNull(), // ISO string format
  location: text("location").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  ticketUrl: text("ticket_url").notNull(),
  featured: boolean("featured").default(false),
  source: text("source").notNull(), // where the event was scraped from
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Subscriber table
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at").notNull(), // ISO string format
});

export const insertSubscriberSchema = createInsertSchema(subscribers).omit({
  id: true
});

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

// Ticket clicks table
export const ticketClicks = pgTable("ticket_clicks", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  eventId: integer("event_id").notNull(),
  timestamp: text("timestamp").notNull(), // ISO string format
  subscribed: boolean("subscribed").default(false),
});

export const insertTicketClickSchema = createInsertSchema(ticketClicks).omit({
  id: true
});

export type InsertTicketClick = z.infer<typeof insertTicketClickSchema>;
export type TicketClick = typeof ticketClicks.$inferSelect;
