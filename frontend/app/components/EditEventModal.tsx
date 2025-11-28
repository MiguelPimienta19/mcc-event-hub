"use client";

import { useState, useEffect } from "react";

interface Event {
  id: string;
  title: string;
  organization: string;
  start_time: string;
  end_time: string;
  description?: string;
}

interface EditEventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onEventUpdated: () => void;
}

export default function EditEventModal({
  event,
  isOpen,
  onClose,
  onEventUpdated,
}: EditEventModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");

  // Populate form when event changes
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setOrganization(event.organization);

      // Convert ISO string to datetime-local format
      const startDate = new Date(event.start_time);
      const endDate = new Date(event.end_time);

      setStartTime(formatDateTimeLocal(startDate));
      setEndTime(formatDateTimeLocal(endDate));
      setDescription(event.description || "");
    }
  }, [event]);

  // Helper to format date for datetime-local input
  const formatDateTimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        return;
      }

      const eventData = {
        title,
        organization,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        description: description || null,
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please login again.");
          return;
        }
        throw new Error("Failed to update event");
      }

      // Success!
      onEventUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-2xl shadow-lift max-w-2xl w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text">Edit Event</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-text transition-colors text-2xl font-light"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Organization */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Organization *
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Start Time *
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              End Time *
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 h-32 resize-none"
              placeholder="Optional description of the event..."
              disabled={isSubmitting}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-line text-text rounded-lg font-medium hover:bg-bg transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-brand-700 text-white rounded-lg font-medium hover:bg-brand-800 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
