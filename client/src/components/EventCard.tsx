import React from 'react';
import { MapPin } from 'lucide-react';
import { Event } from '@shared/schema';
import { formatDate } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  onGetTickets: (event: Event) => void;
  featured: boolean;
}

export default function EventCard({ event, onGetTickets, featured }: EventCardProps) {
  const getBadgeColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Music': 'bg-blue-100 text-primary',
      'Arts & Culture': 'bg-purple-100 text-purple-700',
      'Food & Drink': 'bg-orange-100 text-orange-700',
      'Sports': 'bg-green-100 text-green-700',
      'Comedy': 'bg-pink-100 text-pink-700',
      'Tech': 'bg-indigo-100 text-indigo-700',
      'Wellness': 'bg-green-100 text-green-700'
    };
    
    return colors[category] || 'bg-gray-100 text-gray-700';
  };
  
  if (featured) {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-custom card-hover">
        <img src={event.imageUrl} alt={event.name} className="w-full h-48 object-cover" />
        <div className="p-6">
          <div className="flex items-center mb-4">
            <span className={`inline-block px-3 py-1 ${getBadgeColor(event.category)} text-xs font-semibold rounded-full`}>
              {event.category}
            </span>
            <span className="ml-auto text-sm text-gray-500">{formatDate(event.date)}</span>
          </div>
          <h3 className="text-xl font-bold mb-2">{event.name}</h3>
          <div className="flex items-start mb-4">
            <MapPin className="text-gray-400 mr-2 text-lg flex-shrink-0" />
            <p className="text-gray-600">{event.location}</p>
          </div>
          <p className="text-gray-600 mb-6">{event.description}</p>
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all"
            onClick={() => onGetTickets(event)}
          >
            GET TICKETS
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 card-hover">
      <img src={event.imageUrl} alt={event.name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className={`inline-block px-2 py-1 ${getBadgeColor(event.category)} text-xs font-medium rounded-full`}>
            {event.category}
          </span>
          <span className="ml-auto text-xs text-gray-500">{formatDate(event.date)}</span>
        </div>
        <h3 className="text-lg font-bold mb-2">{event.name}</h3>
        <div className="flex items-start mb-3">
          <MapPin className="text-gray-400 mr-1 text-sm flex-shrink-0" />
          <p className="text-sm text-gray-600">{event.location}</p>
        </div>
        <button 
          className="w-full bg-primary hover:bg-opacity-90 text-white font-medium px-4 py-2 rounded-lg transition-all text-sm"
          onClick={() => onGetTickets(event)}
        >
          GET TICKETS
        </button>
      </div>
    </div>
  );
}
