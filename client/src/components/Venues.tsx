import React from 'react';

interface Venue {
  id: number;
  name: string;
  eventCount: number;
  image: string;
}

interface VenuesProps {
  venues: Venue[];
}

export default function Venues({ venues }: VenuesProps) {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Popular Venues</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map((venue) => (
            <div key={venue.id} className="relative rounded-xl overflow-hidden h-64 group cursor-pointer">
              <img 
                src={venue.image} 
                alt={venue.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-darkBg to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl font-bold text-white mb-1">{venue.name}</h3>
                <p className="text-white text-opacity-90">{venue.eventCount} upcoming events</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
