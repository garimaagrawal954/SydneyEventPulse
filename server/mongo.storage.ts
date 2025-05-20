import { 
  type Event, 
  type InsertEvent, 
  type TicketClick, 
  type InsertTicketClick, 
  type Subscriber, 
  type InsertSubscriber 
} from "@shared/schema";
import { connectToDatabase } from "./mongo";
import { IStorage } from "./storage";
import { ObjectId } from "mongodb";

export class MongoStorage implements IStorage {
  // Helper method to convert MongoDB document to our schema types
  private mapEventDoc(doc: any): Event {
    if (!doc) return null as unknown as Event;
    return {
      id: doc.id,
      name: doc.name,
      date: doc.date,
      location: doc.location,
      description: doc.description,
      category: doc.category,
      imageUrl: doc.imageUrl,
      ticketUrl: doc.ticketUrl,
      featured: doc.featured,
      source: doc.source
    };
  }

  private mapSubscriberDoc(doc: any): Subscriber {
    if (!doc) return null as unknown as Subscriber;
    return {
      id: doc.id,
      email: doc.email,
      createdAt: doc.createdAt
    };
  }

  private mapTicketClickDoc(doc: any): TicketClick {
    if (!doc) return null as unknown as TicketClick;
    return {
      id: doc.id,
      email: doc.email,
      eventId: doc.eventId,
      timestamp: doc.timestamp,
      subscribed: doc.subscribed
    };
  }

  // Event operations
  async getAllEvents(): Promise<Event[]> {
    const { db } = await connectToDatabase();
    if (!db) {
      console.log('MongoDB not available, unable to get events');
      return [];
    }
    try {
      const events = await db.collection('events').find({}).toArray();
      return events.map(this.mapEventDoc);
    } catch (error) {
      console.error('Error getting events from MongoDB:', error);
      return [];
    }
  }

  async getEventById(id: number): Promise<Event | undefined> {
    const { db } = await connectToDatabase();
    if (!db) {
      console.log('MongoDB not available, unable to get event by ID');
      return undefined;
    }
    try {
      const event = await db.collection('events').findOne({ id });
      return event ? this.mapEventDoc(event) : undefined;
    } catch (error) {
      console.error('Error getting event by ID from MongoDB:', error);
      return undefined;
    }
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const { db } = await connectToDatabase();
    
    // Generate a sequential ID
    const maxIdDoc = await db.collection('events')
      .find({}, { projection: { id: 1 } })
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const nextId = maxIdDoc.length > 0 ? maxIdDoc[0].id + 1 : 1;
    
    const eventWithId = {
      ...insertEvent,
      id: nextId
    };
    
    await db.collection('events').insertOne(eventWithId);
    
    return this.mapEventDoc(eventWithId);
  }

  async updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event | undefined> {
    const { db } = await connectToDatabase();
    
    const result = await db.collection('events').findOneAndUpdate(
      { id },
      { $set: eventData },
      { returnDocument: 'after' }
    );
    
    return result.value ? this.mapEventDoc(result.value) : undefined;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const { db } = await connectToDatabase();
    
    const result = await db.collection('events').deleteOne({ id });
    
    return result.deletedCount === 1;
  }

  // Subscriber operations
  async getAllSubscribers(): Promise<Subscriber[]> {
    const { db } = await connectToDatabase();
    const subscribers = await db.collection('subscribers').find({}).toArray();
    return subscribers.map(this.mapSubscriberDoc);
  }

  async addSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const { db } = await connectToDatabase();
    
    // Check if subscriber already exists
    const existingSubscriber = await db.collection('subscribers')
      .findOne({ email: insertSubscriber.email });
    
    if (existingSubscriber) {
      return this.mapSubscriberDoc(existingSubscriber);
    }
    
    // Generate a sequential ID
    const maxIdDoc = await db.collection('subscribers')
      .find({}, { projection: { id: 1 } })
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const nextId = maxIdDoc.length > 0 ? maxIdDoc[0].id + 1 : 1;
    
    const subscriberWithId = {
      ...insertSubscriber,
      id: nextId,
      createdAt: new Date().toISOString()
    };
    
    await db.collection('subscribers').insertOne(subscriberWithId);
    
    return this.mapSubscriberDoc(subscriberWithId);
  }

  // Ticket click tracking
  async trackTicketClick(insertClick: InsertTicketClick): Promise<TicketClick> {
    const { db } = await connectToDatabase();
    
    // Generate a sequential ID
    const maxIdDoc = await db.collection('ticketClicks')
      .find({}, { projection: { id: 1 } })
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const nextId = maxIdDoc.length > 0 ? maxIdDoc[0].id + 1 : 1;
    
    const clickWithId = {
      ...insertClick,
      id: nextId,
      timestamp: insertClick.timestamp || new Date().toISOString()
    };
    
    await db.collection('ticketClicks').insertOne(clickWithId);
    
    return this.mapTicketClickDoc(clickWithId);
  }

  async getTicketClicks(): Promise<TicketClick[]> {
    const { db } = await connectToDatabase();
    const clicks = await db.collection('ticketClicks').find({}).toArray();
    return clicks.map(this.mapTicketClickDoc);
  }
}

export const mongoStorage = new MongoStorage();