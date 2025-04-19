import Image from "next/image";

export default function CourseCard({
  course,
}: {
  course: { title: string; description: string; image: string };
}) {
  return (
    <div className="flex flex-col items-center justify-evenly text-start bg-white rounded-lg shadow-md p-4 h-auto cursor-pointer transition-transform duration-300 transform hover:scale-105">
      <div className="relative height-img w-full flex items-center justify-center">
      <Image
        src={course.image}
        alt={course.title}
        fill
      ></Image>
      </div>
      <div className="header-p-padding">
        <h2 className="h2-font">{course.title}</h2>
        <p className="p-font text-neutral-400">
          {course.description.slice(0, 60)}...
        </p>
      </div>
    </div>
  );
}
