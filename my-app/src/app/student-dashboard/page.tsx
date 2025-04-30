"use client";
import Assignments from "@/components/assignments";
import Calendar from "@/components/calendar";
import { CalendarEvent } from "@/components/calendar/types";
import CourseCard from "@/components/course-card";
import Header from "@/components/header";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StudentDashboard() {
  const [courses, setCourses] = useState<any>([]);
  const [events, setEvents] = useState<any>([]);
  const [assignments, setAssignments] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, eventsRes, assignmentsRes] = await Promise.all([
          fetch("http://localhost:5007/course/week", {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }),
          fetch("http://localhost:5007/event", {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }),
          fetch("http://localhost:5007/assignment", {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!coursesRes.ok) {
          throw new Error("One of the fetches failed");
        }
        if (!eventsRes.ok) {
          throw new Error("One of the fetches failed");
        }
        if (!assignmentsRes.ok) {
          throw new Error("One of the fetches failed");
        }

        const coursesData = await coursesRes.json();
        const eventsData = await eventsRes.json();
        const assignmentsData = await assignmentsRes.json();

        // Utility to replace _id with id
        const replaceId = (obj: any) => {
          const newObj = { ...obj };
          newObj.id = newObj._id;
          delete newObj._id;
          return newObj;
        };

        setCourses(coursesData.courses.map(replaceId));
        setEvents(eventsData.events.map(replaceId));
        setAssignments(assignmentsData.map(replaceId));
      } catch (err) {
        console.error("Fetching error:", err);
      }
    };

    fetchData();
  }, []);

  const [numElements, setNumElements] = useState(4);
  const [load, setLoad] = useState(numElements);

  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      if (width >= 700 && width <= 1000) {
        setNumElements(3);
        setLoad(3);
      } else if (width < 700) {
        setNumElements(4);
        setLoad(4);
      } else {
        setNumElements(4);
        setLoad(4);
      }
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => {
      window.removeEventListener("resize", checkViewport);
    };
  }, []);

  // Format classes from courses
  const formatClassesToCalendarEvents = (courses: any[]): CalendarEvent[] => {
    return courses.map(({
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      id
    }: {
      title: string;
      description: string;
      startDate: string;
      endDate: string;
      startTime: string;
      endTime: string;
      id: string;
    }) => {
      const start = new Date(`${startDate.split("T")[0]}T${startTime}`);
      const end = new Date(`${endDate.split("T")[0]}T${endTime}`);
  
      return {
        id,
        title,
        description,
        start,   // The 'start' should be a Date object
        end,     // The 'end' should be a Date object
        startTime,
        endTime,
        allDay: false, // Explicitly mark it as a timed event
      };
    });
  };
  
  

  return (
    <>
      <div className="flex items-center justify-center relative">
        <div className="max-w-[1400px] px-[50px] w-full">
          {/* Header part */}
          <Header show />
  
          {/* Course Section */}
          <div className="footer-padding">
            <div className="flex items-center justify-between">
              <h3 className="header-h3-font text-[clamp(20px,4vw,32px)]">This week course</h3>
            </div>
  
            <div className="flex overflow-x-auto scroll-container gap-10 [@media(max-width:700px)]:grid-cols-2 section-padding">
              {/* Course cards */}
              {courses.map((course: any, index: number) => (
                <Link key={index} href={`/student-dashboard/${course.id}`}>
                  <CourseCard course={course} />
                </Link>
              ))}
            </div>
          </div>
  
          {/* Organisation Section */}
          <div className="grid grid-cols-2 gap-10 w-full
            [@media(max-width:700px)]:grid-cols-1">
            <div>
              <h3 className="header-h3-font text-[clamp(20px,4vw,32px)]">Calendar</h3>
              <div className="rounded-lg border-3 border-b-7 border-r-7 border-black header-p-margin">
                <Calendar
                  sampleEvents={events}
                  classes={formatClassesToCalendarEvents(courses)}
                />
              </div>
            </div>
            <div>
              <h3 className="header-h3-font text-[clamp(20px,4vw,32px)]">Assignments</h3>
              <div className="rounded-lg border-3 border-b-7 border-r-7 border-black header-p-margin">
                <Assignments items={assignments} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );  
}