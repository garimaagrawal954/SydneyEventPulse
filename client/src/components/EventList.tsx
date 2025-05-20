import React from 'react';
import EventCard from './EventCard';
import { Event } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface EventListProps {
  title: string;
  events: Event[];
  handleGetTickets: (event: Event) => void;
  featured: boolean;
  loading: boolean;
  viewMode?: "grid" | "list";
}

export default function EventList({ title, events, handleGetTickets, featured, loading, viewMode = "grid" }: EventListProps) {
  const gridCols = featured 
    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
  
  const bgClass = featured ? "" : "bg-white";
  
  return (
    <section className={`py-12 ${bgClass}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">{title}</h2>
          {!featured && <div className="text-primary font-semibold cursor-pointer">View All</div>}
        </div>
        
        {loading ? (
          <div className={`grid ${gridCols} gap-8`}>
            {Array(featured ? 3 : 4).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <div className="flex items-start mb-4">
                    <Skeleton className="h-5 w-5 mr-2" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                  <Skeleton className="h-20 w-full mb-6" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          viewMode === "grid" ? (
            <div className={`grid ${gridCols} gap-8`}>
              {events.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onGetTickets={handleGetTickets}
                  featured={featured}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row">
                  <img src={event.imageUrl} alt={event.name} className="w-full md:w-64 h-48 md:h-auto object-cover" />
                  <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-block px-3 py-1 bg-blue-100 text-primary text-xs font-semibold rounded-full`}>
                        {event.category}
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(event.date)}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                    <div className="flex items-start mb-3">
                      <MapPin className="text-gray-400 mr-2 text-lg flex-shrink-0" />
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <button 
                      className="bg-primary hover:bg-opacity-90 text-white font-medium px-6 py-2 rounded-lg transition-all"
                      onClick={() => handleGetTickets(event)}
                    >
                      GET TICKETS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="bg-white rounded-xl p-8 text-center">
            <h3 className="text-xl font-medium text-gray-600">No events found</h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your filters or check back later for new events
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
