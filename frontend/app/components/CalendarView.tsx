"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

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
  id: number;
  title: string;
  start: Date;
  end: Date;
  organization?: string;
}

interface CalendarViewProps {
  events?: Event[];
}

export default function CalendarView({ events = [] }: CalendarViewProps) {
  // Set calendar to show 9 AM - 7 PM (student event hours)
  const minTime = new Date();
  minTime.setHours(9, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(20, 0, 0); // 7 PM

  return (
    <div className="bg-surface rounded-xl border border-line p-4 shadow-soft">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800 }}
        views={["week", "day"]}
        defaultView="week"
        min={minTime}
        max={maxTime}
      />
    </div>
  );
}
