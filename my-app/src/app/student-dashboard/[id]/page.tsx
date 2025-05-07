"use client";
import CourseDetails from "@/components/course-details";
import Header from "@/components/header";
import { useContainerWidth } from "@/hooks/useContainerWidth";
import clsx from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Course() {
  const [gridRef, containerWidth] = useContainerWidth();
  const originalWidth = 1000; // assumed original full width

  const containerWidthSet = () => {
    if (containerWidth <= originalWidth) return `w-${containerWidth} mx-auto`;
    return `w-${containerWidth}`;
  };

  const params = useParams();
  const id = params.id;
  console.log("id", id);
  const [coursedet, setCoursedet] = useState<any[]>([]);
  const [course, setCourse] = useState<any>(null);
  const [last, setLast] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, coursedetRes] = await Promise.all([
          fetch(`http://localhost:5007/course/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
          fetch(`http://localhost:5007/course/weekSubject/${id}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }),
        ]);
        if (!courseRes.ok || !coursedetRes.ok) {
          throw new Error("One of the fetches failed");
        }

        const courseData = await courseRes.json();
        const coursedetData = await coursedetRes.json();

        const replaceId = (obj: any) => {
          const newObj = { ...obj };
          newObj.id = newObj._id;
          delete newObj._id;
          return newObj;
        };

        const cleanCoursedet = [
          ...(coursedetData.completed?.map(replaceId) || []),
          ...(coursedetData.incompleted?.map(replaceId) || []),
        ];

        setLast(coursedetData.completed.length);
        const cleanCourse = courseData?.course
          ? replaceId(courseData.course)
          : null;

        setCoursedet(cleanCoursedet);
        setCourse(cleanCourse);
        console.log("coursedet", cleanCoursedet);
      } catch (err) {
        console.error("Fetching error:", err);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const checkScreenWidth = () => {
      if (window.innerWidth < 1050) {
        setIsSmallScreen(true);
      } else {
        setIsSmallScreen(false);
      }
    };

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  if (!course || coursedet.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center header-font">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center relative">
      <div className="max-w-[1400px] px-[50px] gap-10 w-full">
        <Header />

        <div className="flex h-auto lg:h-[80vh] nav-gap w-full">
          {!isSmallScreen && (
            <CourseDetails courseList={coursedet} last={last} isSmallScreen={isSmallScreen} />
          )}

          {showDetails && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3b3b3b]">
              <div className="bg-white w-[90vw] max-w-[600px] rounded-lg shadow-lg p-6 relative animate-fadeIn flex justify-center">
                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
                >
                  &times;
                </button>
                <CourseDetails courseList={coursedet} last={last} />
              </div>
            </div>
          )}

          <section className={clsx(isSmallScreen ? "w-full" : "w-7/10")}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="h2-font">Let's learn !</h3>

              {isSmallScreen && (
                <button
                  className="font-bold header-p-font text-[var(--main-orange)] py-2 lg:hidden"
                  onClick={() => setShowDetails((prev) => !prev)}
                >
                  {showDetails ? "Hide Details" : "Show Details"}
                </button>
              )}
            </div>

            <div
              ref={gridRef}
              className="rounded-lg border-3 border-b-7 border-r-7 border-black p-6 overflow-y-auto scroll-container h-[68vh] header-p-margin flex flex-col"
            >
              <div>
                <div>
                  <h2 className="h2-font">{course?.title}</h2>
                </div>
                <div className="flex items-start nav-gap votre-classe w-full">
                  <p className="p-font header-p-padding w-5/10 [@media(max-width:1000px)]:w-full">
                    {course?.description}
                  </p>
                  <div className={clsx(containerWidthSet())}>
                    <iframe
                      width="100%"
                      height="315"
                      src="https://www.youtube.com/embed/Piw-9dOC8YQ?si=5DWzuqqLknE4qOoY"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className={clsx("rounded-lg mb-5 h-[30vh]", containerWidthSet())}
                    ></iframe>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto [@media(max-width:320px)]:flex-col [@media(max-width:320px)]:gap-2">
                <Link href="/student-dashboard/">
                  <button className="font-bold header-p-font text-[var(--main-orange)] py-2">
                    Previous
                  </button>
                </Link>
                <Link href={`/student-dashboard/${id}/quiz`}>
                  <button className="custom-button header-p-font ml-3">
                    Take The Quiz
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}