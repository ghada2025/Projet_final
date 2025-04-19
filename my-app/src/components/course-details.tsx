import Image from "next/image";
import TimelineCourse from "./timeline";

export default function CourseDetails({courseList, last}: {courseList: any, last: number}) {
  return (
    <section className="w-1/4">
      <h3 className="h2-font">Course details</h3>
      <div className="rounded-lg border-3 border-b-7 border-r-7 border-black p-4 scroll-container overflow-y-auto h-[68vh] header-p-margin">
        <div className={`flex items-center justify-center h-[10vw] bg-[var(--main-${courseList[last].color})] rounded-lg`}>
          <div className="relative w-[6vw] h-[6vw]">
            <Image
              src={courseList[last].image}
              alt="Course title"
              fill
              className="object-cover"
            ></Image>
          </div>
        </div>
        {/* To change */}
        <h2 className="h2-font header-p-padding">{courseList[last].subject}</h2>

        <TimelineCourse course={courseList} last={last}></TimelineCourse>
      </div>
    </section>
  );
}
