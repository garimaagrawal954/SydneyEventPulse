import React from 'react';
import { Search } from 'lucide-react';
import { Link, useLocation } from 'wouter';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  const [location] = useLocation();

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/">
            <span className="text-2xl font-bold mr-8 cursor-pointer">
              <span className="text-primary">Sydney</span>
              <span className="text-secondary">Events</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/">
              <a className={`font-medium hover:text-primary transition-colors ${location === '/' ? 'text-primary' : 'text-gray-700'}`}>
                Home
              </a>
            </Link>
            <Link href="/explore">
              <a className={`font-medium hover:text-primary transition-colors ${location === '/explore' ? 'text-primary' : 'text-gray-700'}`}>
                Explore Events
              </a>
            </Link>
            <Link href="/submit">
              <a className={`font-medium hover:text-primary transition-colors ${location === '/submit' ? 'text-primary' : 'text-gray-700'}`}>
                Submit Event
              </a>
            </Link>
          </nav>
        </div>
        
        <div className="w-full md:w-auto">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search events..." 
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="container mx-auto px-4 py-2 flex justify-between">
          <Link href="/">
            <a className={`text-sm font-medium ${location === '/' ? 'text-primary' : 'text-gray-700'}`}>
              Home
            </a>
          </Link>
          <Link href="/explore">
            <a className={`text-sm font-medium ${location === '/explore' ? 'text-primary' : 'text-gray-700'}`}>
              Explore
            </a>
          </Link>
          <Link href="/submit">
            <a className={`text-sm font-medium ${location === '/submit' ? 'text-primary' : 'text-gray-700'}`}>
              Submit
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
}
