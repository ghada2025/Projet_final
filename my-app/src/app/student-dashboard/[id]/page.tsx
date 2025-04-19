"use client";
import CourseDetails from "@/components/course-details";
import Header from "@/components/header";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Course() {
  const { id } = useParams<{ id: string }>();
  const [coursedet, setcoursedet] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, coursedetRes] = await Promise.all([
          fetch(`http://localhost:5007/course/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
          fetch(`http://localhost:5007/course/weekSubject/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ]);
  
        if (!coursedetRes.ok || !courseRes.ok) {
          throw new Error("One of the fetches failed");
        }
  
        const coursedetData = await coursedetRes.json();
        const courseData = await courseRes.json();
  
        // Utility to replace _id with id
        const replaceId = (obj: any) => {
          const newObj = { ...obj };
          newObj.id = newObj._id;
          delete newObj._id;
          return newObj;
        };
        
  
        const cleanCoursedet = coursedetData.coursedet.map(replaceId);
        const cleanCourse = replaceId(courseData);
  
        setcoursedet(cleanCoursedet);
        setCourse(cleanCourse);
      } catch (err) {
        console.error("Fetching error:", err);
      }
    };
  
    fetchData();
  }, []);
  
  const { courseComplete, Pending } = coursedet;
  const courseList = courseComplete.concat(Pending);
  const last = courseComplete.length;

  return (
    <div className="flex items-center justify-center relative">
      <div className="max-w-[1400px] px-[50px] gap-10 w-full">
        {/* Header part */}

        <Header></Header>

        {/* Course Section */}

        <div className="flex h-[80vh] nav-gap">
          {/* Course Details */}

          <CourseDetails courseList={courseList} last={last}></CourseDetails>

          {/* Course lecture */}

          <section className="w-3/4">
            <h3 className="h2-font">Let's learn !</h3>
            <div className="rounded-lg border-3 border-b-7 border-r-7 border-black p-6 overflow-y-auto scroll-container h-[68vh] header-p-margin flex flex-col">
              <div className="">
                <div>
                  {/* To change */}
                  <h2 className="h2-font">{course.title}</h2>
                </div>
                <div className="flex items-start justify-between nav-gap">
                  <p className="p-font header-p-padding w-5/10">
                    {/* Le lorem ipsum est, en imprimerie, une suite de mots sans
                    signification utilisée à titre provisoire pour calibrer une
                    mise en page, le texte définitif venant remplacer le
                    faux-texte dès qu'il est prêt ou que la mise en page est
                    achevée. Généralement, on utilise un texte en faux Le lorem
                    ipsum est, en imprimerie, une suite de mots sans
                    signification utilisée à titre provisoire pour calibrer une
                    mise en page, le texte définitif venant remplacer le
                    faux-texte dès qu'il est prêt ou que la mise en page est
                    achevée. Généralement, on utilise un texte en faux */}
                    {course.description}
                  </p>
                  {/* Video replace */}
                  <div className="w-5/10 flex items-start justify-center">
                    <iframe
                      width="560"
                      height="315"
                      src={`${course.video}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="header-p-padding"
                    ></iframe>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <Link href="/student-dashboard/1">
                  <button className="font-bold header-p-font text-[var(--main-orange)] py-2">
                    Previous
                  </button>
                </Link>
                <Link href={`/student-dashboard/${id}/quiz`}>
                  <button className="custom-button header-p-font">
                    Take The Quiz !
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
