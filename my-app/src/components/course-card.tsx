import Image from "next/image";

export default function CourseCard({
  course,
}: {
  course: { title: string; description: string; image: string; color:string, status:string };
}) {
  return (
    <div className="flex flex-col items-center w-[19vw] [@media(max-width:1000px)]:w-[25vw] [@media(max-width:700px)]:w-[35vw] justify-evenly text-start bg-white border rounded-lg shadow-md p-4 h-auto cursor-pointer transition-transform duration-300 transform hover:scale-105">
      <div
        className={`flex items-center justify-center h-[10vw] bg-[var(--main-${course.color})] rounded-lg w-full`}
      >
        <div className="relative w-[6vw] h-[6vw]">
          <Image
            src={course.image}
            alt="Course title"
            fill
            className="object-cover"
          ></Image>
        </div>
      </div>
      <div className="header-p-padding">
        <div className="flex justify-between items-center">
        <h2 className="h2-font">{course.title}</h2>
        <p className={`p-font font-semibold text-[var(--main-${course.status=="Done"?"green":"orange"})]`}>{course.status}</p>
        </div>
        <p className="p-font text-neutral-400 line-clamp-2 mt-3">
          {course.description}
        </p>
      </div>
    </div>
  );
}
