import axios from "axios";
import { load } from "cheerio";
import { storage } from "./storage";
import { InsertEvent, Event } from "@shared/schema";

// Sample image URLs for events
const eventImages = [
  // Concert/music images
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  
  // Art exhibition images
  "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  
  // Food festival images
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  
  // Sydney landmark images
  "https://images.unsplash.com/photo-1549180030-48bf079fb38a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  "https://images.unsplash.com/photo-1524293581917-878a6d017c71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  "https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
];

// Categories
const categories = [
  "Music", 
  "Arts & Culture", 
  "Food & Drink", 
  "Sports", 
  "Comedy", 
  "Tech", 
  "Wellness"
];

// Sydney locations
const locations = [
  "Sydney Opera House, Bennelong Point",
  "ICC Sydney, 14 Darling Dr, Darling Harbour",
  "Sydney Olympic Park, Olympic Boulevard",
  "Darling Harbour, Tumbalong Park",
  "Museum of Contemporary Art, 140 George St",
  "The Rocks, Sydney",
  "Circular Quay, Wharf 6",
  "Comedy Store, Entertainment Quarter",
  "Centennial Park, Grand Drive",
  "Royal Botanic Garden, Mrs Macquaries Rd"
];

// Function to get a random item from an array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Get random date in the future (within 3 months)
function getRandomFutureDate(): string {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + Math.floor(Math.random() * 90) + 1);
  return futureDate.toISOString();
}

// Scraper for EventBrite
async function scrapeEventbrite(): Promise<InsertEvent[]> {
  try {
    console.log('Scraping Eventbrite...');
    // Using a specific Sydney, Australia search URL to get better results
    const response = await axios.get('https://www.eventbrite.com.au/d/australia--sydney/all-events/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = response.data;
    const $ = load(html);
    
    const events: InsertEvent[] = [];
    
    // Improved EventBrite event cards selector
    $('article.search-event-card').each((i, element) => {
      try {
        // Get event title
        const name = $(element).find('[data-spec="event-card__title"]').text().trim();
        
        // Get event date
        const dateStr = $(element).find('[data-spec="event-card__date"]').text().trim();
        
        // Get event location
        const location = $(element).find('[data-spec="event-card__venue"]').text().trim() || 'Sydney, Australia';
        
        // Get event URL - find the parent link that wraps the entire card
        const eventUrl = $(element).find('a.event-card-link').attr('href') || 
                         $(element).find('a').attr('href') || 
                         'https://www.eventbrite.com.au/';
        
        // Get event image URL
        let imageUrl = $(element).find('img').attr('src') || '';
        if (!imageUrl || imageUrl.includes('data:image')) {
          // Fallback to a random event image if no image found or it's a data URL
          imageUrl = getRandomItem(eventImages);
        }
        
        // Try to extract category from the event page content
        let category = 'Events';
        const eventCategories = $(element).find('[data-spec="event-card__category"]').text().trim();
        
        if (eventCategories.includes('Music')) category = 'Music';
        else if (eventCategories.includes('Art') || eventCategories.includes('Exhibition')) category = 'Arts & Culture';
        else if (eventCategories.includes('Food') || eventCategories.includes('Drink')) category = 'Food & Drink';
        else if (eventCategories.includes('Sport')) category = 'Sports';
        else if (eventCategories.includes('Comedy')) category = 'Comedy';
        else if (eventCategories.includes('Tech') || eventCategories.includes('Science')) category = 'Tech';
        else category = getRandomItem(categories);
        
        // Extract description if available, or create one
        let description = $(element).find('[data-spec="event-card__description"]').text().trim();
        if (!description) {
          description = `Join us for this exciting ${category} event in Sydney. ${name} promises to be a fantastic experience for all attendees.`;
        }
        
        if (name) {
          const event: InsertEvent = {
            name,
            date: dateStr ? new Date(dateStr).toISOString() : getRandomFutureDate(),
            location: location,
            description: description,
            category: category,
            imageUrl: imageUrl,
            ticketUrl: eventUrl.startsWith('http') ? eventUrl : `https://www.eventbrite.com.au${eventUrl}`,
            featured: Math.random() > 0.7, // 30% chance of being featured
            source: 'eventbrite'
          };
          
          events.push(event);
        }
      } catch (error) {
        console.error('Error parsing Eventbrite event:', error);
      }
    });
    
    console.log(`Found ${events.length} events from Eventbrite`);
    return events;
  } catch (error) {
    console.error('Error scraping Eventbrite:', error);
    return [];
  }
}

// Scraper for Meetup
async function scrapeMeetup(): Promise<InsertEvent[]> {
  try {
    console.log('Scraping Meetup...');
    // Using a specific Sydney, Australia search URL with improved headers
    const response = await axios.get('https://www.meetup.com/find/?location=au--sydney&source=EVENTS', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    
    const html = response.data;
    const $ = load(html);
    
    const events: InsertEvent[] = [];
    
    // Multiple selectors to catch different Meetup page structures
    const eventSelectors = [
      '.event-listing', 
      '.event-card',
      '[data-testid="event-card"]',
      '.eventCard',
      'div[id^="event-card-"]'
    ];
    
    for (const selector of eventSelectors) {
      $(selector).each((i, element) => {
        try {
          // Try multiple selectors for the event name
          const name = $(element).find('h2, h3, .event-name, .eventCardHead--title').first().text().trim();
          
          // Try extracting date with multiple selectors
          const dateSelectors = ['.eventTimeDisplay', '.eventCardHead--dateTime', '.dateTime', '[data-testid="event-date"]', '.date-indicator'];
          let dateStr = '';
          for (const dateSelector of dateSelectors) {
            const foundDate = $(element).find(dateSelector).text().trim();
            if (foundDate) {
              dateStr = foundDate;
              break;
            }
          }
          
          // Try extracting location with multiple selectors
          const locationSelectors = ['.venueDisplay', '.eventCardHead--venueName', '.venue-name', '[data-testid="venue-name"]', '.location'];
          let location = '';
          for (const locSelector of locationSelectors) {
            const foundLocation = $(element).find(locSelector).text().trim();
            if (foundLocation) {
              location = foundLocation;
              break;
            }
          }
          
          if (!location) {
            location = 'Sydney, Australia';
          }
          
          // Try extracting the event URL
          const eventUrl = $(element).find('a').attr('href') || 'https://www.meetup.com/';
          
          // Try extracting image URL
          let imageUrl = '';
          const imgElement = $(element).find('img').first();
          if (imgElement.length) {
            imageUrl = imgElement.attr('src') || imgElement.attr('data-src') || '';
          }
          
          if (!imageUrl) {
            imageUrl = getRandomItem(eventImages);
          }
          
          // Try to determine category
          let category = '';
          const groupType = $(element).find('.groupType, .eventGroup, .meta-group').text().trim();
          
          if (groupType.match(/tech|programming|coding|developer/i)) category = 'Tech';
          else if (groupType.match(/art|culture|museum|gallery|exhibition/i)) category = 'Arts & Culture';
          else if (groupType.match(/food|drink|dinner|cuisine|restaurant|beer|wine/i)) category = 'Food & Drink';
          else if (groupType.match(/fitness|sport|yoga|run|exercise/i)) category = 'Sports';
          else if (groupType.match(/comedy|stand-up|improv/i)) category = 'Comedy';
          else if (groupType.match(/music|concert|band|dj|festival/i)) category = 'Music';
          else category = getRandomItem(categories);
          
          // Try to extract description
          let description = $(element).find('.event-description, .description, .eventInfo').text().trim();
          
          if (!description) {
            description = `Join this ${category} meetup in Sydney. ${name} is a great opportunity to connect with like-minded people and expand your network.`;
          }
          
          if (name) {
            const event: InsertEvent = {
              name,
              date: dateStr ? new Date(dateStr).toISOString() : getRandomFutureDate(),
              location,
              description,
              category,
              imageUrl,
              ticketUrl: eventUrl.startsWith('http') ? eventUrl : `https://www.meetup.com${eventUrl}`,
              featured: Math.random() > 0.7, // 30% chance of being featured
              source: 'meetup'
            };
            
            events.push(event);
          }
        } catch (error) {
          console.error('Error parsing Meetup event:', error);
        }
      });
      
      // If we found events with this selector, no need to try the others
      if (events.length > 0) {
        break;
      }
    }
    
    console.log(`Found ${events.length} events from Meetup`);
    return events;
  } catch (error) {
    console.error('Error scraping Meetup:', error);
    return [];
  }
}

// Generate fallback events to ensure we have content
function generateFallbackEvents(): InsertEvent[] {
  console.log('Generating fallback events...');
  const fallbackEvents: InsertEvent[] = [
    {
      name: "Sydney Music Festival",
      date: "2023-06-15T10:00:00.000Z",
      location: "Sydney Olympic Park, Olympic Boulevard",
      description: "Experience Australia's biggest music festival featuring top local and international artists across multiple stages.",
      category: "Music",
      imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      ticketUrl: "https://www.eventbrite.com.au/",
      featured: true,
      source: "fallback"
    },
    {
      name: "Contemporary Art Exhibition",
      date: "2023-05-21T09:00:00.000Z",
      location: "Museum of Contemporary Art, 140 George St",
      description: "Explore groundbreaking artworks from emerging Australian artists in this exclusive exhibition.",
      category: "Arts & Culture",
      imageUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      ticketUrl: "https://www.mca.com.au/",
      featured: true,
      source: "fallback"
    },
    {
      name: "Sydney Food Festival",
      date: "2023-06-10T11:00:00.000Z",
      location: "Darling Harbour, Tumbalong Park",
      description: "Taste the best of Sydney's culinary scene with food stalls, cooking demonstrations and wine tastings.",
      category: "Food & Drink",
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      ticketUrl: "https://www.sydney.com/",
      featured: true,
      source: "fallback"
    },
    {
      name: "Harbour Jazz Cruise",
      date: "2023-06-24T19:00:00.000Z",
      location: "Circular Quay, Wharf 6",
      description: "Enjoy smooth jazz and spectacular views on this evening cruise around Sydney Harbour.",
      category: "Music",
      imageUrl: "https://images.unsplash.com/photo-1524293581917-878a6d017c71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      ticketUrl: "https://www.sydney.com/",
      featured: false,
      source: "fallback"
    },
    {
      name: "Comedy Night",
      date: "2023-06-17T20:00:00.000Z",
      location: "Comedy Store, Entertainment Quarter",
      description: "Laugh your night away with performances from Australia's top comedians.",
      category: "Comedy",
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      ticketUrl: "https://www.comedystore.com.au/",
      featured: false,
      source: "fallback"
    },
    {
      name: "Wellness Workshop",
      date: "2023-06-25T09:00:00.000Z",
      location: "Centennial Park, Grand Drive",
      description: "Restore your balance with yoga, meditation and wellness workshops in the peaceful surroundings of Centennial Park.",
      category: "Wellness",
      imageUrl: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      ticketUrl: "https://www.centennialparklands.com.au/",
      featured: false,
      source: "fallback"
    },
    {
      name: "Tech Conference",
      date: "2023-07-01T08:30:00.000Z",
      location: "International Convention Centre",
      description: "Connect with industry leaders and discover the latest tech innovations at Sydney's premier tech conference.",
      category: "Tech",
      imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      ticketUrl: "https://www.iccsydney.com.au/",
      featured: false,
      source: "fallback"
    }
  ];
  
  // Add random future events with dates adjusted to always be in the future
  const today = new Date();
  
  return fallbackEvents.map(event => {
    const eventDate = new Date(event.date);
    if (eventDate < today) {
      // If the original date is in the past, set it to a future date
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30) + 1);
      event.date = futureDate.toISOString();
    }
    return event;
  });
}

// Sydney What's On Scraper
async function scrapeSydneyWhatsOn(): Promise<InsertEvent[]> {
  try {
    console.log('Scraping Sydney What\'s On website...');
    const response = await axios.get('https://whatson.cityofsydney.nsw.gov.au/things-to-do', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    
    const html = response.data;
    const $ = load(html);
    
    const events: InsertEvent[] = [];
    
    // Extract events from the Sydney What's On page
    $('.event-card, .card, article.event').each((i, element) => {
      try {
        // Get event title
        const name = $(element).find('h2, h3, .event-title').first().text().trim();
        
        // Get event date
        const dateStr = $(element).find('.date, .event-date, time').first().text().trim();
        
        // Get event location
        let location = $(element).find('.location, .venue, .address').first().text().trim();
        if (!location) {
          location = 'Sydney, NSW';
        }
        
        // Get event URL
        let eventUrl = $(element).find('a').first().attr('href') || '';
        if (eventUrl && !eventUrl.startsWith('http')) {
          eventUrl = `https://whatson.cityofsydney.nsw.gov.au${eventUrl}`;
        }
        
        // Get event image
        let imageUrl = '';
        const imgEl = $(element).find('img').first();
        if (imgEl.length) {
          imageUrl = imgEl.attr('src') || imgEl.attr('data-src') || '';
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `https://whatson.cityofsydney.nsw.gov.au${imageUrl}`;
          }
        }
        
        if (!imageUrl) {
          imageUrl = getRandomItem(eventImages);
        }
        
        // Get event category
        let category = $(element).find('.category, .event-type, .tags').first().text().trim();
        
        // Map category text to our predefined categories
        if (category.match(/music|concert|festival/i)) category = 'Music';
        else if (category.match(/art|culture|exhibition|gallery|museum/i)) category = 'Arts & Culture';
        else if (category.match(/food|drink|dining|wine|restaurant/i)) category = 'Food & Drink';
        else if (category.match(/sport|fitness|race|marathon|yoga/i)) category = 'Sports';
        else if (category.match(/comedy|stand-up|improv/i)) category = 'Comedy';
        else if (category.match(/tech|technology|digital/i)) category = 'Tech';
        else category = getRandomItem(categories);
        
        // Get event description
        let description = $(element).find('.description, .summary, .event-description').first().text().trim();
        if (!description) {
          description = `Explore this exciting ${category} event in Sydney. ${name} is hosted at ${location} and promises to be a great experience.`;
        }
        
        if (name && eventUrl) {
          const event: InsertEvent = {
            name,
            date: dateStr ? new Date(dateStr).toISOString() : getRandomFutureDate(),
            location,
            description,
            category,
            imageUrl,
            ticketUrl: eventUrl,
            featured: Math.random() > 0.7, // 30% chance of being featured
            source: 'sydneywhats-on'
          };
          
          events.push(event);
        }
      } catch (error) {
        console.error('Error parsing Sydney What\'s On event:', error);
      }
    });
    
    console.log(`Found ${events.length} events from Sydney What's On`);
    return events;
  } catch (error) {
    console.error('Error scraping Sydney What\'s On:', error);
    return [];
  }
}

// Main scraper function
export async function scrapeEvents(): Promise<void> {
  console.log('Starting event scraping...');
  
  // Get existing events to check if we need to refresh
  const existingEvents = await storage.getAllEvents();
  
  // Get events from different sources
  let scrapedEvents: InsertEvent[] = [];
  
  try {
    const eventbriteEvents = await scrapeEventbrite();
    scrapedEvents = [...scrapedEvents, ...eventbriteEvents];
    console.log(`Scraped ${eventbriteEvents.length} events from Eventbrite`);
  } catch (error) {
    console.error('Error scraping Eventbrite:', error);
  }
  
  try {
    const meetupEvents = await scrapeMeetup();
    scrapedEvents = [...scrapedEvents, ...meetupEvents];
    console.log(`Scraped ${meetupEvents.length} events from Meetup`);
  } catch (error) {
    console.error('Error scraping Meetup:', error);
  }
  
  try {
    const sydneyEvents = await scrapeSydneyWhatsOn();
    scrapedEvents = [...scrapedEvents, ...sydneyEvents];
    console.log(`Scraped ${sydneyEvents.length} events from Sydney What's On`);
  } catch (error) {
    console.error('Error scraping Sydney What\'s On:', error);
  }
  
  // If we couldn't scrape enough events, add fallback events
  if (scrapedEvents.length < 5) {
    const fallbackEvents = generateFallbackEvents();
    scrapedEvents = [...scrapedEvents, ...fallbackEvents];
    console.log(`Added ${fallbackEvents.length} fallback events`);
  }
  
  if (scrapedEvents.length === 0) {
    console.log('No events scraped and no fallbacks available.');
    return;
  }
  
  // Store the scraped events
  for (const event of scrapedEvents) {
    try {
      // Check if this event already exists (by name and date)
      const existingEvent = existingEvents.find(
        e => e.name === event.name && e.date === event.date
      );
      
      if (!existingEvent) {
        await storage.createEvent(event);
      }
    } catch (error) {
      console.error('Error storing event:', error);
    }
  }
  
  console.log(`Completed scraping with ${scrapedEvents.length} events`);
}

// Initial scrape to populate the database
export async function initializeScraper(): Promise<void> {
  const events = await storage.getAllEvents();
  
  if (events.length === 0) {
    console.log('No events found. Performing initial scrape...');
    await scrapeEvents();
  } else {
    console.log(`Found ${events.length} existing events. Skipping initial scrape.`);
  }
}
