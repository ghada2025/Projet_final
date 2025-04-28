import Image from "next/image";
import TimelineCourse from "./timeline";

interface Course {
  subject: string;
  color: string;
  // Ajoute d'autres propriétés si nécessaire
}

export default function CourseDetails({
  courseList,
  last,
  isSmallScreen,
}: {
  courseList: Course[];
  last: number;
  isSmallScreen?: boolean;
}) {
  const firstCourse = courseList?.[0];

  return (
    <section className={`${!isSmallScreen? "w-1/2":"w-1/3"}`}>
      <h3 className="h2-font">Course details</h3>
      <div className="rounded-lg border-3 border-b-7 border-r-7 border-black p-4 scroll-container overflow-y-auto h-[68vh] header-p-margin">
        <div
          className={`flex items-center justify-center h-[10vw] bg-[var(--main-${firstCourse?.color || "blue"})] rounded-lg`}
        >
          <div className="relative w-[6vw] h-[6vw] min-w-[50px] min-h-[50px]">
            <Image
              src="/calculating.png"
              alt="Course illustration"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <h2 className="h2-font header-p-padding">
          {firstCourse?.subject || "Aucun sujet"}
        </h2>

        <TimelineCourse course={courseList} last={last} />
      </div>
    </section>
  );
}

