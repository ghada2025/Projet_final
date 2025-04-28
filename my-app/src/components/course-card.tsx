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
        <div className="relative w-[7vw] h-[7vw]">
          <Image
            src={"/calculating.png"}
            alt="Course title"
            fill
            className="object-cover"
          ></Image>
        </div>
      </div>
      <div className="header-p-padding">
        <div className="flex justify-between items-center">
        <h2 className="md:text-lg line-clamp-1 text-sm font-bold">{course.title}</h2>
        </div>
        <p className="md:text-sm text-neutral-400 line-clamp-2 mt-3 text-xs font-bold">
          {course.description}
        </p>
      </div>
    </div>
  );
}
