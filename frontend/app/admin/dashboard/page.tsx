"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EditEventModal from "@/app/components/EditEventModal";
import DeleteConfirmationModal from "@/app/components/DeleteConfirmationModal";

interface Event {
  id: string;
  title: string;
  organization: string;
  start_time: string;
  end_time: string;
  description?: string;
}

interface Admin {
  email: string;
  created_at: string;
}

// Constants
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper functions
const getAuthHeaders = () => {
  const token = localStorage.getItem("admin_token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export default function AdminDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Admin management state
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [deletingAdminEmail, setDeletingAdminEmail] = useState<string | null>(null);
  const [isDeletingAdmin, setIsDeletingAdmin] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("admin_token");
    const adminEmail = localStorage.getItem("admin_email");

    if (!token || !adminEmail) {
      // Not logged in, redirect to login
      router.push("/admin");
      return;
    }

    setEmail(adminEmail);
    setIsLoading(false);

    // Fetch events and admins after confirming authentication
    fetchEvents();
    fetchAdmins();
  }, [router]);

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      const response = await fetch(`${API_URL}/events`);

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      setAdminsLoading(true);
      const response = await fetch(`${API_URL}/auth/admins`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch admins");
      }

      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setAdminsLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    try {
      setAddingAdmin(true);
      const response = await fetch(`${API_URL}/auth/admins`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email: newAdminEmail }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.detail || "Failed to add admin");
        return;
      }

      fetchAdmins();
      setNewAdminEmail("");
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("Failed to add admin. Please try again.");
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = (adminEmail: string) => {
    setDeletingAdminEmail(adminEmail);
  };

  const confirmRemoveAdmin = async () => {
    if (!deletingAdminEmail) return;

    try {
      setIsDeletingAdmin(true);
      const response = await fetch(`${API_URL}/auth/admins/${encodeURIComponent(deletingAdminEmail)}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.detail || "Failed to remove admin");
        return;
      }

      fetchAdmins();
      setDeletingAdminEmail(null);
    } catch (error) {
      console.error("Error removing admin:", error);
      alert("Failed to remove admin. Please try again.");
    } finally {
      setIsDeletingAdmin(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
  };

  const handleDeleteEvent = (event: Event) => {
    setDeletingEvent(event);
  };

  const confirmDelete = async () => {
    if (!deletingEvent) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`${API_URL}/events/${deletingEvent.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Session expired. Please login again.");
          router.push("/admin");
          return;
        }
        throw new Error("Failed to delete event");
      }

      fetchEvents();
      setDeletingEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_email");

    // Redirect to login
    router.push("/admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-muted text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-brand-700 text-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-brand-100 mt-1">Logged in as: {email}</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-4 py-2 bg-brand-800 hover:bg-brand-900 text-white rounded-lg font-medium transition-colors"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Admin Management Section */}
        <div className="bg-surface rounded-xl shadow-soft p-8 border border-line mb-8">
          <h2 className="text-2xl font-bold text-text mb-6">
            Manage Admins
          </h2>

          {/* Add Admin Form */}
          <form onSubmit={handleAddAdmin} className="mb-6">
            <div className="flex gap-3">
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="Enter email to add as admin"
                className="flex-1 px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                disabled={addingAdmin}
                required
              />
              <button
                type="submit"
                disabled={addingAdmin}
                className="px-6 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {addingAdmin ? "Adding..." : "Add Admin"}
              </button>
            </div>
          </form>

          {/* Admins List */}
          {adminsLoading ? (
            <p className="text-muted text-center py-8">Loading admins...</p>
          ) : admins.length === 0 ? (
            <p className="text-muted text-center py-8">No admins found.</p>
          ) : (
            <div className="space-y-2">
              {admins.map((admin) => (
                <div
                  key={admin.email}
                  className="flex items-center justify-between p-4 bg-bg rounded-lg border border-line"
                >
                  <div>
                    <p className="font-medium text-text">{admin.email}</p>
                    <p className="text-sm text-muted">
                      Added {new Date(admin.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveAdmin(admin.email)}
                    disabled={admin.email === email}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={admin.email === email ? "You cannot remove yourself" : "Remove admin"}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Event Management Section */}
        <div className="bg-surface rounded-xl shadow-soft p-8 border border-line">
          <h2 className="text-2xl font-bold text-text mb-6">
            Manage Events
          </h2>

          {eventsLoading ? (
            <p className="text-muted text-center py-8">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-muted text-center py-8">No events found. Users can create events from the main calendar page.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-line">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text">Event</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text">Organization</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text">Date & Time</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-text">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="border-b border-line hover:bg-bg transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-text">{event.title}</p>
                          {event.description && (
                            <p className="text-sm text-muted mt-1 line-clamp-1">{event.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
                          {event.organization}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted">
                        <div>
                          <p>{new Date(event.start_time).toLocaleDateString()}</p>
                          <p className="text-xs">
                            {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit Event Modal */}
      <EditEventModal
        event={editingEvent}
        isOpen={editingEvent !== null}
        onClose={() => setEditingEvent(null)}
        onEventUpdated={() => {
          fetchEvents();
          setEditingEvent(null);
        }}
      />

      {/* Delete Event Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deletingEvent !== null}
        title="Delete Event?"
        message="Are you sure you want to delete this event?"
        itemName={`"${deletingEvent?.title || ""}"`}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingEvent(null)}
        isDeleting={isDeleting}
        confirmButtonText="Delete Event"
      />

      {/* Delete Admin Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deletingAdminEmail !== null}
        title="Remove Admin?"
        message="Are you sure you want to remove this admin?"
        itemName={deletingAdminEmail || ""}
        onConfirm={confirmRemoveAdmin}
        onCancel={() => setDeletingAdminEmail(null)}
        isDeleting={isDeletingAdmin}
        confirmButtonText="Remove Admin"
      />
    </div>
  );
}
