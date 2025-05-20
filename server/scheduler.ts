import cron from 'node-cron';
import { scrapeEvents, initializeScraper } from './scraper';

// Schedule to run the scraper more frequently to keep events updated
export function startScraperScheduler(): void {
  console.log('Starting event scraper scheduler...');
  
  // Immediately run initial scrape to populate the database
  initializeScraper();
  
  // Schedule regular scrapes every 1 hour to keep content fresh
  cron.schedule('0 */1 * * *', async () => {
    console.log('Running scheduled event scraping...');
    await scrapeEvents();
  });
  
  console.log('Event scraper scheduler started');
}
