import React from 'react';
import { ChevronDown, LayoutGrid, List } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  viewMode?: "grid" | "list";
  setViewMode?: (mode: "grid" | "list") => void;
}

export default function FilterBar({
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  selectedDate,
  setSelectedDate,
  viewMode = "grid",
  setViewMode
}: FilterBarProps) {
  return (
    <section className="bg-white sticky top-16 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <select 
                className="appearance-none bg-lightBg px-4 py-2 pr-8 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>All Categories</option>
                <option>Music</option>
                <option>Arts & Culture</option>
                <option>Food & Drink</option>
                <option>Sports</option>
                <option>Comedy</option>
                <option>Tech</option>
                <option>Wellness</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 pointer-events-none text-gray-500" />
            </div>
            
            <div className="relative">
              <select 
                className="appearance-none bg-lightBg px-4 py-2 pr-8 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option>All Locations</option>
                <option>CBD</option>
                <option>Darling Harbour</option>
                <option>Bondi</option>
                <option>Surry Hills</option>
                <option>Newtown</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 pointer-events-none text-gray-500" />
            </div>
            
            <div className="relative">
              <select 
                className="appearance-none bg-lightBg px-4 py-2 pr-8 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                <option>Any Date</option>
                <option>Today</option>
                <option>This Weekend</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 pointer-events-none text-gray-500" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              className={`flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-100 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
              onClick={() => setViewMode && setViewMode('grid')}
            >
              <LayoutGrid className={`h-5 w-5 ${viewMode === 'grid' ? 'text-primary' : 'text-gray-500'}`} />
              <span className={`text-sm ${viewMode === 'grid' ? 'text-primary font-medium' : 'text-gray-500'}`}>Grid</span>
            </button>
            <button 
              className={`flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-100 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
              onClick={() => setViewMode && setViewMode('list')}
            >
              <List className={`h-5 w-5 ${viewMode === 'list' ? 'text-primary' : 'text-gray-500'}`} />
              <span className={`text-sm ${viewMode === 'list' ? 'text-primary font-medium' : 'text-gray-500'}`}>List</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
