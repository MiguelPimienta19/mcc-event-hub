"use client";

import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import EventModal from "./components/EventModal";
import EventCard from "./components/EventCard";

const CalendarView = dynamic(() => import("./components/CalendarView"), {
});

// Sample events (will be replaced with real data from your backend)
const SAMPLE_EVENTS = [
  
  {
    id: 1,
    title: "BSU General Meeting",
    organization: "BSU",
    start: new Date(2025, 10, 26, 18, 0),
    end: new Date(2025, 11, 1, 19, 30),
  },

  {
    id: 2,
    title: "NASU Cultural Night",
    organization: "NASU",
    start: new Date(2025, 11, 5, 19, 0),
    end: new Date(2025, 11, 5, 21, 0),
  },

  {
    id: 3,
    title: "MEChA Study Session",
    organization: "MEChA",
    start: new Date(2025, 11, 3, 16, 0),
    end: new Date(2025, 11, 3, 18, 0),
  },
  
];
//this will be taken away later but this is all for the test data nothing too crazy right now!


export default function Home() {
  const [selectedOrg, setSelectedOrg] = useState("All");
  const [showEventModal, setShowEventModal] = useState(false);

  // Filter events by organization
  const filteredEvents = selectedOrg === "All" ? SAMPLE_EVENTS : SAMPLE_EVENTS.filter((event) => event.organization === selectedOrg);

  return (
    <div className="min-h-screen bg-bg">
      {/* Header with MCC Green */}
      <header className="bg-brand-700 text-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">MCC Event Hub</h1>
            <p className="mt-2 text-brand-100 text-lg">
              University of Oregon Multicultural Center
            </p>
          </div>
          <Link
            href="/admin"
            className="px-6 py-3 bg-brand-800 hover:bg-brand-900 text-white rounded-lg font-medium transition-colors"
          >
            Admin
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-text text-xl font-medium mb-6 max-w-3xl mx-auto">
            Your central hub for managing meetings, events, and collaborative spaces. Stay organized!
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowEventModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-full font-medium hover:bg-brand-700 transition-colors shadow-soft"
            >
              📅 Add to Calendar
            </button>
            <Link
              href="/agenda"
              className="flex items-center gap-2 px-6 py-3 bg-surface text-text border border-line rounded-full font-medium hover:bg-brand-50 transition-colors"
            >
              📋 Make Meeting Agenda
            </Link>
          </div>
        </div>
        {/* Organization Filters */}
        

        {/* Calendar */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-text mb-4">
            Event Calendar
          </h2>
          <CalendarView events={filteredEvents} />
        </div>

        {/* Upcoming Events List */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-text mb-4">
            Upcoming Events
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </main>

      {/* Create Event Modal */}
      <EventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
      />
    </div>
  );
}
