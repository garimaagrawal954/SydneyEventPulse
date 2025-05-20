import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import EventList from "@/components/EventList";
import Categories from "@/components/Categories";
import Venues from "@/components/Venues";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import EmailModal from "@/components/EmailModal";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Event } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedDate, setSelectedDate] = useState("Any Date");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: events = [], isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery === "" || 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All Categories" || 
      event.category === selectedCategory;
    
    const matchesLocation = selectedLocation === "All Locations" || 
      event.location.includes(selectedLocation);
    
    // Simple date filtering logic
    const eventDate = new Date(event.date);
    const today = new Date();
    const thisWeekend = new Date();
    thisWeekend.setDate(today.getDate() + (6 - today.getDay()));
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    let matchesDate = true;
    if (selectedDate === "Today") {
      matchesDate = eventDate.toDateString() === today.toDateString();
    } else if (selectedDate === "This Weekend") {
      matchesDate = eventDate >= today && eventDate <= thisWeekend;
    } else if (selectedDate === "This Week") {
      matchesDate = eventDate >= today && eventDate <= nextWeek;
    } else if (selectedDate === "This Month") {
      matchesDate = eventDate >= today && eventDate <= nextMonth;
    }
    
    return matchesSearch && matchesCategory && matchesLocation && matchesDate;
  });

  const featuredEvents = filteredEvents.filter(event => event.featured).slice(0, 3);
  const upcomingEvents = filteredEvents.filter(event => !event.featured).slice(0, 4);

  const handleGetTickets = (event: Event) => {
    setSelectedEvent(event);
    setShowEmailModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleEmailSubmit = async (email: string, subscribed: boolean) => {
    if (!selectedEvent) return;
    
    setShowEmailModal(false);
    setIsLoading(true);
    
    try {
      await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          subscribed,
          eventId: selectedEvent.id,
        }),
      });
      
      // Redirect to original event URL
      window.location.href = selectedEvent.ticketUrl;
    } catch (error) {
      console.error('Error submitting email:', error);
    } finally {
      setIsLoading(false);
      document.body.style.overflow = 'auto';
    }
  };

  const handleCloseModal = () => {
    setShowEmailModal(false);
    document.body.style.overflow = 'auto';
  };

  const categories = [
    { id: 1, name: "Music", icon: "music_note", color: "blue" },
    { id: 2, name: "Arts & Culture", icon: "palette", color: "purple" },
    { id: 3, name: "Food & Drink", icon: "restaurant", color: "orange" },
    { id: 4, name: "Sports", icon: "sports_soccer", color: "green" },
    { id: 5, name: "Comedy", icon: "theater_comedy", color: "pink" },
    { id: 6, name: "Tech", icon: "laptop", color: "indigo" }
  ];

  const venues = [
    { 
      id: 1, 
      name: "Sydney Opera House", 
      eventCount: 12, 
      image: "https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500" 
    },
    { 
      id: 2, 
      name: "International Convention Centre", 
      eventCount: 8, 
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500" 
    },
    { 
      id: 3, 
      name: "Sydney Olympic Park", 
      eventCount: 15, 
      image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500" 
    }
  ];

  return (
    <div className="bg-lightBg text-darkBg">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {/* Hero Section */}
      <section className="relative h-96 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1549180030-48bf079fb38a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"}}>
        <div className="absolute inset-0 bg-darkBg bg-opacity-50"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Discover Sydney's Best Events</h2>
          <p className="text-xl text-white mb-8 max-w-2xl">Find concerts, festivals, workshops, and more happening around the beautiful city of Sydney</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-secondary hover:bg-opacity-90 text-white font-semibold px-6 py-3 rounded-full transition-all">
              Explore Events
            </button>
            <button className="bg-white hover:bg-opacity-90 text-primary font-semibold px-6 py-3 rounded-full transition-all">
              Submit Event
            </button>
          </div>
        </div>
      </section>
      
      <FilterBar 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      
      <EventList 
        title="Featured Events" 
        events={featuredEvents} 
        handleGetTickets={handleGetTickets}
        featured={true}
        loading={eventsLoading}
        viewMode={viewMode}
      />
      
      <EventList 
        title="Upcoming Events" 
        events={upcomingEvents} 
        handleGetTickets={handleGetTickets}
        featured={false}
        loading={eventsLoading}
        viewMode={viewMode}
      />
      
      <Categories 
        categories={categories} 
        selectedCategory={selectedCategory}
        setSelectedCategory={(category) => {
          if (category === selectedCategory) {
            setSelectedCategory("All Categories");
          } else {
            setSelectedCategory(category);
          }
        }}
      />
      
      <Newsletter />
      
      <Footer />
      
      {showEmailModal && selectedEvent && (
        <EmailModal 
          onClose={handleCloseModal} 
          onSubmit={handleEmailSubmit} 
          eventName={selectedEvent.name}
        />
      )}
      
      {isLoading && <LoadingOverlay />}
    </div>
  );
}
