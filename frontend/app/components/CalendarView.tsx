"use client";

import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useCallback, useMemo } from "react";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Event {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  organization?: string;
}

interface CalendarViewProps {
  events?: Event[];
}

export default function CalendarView({ events = [] }: CalendarViewProps) {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("week");

  // Create stable min/max time values
  const { minTime, maxTime } = useMemo(() => ({
    minTime: new Date(2026, 1, 1, 9, 0, 0),
    maxTime: new Date(2026, 1, 1, 20, 0, 0),
  }), []);

  const handleNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  return (
    <div className="bg-surface rounded-xl border border-line p-4 shadow-soft">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800 }}
        views={["week", "day", "month"]}
        view={view}
        date={date}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        min={minTime}
        max={maxTime}
      />
    </div>
  );
}
