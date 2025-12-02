"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/constants";
import dynamic from "next/dynamic";
import EventCard from "./components/EventCard";
import EventDetailModal from "./components/EventDetailModal";

const CalendarView = dynamic(() => import("./components/CalendarView"), {
});

interface Event {
  id: string;
  title: string;
  organization: string;
  start: Date;
  end: Date;
  description?: string;
}

export default function Home() {
  const [selectedOrg, setSelectedOrg] = useState("All");
  const [showContactMessage, setShowContactMessage] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"event" | "office_hours">("event");

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiUrl = API_URL;
      const response = await fetch(`${apiUrl}/events?type=${viewType}`);

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();

      // Convert ISO date strings to Date objects for the calendar
      const formattedEvents = data.map((event: any) => ({
        id: event.id,
        title: event.title,
        organization: event.organization,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        description: event.description,
      }));

      setEvents(formattedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  // Load events on mount and when viewType changes
  useEffect(() => {
    fetchEvents();
  }, [viewType]);

  // Normalize organization name (remove ALL whitespace, capitalize consistently)
  const normalizeOrgName = (name: string): string => {
    return name.replace(/\s+/g, '').toUpperCase();
  };

  // Filter events by organization
  const filteredEvents = selectedOrg === "All"
    ? events
    : events.filter((event) => normalizeOrgName(event.organization) === normalizeOrgName(selectedOrg));

  // Get unique organizations from events (normalized)
  const uniqueOrgNames = new Set(events.map(event => normalizeOrgName(event.organization)));
  const organizations = ["All", ...Array.from(uniqueOrgNames).sort()];

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
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setShowContactMessage(!showContactMessage)}
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
          
          {showContactMessage && (
            <div className="bg-surface border border-line rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-text text-base">
                Want to add to the calendar? Please reach out to{" "}
                <a
                  href="mailto:mcc@uoregon.edu"
                  className="text-brand-600 hover:text-brand-700 font-medium underline"
                >
                  mcc@uoregon.edu
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Tab Toggle: Events | Office Hours */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex bg-surface rounded-lg border border-line p-1">
            <button
              onClick={() => setViewType("event")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                viewType === "event"
                  ? "bg-brand-600 text-white"
                  : "text-muted hover:text-text"
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setViewType("office_hours")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                viewType === "office_hours"
                  ? "bg-brand-600 text-white"
                  : "text-muted hover:text-text"
              }`}
            >
              Office Hours
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted text-lg">Loading {viewType === "event" ? "events" : "office hours"}...</p>
          </div>
        ) : (
          <>
            {/* Organization Filter */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-text">
                {viewType === "event" ? "Event Calendar" : "Office Hours"}
              </h2>
              <div className="flex items-center gap-3">
                <label htmlFor="org-filter" className="text-sm font-medium text-muted">
                  Filter by Organization:
                </label>
                <select
                  id="org-filter"
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  className="px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-surface text-text"
                >
                  {organizations.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calendar */}
            <div className="mb-8">
              <CalendarView events={filteredEvents} />
            </div>

            {/* Upcoming Events List */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-text mb-4">
                {viewType === "event" ? "Upcoming Events" : "Upcoming Office Hours"}
              </h2>
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 bg-surface rounded-lg border border-line">
                  <p className="text-muted text-lg">
                    {selectedOrg === "All"
                      ? `No ${viewType === "event" ? "events" : "office hours"} found.`
                      : `No ${viewType === "event" ? "events" : "office hours"} found for ${selectedOrg}.`
                    }
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onViewDetails={() => setSelectedEvent(event)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
