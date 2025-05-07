"use client";
import AddClass from "@/components/add-class";
import MultiQuizForm from "@/components/form";
import { useContainerWidth } from "@/hooks/useContainerWidth";
import { CalendarDate } from "@internationalized/date";
import { RiCursorLine } from "@remixicon/react";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function Classes() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  const [gridRef, containerWidth] = useContainerWidth();
  const originalWidth = 1000;
  const [courses, setCourses] = useState<any>([]);
  const [course, setCourse] = useState<any>([]);
  const [id, setId] = useState<any>();


  console.log(isOpen)

  // ✅ Always at top-level
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const endpoint = `http://localhost:5007/course${isOpen ? "/quiz" : "/"}`;
        const res = await fetch(endpoint, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
  
        const contentType = res.headers.get("content-type");
        const responseText = await res.text();
  
        if (!res.ok) {
          console.error("Server error:", responseText);
          return;
        }
  
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Expected JSON but got:", responseText);
          return;
        }
  
        const dataAdd = JSON.parse(responseText);
        if (dataAdd?.courses) {
          isOpen ? setCourse(dataAdd.courses) : setCourses(dataAdd.courses);
          setItems(dataAdd.courses)
        } else {
          console.warn("No 'courses' field in response.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchCourses();
  }, [isOpen]);  

  // ✅ Top-level effect
  useEffect(() => {
    if (items.length > 0) {
      setCourses(assignRandomColors(items));
    }
  }, [items]);

  const assignRandomColors = (classes: any[]) => {
    const colors = ["red", "green", "blue", "orange"];
    return classes.map((classItem) => ({
      ...classItem,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  };

  const formatDate = (date: CalendarDate | null): string => {
    if (!date) return "";
    const day = String(date.day).padStart(2, "0");
    const month = String(date.month).padStart(2, "0");
    const year = date.year;
    return `${year}-${month}-${day}`;
  };

  const handleCreate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5007/assignment", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          dueDate: formatDate(selectedDate),
          course: name,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create course");
      }

      console.log("Course created successfully!");
    } catch (error) {
      console.error("Error sending course creation:", error);
    }
  };

  const getGridCols = () => {
    if (containerWidth <= originalWidth * 0.33) return "grid-cols-1";
    if (containerWidth <= originalWidth * 0.66) return "grid-cols-2";
    return "grid-cols-3";
  };

  const colorClasses = {
    red: "bg-red-300 border-red-600 text-red-600",
    green: "bg-green-300 border-green-600 text-green-600",
    blue: "bg-blue-300 border-blue-600 text-blue-600",
    orange: "bg-orange-300 border-orange-600 text-orange-600",
  };


  return (
    <>
      <div className="flex flex-col gap-5 md:grid md:grid-rows-1 md:grid-cols-[30%_68.2%] mb-5">
        <div className="flex flex-col w-full">
          <div>
            <AddClass
              isQuiz
              onClick={() => {
                setIsOpen(true);
              }}
            />
            {isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3b3b3b]">
                <div className="bg-white w-[90vw] max-w-[600px] rounded-lg shadow-lg p-6 relative animate-fadeIn">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-1 right-2 text-gray-500 hover:text-gray-800 text-xl"
                  >
                    &times;
                  </button>
                  {course.map((classItem: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 border shadow-sm flex flex-col items-center gap-3 justify-center flex-wrap cursor-pointer"
                      onClick={() => {setIsOpen2(true), setId(classItem.id)}}
                    >
                      <h2
                        className={clsx(
                          "text-sm font-semibold border-2 rounded-full p-3",
                          colorClasses[
                            classItem.color as keyof typeof colorClasses
                          ]
                        )}
                      >
                        {index+1}
                      </h2>
                      <div>
                        <h2 className="text-center text-sm font-semibold">
                          {classItem.title}
                        </h2>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isOpen2 && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3b3b3b]">
                <div className="bg-white w-[90vw] max-w-[600px] rounded-lg shadow-lg p-6 relative animate-fadeIn">
                  <button
                    onClick={() => setIsOpen2(false)}
                    className="absolute top-1 right-2 text-gray-500 hover:text-gray-800 text-xl"
                  >
                    &times;
                  </button>
                  



                  <div>


                    <h2 className="text-2xl font-semibold mb-4">


                      Create a new Quiz


                    </h2>


                    <p className="text-gray-700 mb-6">


                      Test your students with good questions


                    </p>


                  </div>


                  <div className="h-[66vh] overflow-y-auto scroll-container">


                    <MultiQuizForm courseId={id}></MultiQuizForm>


                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border mt-8 rounded-lg">
            <h2 className="p-4 text-center">Quizzes List</h2>
            <div className="max-h-[53.3vh] h-auto overflow-y-auto scroll-container cursor-pointer">
              {courses.map((courseItem: any, index: number) => (
                <div
                  key={index}
                  className="p-4 border border-x-0 flex items-center nav-gap justify-start"
                  onClick={() => {
                    setSelectedCourse(index + 1);
                  }}
                >
                  <p
                    className={clsx(
                      "border-2 rounded-full p-3 text-[12px]",
                      colorClasses[
                        courseItem.color as keyof typeof colorClasses
                      ]
                    )}
                  >
                    {courseItem.subject?.[0] || ""}
                  </p>
                  <div>
                    <h2 className="text-md font-semibold line-clamp-1">
                      {courseItem.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {courseItem.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedCourse ? (
          <div
            ref={gridRef}
            className={clsx(
              "w-full max-h-[88.5vh] h-auto border grid gap-5 p-5 rounded-lg overflow-y-auto scroll-container transition-all duration-300",
              getGridCols()
            )}
          >
            {courses[selectedCourse - 1]?.quizz.questions.map(
              (quiz: any, index: number) => (
                <div
                  key={index}
                  className="p-6 h-auto border rounded-lg shadow-sm flex flex-col items-center nav-gap justify-center flex-wrap"
                >
                  <div className="w-full">
                    <h2 className="h2-font">{quiz.title}</h2>
                    <p className="p-font py-3">{quiz.question}</p>
                    <p className="p-font pb-3">
                      <span className="font-bold text-[18px]">
                        The answer :{" "}
                      </span>{" "}
                      {quiz.answers.join(" - ")}
                    </p>
                    <p className="p-font pb-3">
                      <span className="font-bold text-[18px]">
                        The options :{" "}
                      </span>
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      {quiz.options?.map((option: string, key: number) => (
                        <div
                          key={key}
                          className={`cursor-pointer border shadow-sm py-2 px-4 flex items-center font-semibold p-font nav-gap`}
                        >
                          <div className={`py-0.3 px-1`}>
                            {String.fromCharCode(65 + key)}
                          </div>
                          <h2>{option}</h2>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className=" border flex flex-col items-center justify-center px-4 py-8 rounded-lg text-center cursor-pointe transition h-full">
            <div
              className={`bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border`}
              aria-hidden="true"
            >
              <RiCursorLine className={`size-7 opacity-60`} />
            </div>
            <p className={`mb-1.5 text-2xl font-medium`}>
              Select A Course To See Its Quiz
            </p>
            <p className={`text-muted-foreground text-l`}>
              Click on the needed course on the left
            </p>
          </div>
        )}
      </div>
    </>
  );
}