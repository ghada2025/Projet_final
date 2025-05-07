"use client";
import AddClass from "@/components/add-class";
import { Input } from "@/components/dashboard/input";
import StudentsTable from "@/components/dashboard/students-table";
import { Textarea } from "@/components/dashboard/textarea";
import { DateField, DateInput, TimeField } from "@/components/ui/datefield-rac";
import { useContainerWidth } from "@/hooks/useContainerWidth";
import { CalendarDate } from "@internationalized/date";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Label } from "react-aria-components";

export default function Classes() {

const [items,setItems]= useState<any[]>([])

const [assignIndx, setAssignIndx]= useState<any>(0)

console.log(assignIndx)

useEffect(() => {
  async function fetchPosts() {
    try {
      const res = await fetch(`http://localhost:5007/assignment/teacher`, {
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
      
      const formattedData = dataAdd.map((exercise: any) => ({
        ...exercise,
        submission: exercise.submission.map((student: any) => ({
          ...student,
          joinDate: new Date(student.joinDate).toISOString().split('T')[0], // format to "YYYY-MM-DD"
        })),
      }));

      setItems(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  fetchPosts();
}, []);



  const assignRandomColors = (classes: any[]) => {
    const colors = ["red", "green", "blue", "orange"];

    return classes.map((classItem) => ({
      ...classItem,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  };
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    if (items.length > 0) {
      setAssignments(assignRandomColors(items));
    }
  }, [items]);
  const formatDate = (date: CalendarDate | null): string => {
    if (!date) return "";
    const day = String(date.day).padStart(2, "0");
    const month = String(date.month).padStart(2, "0");
    const year = date.year;
    return `${year}-${month}-${day}`;
  };

  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  const [gridRef, containerWidth] = useContainerWidth();
  const originalWidth = 1000; // assumed original full width

  async function handleCreate(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5007/assignment", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: description,
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
}
    

  const getGridCols = () => {
    if (containerWidth <= originalWidth * 0.33) return "grid-cols-1";
    if (containerWidth <= originalWidth * 0.66) return "grid-cols-2";
    return "grid-cols-3";
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isAssign, setIsAssign] = useState(false);

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
              isAssignment
              onClick={() => {
                setIsOpen(true);
              }}
            />
            {isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3b3b3b]">
                <div className="bg-white w-[90vw] max-w-[600px] rounded-lg shadow-lg p-6 relative animate-fadeIn">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
                  >
                    &times;
                  </button>
  
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">
                      Create a new Assignment
                    </h2>
                    <p className="text-gray-700 mb-6">
                      Test your students with good exercises
                    </p>
                  </div>
                  <div className="h-[66vh]">
                    <form className="space-y-6 p-6 border rounded-xl bg-white overflow-y-auto scroll-container">
                      <div>
                        <Label htmlFor="title">Assignment Title</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g., second degree equations"
                        />
                      </div>
  
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Write a short description about the course..."
                          className="resize-none"
                        />
                      </div>
  
                      <div>
                        <Label htmlFor="date">Select a Date</Label>
                        <DateField
                          className="*:not-first:mt-2"
                          value={selectedDate}
                          onChange={(date) => {
                            setSelectedDate(date);
                            console.log("Selected date:", date?.toString());
                          }}
                        >
                          <DateInput />
                        </DateField>
                      </div>
  
                      <div>
                        <Label htmlFor="name">Course Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g., Mathematics"
                        />
                      </div>
  
                      <div className="mt-6 flex justify-end gap-2">
                        <button
                          onClick={() => setIsOpen(false)}
                          className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          onClick={handleCreate}
                        >
                          Create
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
  
          <div className="flex-1 border mt-8 rounded-lg">
            <h2 className="p-4 text-center">Assignments List</h2>
            <div className="max-h-[70vh] h-auto overflow-y-auto scroll-container rounded-lg">
              {assignments.map((item: any, index: number) => (
                <div
                  key={index}
                  className="p-4 border border-x-0 flex items-center nav-gap justify-start"
                >
                  <div
                    className={clsx(
                      "border-2 rounded-full p-3 text-sm",
                      colorClasses[item.color as keyof typeof colorClasses]
                    )}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h2 className="text-md font-semibold line-clamp-1">
                      {item.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        <div
          ref={gridRef}
          className={clsx(
            "w-full h-full border grid auto-rows-[minmax(26.2vh,auto)] gap-5 p-5 rounded-lg overflow-y-auto scroll-container transition-all duration-300",
            getGridCols()
          )}
        >
          {assignments.map((item: any, index: number) => (
            <div key={index}>
              <div
                className="p-4 border h-full shadow-sm flex flex-col items-center nav-gap justify-center flex-wrap cursor-pointer"
                onClick={() => {
                  setIsAssign(true);
                  setAssignIndx(index);
                }}
              >
                <h2
                  className={clsx(
                    "text-sm font-semibold border-2 rounded-full p-[5%]",
                    colorClasses[item.color as keyof typeof colorClasses]
                  )}
                >
                  {index + 1}
                </h2>
                <div>
                  <h2 className="text-center text-sm font-semibold">
                    {item.title}
                  </h2>
                  <p className="text-sm text-muted-foreground text-center">
                    Number of submissions: {item.submission.length}
                  </p>
                </div>
              </div>
  
              {isAssign && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3b3b3b]">
                  <div className="bg-white w-[70vw] rounded-lg shadow-lg p-6 relative animate-fadeIn">
                    <button
                      onClick={() => {
                        setIsAssign(false);
                      }}
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
                    >
                      &times;
                    </button>
  
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">
                        Submitted assignments
                      </h2>
                      <p className="text-gray-700 mb-6">
                        Check the answer of your students
                      </p>
                    </div>
  
                    <div className="h-[66vh]">
                      <StudentsTable
                        isAssign={isAssign}
                        assignments={assignments[assignIndx].submission}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}  