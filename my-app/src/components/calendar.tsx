"use client";

import { useEffect, useState } from "react";
import { CalendarEvent } from "./calendar/types";
import { EventCalendar } from "./calendar/event-calendar";
export default function Calendar({sampleEvents, classes}: {sampleEvents: CalendarEvent[], classes?: any}) {
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
  setEvents(sampleEvents);
  }, [sampleEvents]);

  console.log("events ",events)

  const [classesNew, setClassesNew] = useState<any[]>([]);

  useEffect(() => {
    setClassesNew(classes);
  }, [classes]);

  console.log("classes ",classesNew)

  const handleEventAdd = (event: CalendarEvent) => {
    setEvents([...events, event]);
    fetch("http://localhost:5007/event", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event: event }),
    });
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    fetch(`http://localhost:5007/event/${updatedEvent.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event: updatedEvent }),
    });
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
    fetch(`http://localhost:5007/event/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
<div className="overflow-y-auto scroll-container h-[78.5vh]">
  <div className="overflow-x-auto scroll-container w-full min-w-[470px]">
    <EventCalendar
      events={events}
      classes={classesNew}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
    />
  </div>
</div>
  );
}
