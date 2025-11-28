interface Event {
  id: string | number;
  title: string;
  organization: string;
  start: Date;
  end: Date;
  description?: string;
}

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventDetailModal({ event, isOpen, onClose }: EventDetailModalProps) {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-2xl shadow-lift max-w-2xl w-full p-8">
        {/* Organization Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-brand-100 text-brand-800">
            {event.organization}
          </span>
        </div>

        {/* Event Title */}
        <h2 className="text-3xl font-bold text-text mb-6">{event.title}</h2>

        {/* Date and Time */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-muted">
            <span className="text-xl">📅</span>
            <span className="text-lg">{event.start.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center gap-3 text-muted">
            <span className="text-xl">⏰</span>
            <span className="text-lg">
              {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text mb-2">About This Event</h3>
            <p className="text-muted leading-relaxed whitespace-pre-wrap">{event.description}</p>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-soft"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
