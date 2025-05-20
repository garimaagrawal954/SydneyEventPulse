# SydneyEventPulse

SydneyEventPulse is a web application designed to keep you up-to-date with the latest events happening in Sydney. The platform automatically aggregates and displays events from official sources, ensuring users always have access to real-time information.

## Features

- **User-Friendly Interface:** Clean and intuitive UI for easy navigation and event discovery.
- **Robust Filtering:** Quickly find events by category, date, or location.
- **Performance Optimized:** Efficient data fetching and caching for a smooth experience.

## Approach

- The application is built using TypeScript for robust and maintainable code.
- Event data is sourced from official event listing websites via APIs.
- A background job or scheduled function periodically fetches the latest events, ensuring the data on SydneyEventPulse stays synchronized with the original source.
- The frontend displays events in an organized and visually appealing format, making it easy for users to explore what's happening in Sydney.

## Challenges Faced

- **Data Synchronization:** Keeping events updated in near real-time required careful scheduling and handling of data differences between sources and the local database.
- **API Limitations:** Some original sites have rate limits or restrictive APIs, requiring efficient fetching and fallback strategies.
- **Data Parsing:** Events from different sources may have varied formats, necessitating flexible and robust parsing logic.
- **Handling Changes:** Ensuring that event modifications (updates or cancellations) on the original site are accurately reflected on SydneyEventPulse.

## Improvements

- **Automated Updates:** Implemented scheduled background jobs (e.g., using cron or serverless functions) to periodically fetch and update events as soon as they are published on the source site.
- **Enhanced Error Handling:** Improved reliability by adding error handling and fallback mechanisms for failed data fetches.
- **Scalability:** Optimized data storage and fetching strategies to handle large numbers of events and users.
- **User Feedback:** Added the ability for users to report incorrect or outdated event information, further improving data accuracy.
- **Future Enhancements:** Plans to add notifications, user subscriptions, and more detailed event filtering.
