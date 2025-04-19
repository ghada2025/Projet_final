"use client";
import FlipCard from "@/components/test";

export default function Grade() {

  const grades = [
    {
      grade: "Primary School",
      image: "/primary.png",
      levels: ["1AP", "2AP", "3AP", "4AP", "5AP"],
    },
    {
      grade: "Middle School",
      image: "/secondary.png",
      levels: ["1AM", "2AM", "3AM", "4AM"],
    },
    {
      grade: "High School",
      image: "/high.png",
      levels: ["1AS", "2AS", "3AS"],
    },
  ];
  return (
    <div className="flex justify-center items-center w-[100vw] h-screen">
      <div className="w-[100vw]">
        <div className="text-center header-p-padding">
          <h1 className="header-font">Select your grade</h1>
          <h3 className="font-bold text-[var(--main-orange)] header-h3-font">
            You're one step away !
          </h3>
        </div>
        <div className="flex flex-wrap justify-evenly items-center section-padding">
          {grades.map((grade, index) => (
            <FlipCard
              key={index}
              image={grade.image}
              levels={grade.levels}
              grade={grade.grade}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
