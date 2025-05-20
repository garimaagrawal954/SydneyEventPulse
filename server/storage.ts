import { events, type Event, type InsertEvent, type TicketClick, type InsertTicketClick, type Subscriber, type InsertSubscriber } from "@shared/schema";

export interface IStorage {
  // Event operations
  getAllEvents(): Promise<Event[]>;
  getEventById(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Subscriber operations
  getAllSubscribers(): Promise<Subscriber[]>;
  addSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  
  // Ticket click tracking
  trackTicketClick(click: InsertTicketClick): Promise<TicketClick>;
  getTicketClicks(): Promise<TicketClick[]>;
}

export class MemStorage implements IStorage {
  private events: Map<number, Event>;
  private subscribers: Map<number, Subscriber>;
  private ticketClicks: Map<number, TicketClick>;
  private eventCurrentId: number;
  private subscriberCurrentId: number;
  private ticketClickCurrentId: number;

  constructor() {
    this.events = new Map();
    this.subscribers = new Map();
    this.ticketClicks = new Map();
    this.eventCurrentId = 1;
    this.subscriberCurrentId = 1;
    this.ticketClickCurrentId = 1;
  }

  // Event operations
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEventById(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventCurrentId++;
    const event: Event = { 
      ...insertEvent, 
      id,
      featured: insertEvent.featured ?? false 
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event | undefined> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) return undefined;
    
    const updatedEvent: Event = { ...existingEvent, ...eventData };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  // Subscriber operations
  async getAllSubscribers(): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values());
  }

  async addSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    // Check if this email already exists
    const existingSubscriber = Array.from(this.subscribers.values()).find(
      sub => sub.email === insertSubscriber.email
    );
    
    if (existingSubscriber) {
      return existingSubscriber;
    }
    
    const id = this.subscriberCurrentId++;
    const subscriber: Subscriber = { ...insertSubscriber, id };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }

  // Ticket click tracking
  async trackTicketClick(insertClick: InsertTicketClick): Promise<TicketClick> {
    const id = this.ticketClickCurrentId++;
    const click: TicketClick = { 
      ...insertClick, 
      id,
      subscribed: insertClick.subscribed ?? false 
    };
    this.ticketClicks.set(id, click);
    return click;
  }

  async getTicketClicks(): Promise<TicketClick[]> {
    return Array.from(this.ticketClicks.values());
  }
}

// Import MongoDB storage implementation
import { mongoStorage } from './mongo.storage';
import { connectToDatabase, initializeCollections, isMongoAvailable } from './mongo';

// Initialize MongoDB when we have credentials
(async () => {
  try {
    await connectToDatabase();
    await initializeCollections();
    console.log('MongoDB initialized successfully');
  } catch (error) {
    console.error('Failed to initialize MongoDB:', error);
  }
})();

// Import MongoDB storage implementation
import { mongoStorage } from './mongo.storage';

// Use MongoDB storage for the application
export const storage = mongoStorage;
