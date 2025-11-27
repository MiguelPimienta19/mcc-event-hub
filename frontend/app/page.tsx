"use client";

import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";

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
    location: "MCC Lounge",
  },
  {
    id: 2,
    title: "NASU Cultural Night",
    organization: "NASU",
    start: new Date(2025, 11, 5, 19, 0),
    end: new Date(2025, 11, 5, 21, 0),
    location: "EMU Ballroom",
  },
  {
    id: 3,
    title: "MEChA Study Session",
    organization: "MEChA",
    start: new Date(2025, 11, 3, 16, 0),
    end: new Date(2025, 11, 3, 18, 0),
    location: "Knight Library",
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
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight">MCC Event Hub</h1>
          <p className="mt-2 text-brand-100 text-lg">
            University of Oregon Multicultural Center
          </p>
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
              <article
                key={event.id}
                className="bg-surface rounded-lg border border-line p-5 hover:shadow-lift transition-shadow"
              >
                <div className="mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
                    {event.organization}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">
                  {event.title}
                </h3>
                <div className="space-y-1 text-sm text-muted mb-4">
                  <p>📅 {event.start.toLocaleDateString()}</p>
                  <p>
                    ⏰ {event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                    {event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p>📍 {event.location}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/events/${event.id}`}
                    className="flex-1 text-center px-4 py-2 bg-brand-700 text-white rounded-md text-sm font-medium hover:bg-brand-800 transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    className="px-4 py-2 border border-line rounded-md text-sm font-medium text-text hover:bg-brand-50 transition-colors"
                    title="Add to Calendar"
                  >
                    📅
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* Create Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-2xl shadow-lift max-w-4xl w-full p-8">
            <h2 className="text-2xl font-semibold text-text mb-6">Create New Event</h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Event Title */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter event title"
                    className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-6 py-3 bg-surface border border-line text-text rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-soft"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
