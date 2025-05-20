import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import EventList from "@/components/EventList";
import Footer from "@/components/Footer";
import { Event } from "@shared/schema";
import EmailModal from "@/components/EmailModal";

export default function ExploreEvents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedDate, setSelectedDate] = useState("All Dates");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["/api/events"],
  });

  // Filter events based on search query and filters
  const filteredEvents = events.filter((event: Event) => {
    // Filter by search query
    if (
      searchQuery &&
      !event.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !event.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by category
    if (selectedCategory !== "All Categories" && event.category !== selectedCategory) {
      return false;
    }

    // Filter by location
    if (
      selectedLocation !== "All Locations" &&
      !event.location.toLowerCase().includes(selectedLocation.toLowerCase())
    ) {
      return false;
    }

    // Filter by date (simplified)
    if (selectedDate !== "All Dates") {
      // This is a simplified implementation
      // In a real app, you'd use proper date comparison
      const today = new Date();
      const eventDate = new Date(event.date);
      
      if (selectedDate === "Today" && eventDate.toDateString() !== today.toDateString()) {
        return false;
      } else if (
        selectedDate === "This Week" &&
        (eventDate < today || eventDate > new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000))
      ) {
        return false;
      } else if (
        selectedDate === "This Month" &&
        (eventDate.getMonth() !== today.getMonth() || eventDate.getFullYear() !== today.getFullYear())
      ) {
        return false;
      }
    }

    return true;
  });

  const handleGetTickets = (event: Event) => {
    setSelectedEvent(event);
    setShowEmailModal(true);
  };

  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
  };

  const handleEmailSubmit = (email: string, subscribed: boolean) => {
    // Submit email and subscription preference
    fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        subscribed,
        eventId: selectedEvent?.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Redirect to ticket URL
        if (data.redirectUrl) {
          window.open(data.redirectUrl, "_blank");
        }
        setShowEmailModal(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setShowEmailModal(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Explore All Sydney Events</h1>
        
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
          title="All Events"
          events={filteredEvents}
          handleGetTickets={handleGetTickets}
          featured={false}
          loading={isLoading}
          viewMode={viewMode}
        />
      </main>

      <Footer />

      {showEmailModal && selectedEvent && (
        <EmailModal
          onClose={handleCloseEmailModal}
          onSubmit={handleEmailSubmit}
          eventName={selectedEvent.name}
        />
      )}
    </div>
  );
}