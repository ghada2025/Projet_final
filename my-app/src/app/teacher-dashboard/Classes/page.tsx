"use client";
import AddClass from "@/components/add-class";
import { Progress } from "@/components/dashboard/progress";
import StudentsTable from "@/components/dashboard/students-table";
import { useContainerWidth } from "@/hooks/useContainerWidth";
import clsx from "clsx";
import { useEffect, useState } from "react";


// add grade input
// isOpen: change class to grade


export default function Classes() {

const [initclasses, setInitClasses]=useState<any[]>([])

useEffect(() => {
  async function fetchPosts() {
    try {
      const res = await fetch(`http://localhost:5007/teacher/classe`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", text);
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Expected JSON but got:", text);
        return;
      }

      const dataAdd = await res.json();
      setInitClasses(dataAdd);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  fetchPosts();
}, []);

const assignRandomColors = (classes: any[]) => {
  let hash = 0;
  let newClasses = []
  for (let i = 0; i < classes.length; i++) {
      hash = classes[i].name.charCodeAt(i) + ((hash << 5) - hash);
      newClasses.push({...classes[i], color: `hsl(${hash % 360}, 70%, 60%)`})
  }
  return newClasses
};

  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    setClasses(assignRandomColors(initclasses));
  }, [initclasses]);

  const [gridRef, containerWidth] = useContainerWidth();
  const originalWidth = 1000; // assumed original full width



  const getGridCols = () => {
    if (containerWidth <= originalWidth * 0.33) return "grid-cols-1";
    if (containerWidth <= originalWidth * 0.66) return "grid-cols-2";
    return "grid-cols-3";
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-5 md:grid md:grid-rows-1 md:grid-cols-[30%_68.2%] mb-5">
        <div className="flex flex-col w-full">
          <div>
            <AddClass
              onClick={() => {
                setIsOpen(true);
              }}
            />
            {isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3b3b3b]">
                <div className="bg-white w-[70vw]  rounded-lg shadow-lg p-6 relative animate-fadeIn">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
                  >
                    &times;
                  </button>
  
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">
                      Create a new class
                    </h2>
                    <p className="text-gray-700 mb-6">
                      Select all the students you want in your class
                    </p>
                  </div>
  
                  <div className="h-[66vh]">
                    <StudentsTable isOpen={isOpen} />
                  </div>
                </div>
              </div>
            )}
          </div>
  
          <div className="border flex-1 mt-8 rounded-lg">
            <h2 className="p-4 text-center">Classes List</h2>
            <div className="max-h-[70vh] h-auto overflow-y-auto scroll-container rounded-lg">
              {classes.map((classItem: any, index: number) => (
                <div
                  key={index}
                  className="p-4 border border-x-0 shadow-sm flex items-center nav-gap justify-center flex-wrap"
                >
                  <h2
                    className={clsx(
                      "text-lg border-2 rounded-full p-2"
                    )} style={{ backgroundColor: classItem.color }}
                  >
                    {classItem.name}
                  </h2>
                  <div>
                    <h2 className="text-center text-sm font-semibold">
                      {classItem.name}
                    </h2>
                    <Progress
                      className="h-1 w-20 mt-1"
                      value={classItem.value}
                      color={classItem.color}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        <div
          ref={gridRef}
          className={clsx(
            "w-full h-full border grid auto-rows-[minmax(26.2vh,auto)] gap-5 p-5 mb-8 rounded-lg overflow-y-auto scroll-container transition-all duration-300",
            getGridCols()
          )}
        >
          {classes.map((classItem: any, index: number) => (
            <div
              key={index}
              className="p-4 border shadow-sm flex flex-col items-center nav-gap justify-center flex-wrap"
            >
              <h2
                className={clsx(
                  "text-lg border-2 rounded-full p-[5%]"
                )} style={{ backgroundColor: classItem.color }}
              >
                {classItem.name}
              </h2>
              <div>
                <h2 className="text-center text-sm font-semibold">
                  {classItem.name}
                </h2>
                <p className="text-sm text-muted-foreground text-center">
                  Number of students: {classItem.students}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );  
}
