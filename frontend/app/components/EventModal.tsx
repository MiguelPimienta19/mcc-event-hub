"use client";

import { useState } from "react";
import { API_URL } from "@/lib/constants";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated?: () => void;
}

export default function EventModal({ isOpen, onClose, onEventCreated }: EventModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"event" | "office_hours">("event");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const eventData = {
      title: formData.get("title") as string,
      organization: formData.get("organization") as string,
      type: formData.get("type") as string || "event",
      start_time: new Date(formData.get("start_time") as string).toISOString(),
      end_time: new Date(formData.get("end_time") as string).toISOString(),
      description: formData.get("description") as string || null,
    };

    try {
      const apiUrl = API_URL;
      const response = await fetch(`${apiUrl}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      onEventCreated?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-2xl shadow-lift max-w-4xl w-full p-8">
        <h2 className="text-2xl font-semibold text-text mb-6">
          {selectedType === "event" ? "Create New Event" : "Create New Office Hours"}
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter event title"
                className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
              />
            </div>

            {/* Organization */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Organization
              </label>
              <input
                type="text"
                name="organization"
                placeholder="e.g.  BSU, NASU, MECHA"
                className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Type
              </label>
              <select
                name="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as "event" | "office_hours")}
                className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
              >
                <option value="event">Event</option>
                <option value="office_hours">Office Hours</option>
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                name="start_time"
                className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                End Time
              </label>
              <input
                type="datetime-local"
                name="end_time"
                className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Optional Description */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              placeholder="Enter event description"
              rows={3}
              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-surface border border-line text-text rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-soft disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : selectedType === "event" ? "Create Event" : "Create Office Hours"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
