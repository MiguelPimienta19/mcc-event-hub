interface Event {
  id: string | number;
  title: string;
  organization: string;
  start: Date;
  end: Date;
}

interface EventCardProps {
  event: Event;
  onViewDetails: () => void;
}

export default function EventCard({ event, onViewDetails }: EventCardProps) {
  return (
    <article className="bg-surface rounded-lg border border-line p-5 hover:shadow-lift transition-shadow">
      <div className="mb-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
          {event.organization}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-text mb-2">{event.title}</h3>
      <div className="space-y-1 text-sm text-muted mb-4">
        <p>📅 {event.start.toLocaleDateString()}</p>
        <p>
          ⏰{" "}
          {event.start.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {event.end.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        
      </div>
      <div className="flex gap-2">
        <button
          onClick={onViewDetails}
          className="flex-1 text-center px-4 py-2 bg-brand-700 text-white rounded-md text-sm font-medium hover:bg-brand-800 transition-colors"
        >
          View Details
        </button>
      </div>
    </article>
  );
}
