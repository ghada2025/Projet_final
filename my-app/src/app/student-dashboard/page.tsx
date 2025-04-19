"use client";
import Assignments from "@/components/assignments";
import Calendar from "@/components/calendar";
import CourseCard from "@/components/course-card";
import Header from "@/components/header";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StudentDashboard() {
  // const courses = [
  //   {
  //     id: "1",
  //     title: "Mathematics",
  //     description:
  //       "Learn numbers, shapes, and fun puzzles to become a little math wizard!",
  //     image: "/calculating.png",
  //     color: "red",
  //     status: "Done",
  //   },
  //   {
  //     id: "2",
  //     title: "Science",
  //     description:
  //       "Discover how plants grow, why the sky is blue, and explore fun experiments!",
  //     image: "/calculating.png",
  //     color: "orange",
  //     status: "Upcoming",
  //   },
  //   {
  //     id: "3",
  //     title: "History",
  //     description:
  //       "Travel back in time to meet dinosaurs, ancient kings, and explore cool old stuff!",
  //     image: "/calculating.png",
  //   },
  //   {
  //     id: "4",
  //     title: "Geography",
  //     description:
  //       "Explore maps, countries, animals, and discover amazing places around the world!",
  //     image: "/calculating.png",
  //   },
  //   {
  //     id: "5",
  //     title: "English",
  //     description:
  //       "Read stories, learn new words, and become a young storyteller and reader!",
  //     image: "/calculating.png",
  //   },
  //   {
  //     id: "6",
  //     title: "Art",
  //     description:
  //       "Paint, draw, and create colorful masterpieces with your imagination!",
  //     image: "/calculating.png",
  //   },
  //   {
  //     id: "7",
  //     title: "Music",
  //     description:
  //       "Play fun instruments, sing songs, and explore the magical world of music!",
  //     image: "/calculating.png",
  //   },
  //   {
  //     id: "8",
  //     title: "PE",
  //     description:
  //       "Run, jump, dance and play games that keep you active and strong!",
  //     image: "/calculating.png",
  //   },
  // ];

  // fetching data from the server

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

        if (!coursesRes.ok || !eventsRes.ok || !assignmentsRes.ok) {
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
        setAssignments(assignmentsData.assignments.map(replaceId));
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

  const classes: any = courses.map(
    ({
      title,
      description,
      startTime,
      endTime,
    }: {
      title: any;
      description: any;
      startTime: any;
      endTime: any;
    }) => ({ title, description, startTime, endTime })
  );

  return (
    <>
      <div className="flex items-center justify-center relative">
        <div className="max-w-[1400px] px-[50px] w-full">
          {/* Header part */}

          <Header show></Header>

          {/* Course Section */}

          <div className="footer-padding">
            <div className="flex items-center justify-between">
              <h3 className="header-h3-font">This week course</h3>
            </div>
            <div className="flex overflow-x-auto scroll-container gap-10 [@media(max-width:700px)]:grid-cols-2 section-padding">
              {/* Course cards */}
              {courses.map((course: any, index: number) => (
                <Link key={index} href={`/student-dashboard/${course.id}`}>
                  <CourseCard course={course}></CourseCard>
                </Link>
              ))}
            </div>
          </div>

          {/* Organisation Section */}

          <div className="grid grid-cols-2 gap-10 w-full">
            <div>
              <h3 className="header-h3-font">Calendar</h3>
              <div className="rounded-lg border-3 border-b-7 border-r-7 border-black header-p-margin">
                <Calendar sampleEvents={events} classes={classes}></Calendar>
              </div>
            </div>
            <div>
              <h3 className="header-h3-font">Assignments</h3>
              <div className="rounded-lg border-3 border-b-7 border-r-7 border-black header-p-margin">
                <Assignments items={assignments}></Assignments>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
