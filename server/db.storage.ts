import { events, type Event, type InsertEvent, type TicketClick, type InsertTicketClick, type Subscriber, type InsertSubscriber } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Event operations
  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async getEventById(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(insertEvent).returning();
    return event;
  }

  async updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event | undefined> {
    const [updatedEvent] = await db
      .update(events)
      .set(eventData)
      .where(eq(events.id, id))
      .returning();
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const [deletedEvent] = await db
      .delete(events)
      .where(eq(events.id, id))
      .returning();
    return !!deletedEvent;
  }

  // Subscriber operations
  async getAllSubscribers(): Promise<Subscriber[]> {
    return await db.select().from(events.subscribers);
  }

  async addSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    try {
      const [subscriber] = await db
        .insert(events.subscribers)
        .values(insertSubscriber)
        .returning();
      return subscriber;
    } catch (error) {
      // Check if this email already exists (handling unique constraint)
      if (String(error).includes('duplicate key value')) {
        const email = insertSubscriber.email;
        const [existingSubscriber] = await db
          .select()
          .from(events.subscribers)
          .where(eq(events.subscribers.email, email));
        
        if (existingSubscriber) {
          return existingSubscriber;
        }
      }
      throw error;
    }
  }

  // Ticket click tracking
  async trackTicketClick(insertClick: InsertTicketClick): Promise<TicketClick> {
    const [click] = await db
      .insert(events.ticketClicks)
      .values(insertClick)
      .returning();
    return click;
  }

  async getTicketClicks(): Promise<TicketClick[]> {
    return await db.select().from(events.ticketClicks);
  }
}

export const dbStorage = new DatabaseStorage();