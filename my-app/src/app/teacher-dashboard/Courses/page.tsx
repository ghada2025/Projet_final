"use client";
import AddClass from "@/components/add-class";
import { EventColor } from "@/components/calendar/types";
import { Input } from "@/components/dashboard/input";
import { Label } from "@/components/dashboard/label";
import { Textarea } from "@/components/dashboard/textarea";
import { DateField, DateInput, TimeField } from "@/components/ui/datefield-rac";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useContainerWidth } from "@/hooks/useContainerWidth";
import { cn } from "@/lib/utils";
import type { CalendarDate, Time } from "@internationalized/date";
import clsx from "clsx";
import { useEffect, useState } from "react";

const colorOptions: Array<{
  value: EventColor;
  label: string;
  bgClass: string;
  borderClass: string;
}> = [
  {
    value: "blue",
    label: "Sky",
    bgClass: "bg-[var(--main-blue)] data-[state=checked]:bg-[var(--main-blue)]",
    borderClass: "border-[var(--main-blue)] data-[state=checked]:border-[var(--main-blue)]",
  },
  {
    value: "orange",
    label: "Amber",
    bgClass: "bg-[var(--main-orange)] data-[state=checked]:bg-[var(--main-orange)]",
    borderClass: "border-[var(--main-orange)] data-[state=checked]:border-[var(--main-orange)]",
  },
  {
    value: "purple",
    label: "Violet",
    bgClass: "bg-[var(--main-purple)] data-[state=checked]:bg-[var(--main-purple)]",
    borderClass: "border-[var(--main-purple)] data-[state=checked]:border-[var(--main-purple)]",
  },
  {
    value: "green",
    label: "Emerald",
    bgClass: "bg-[var(--main-green)] data-[state=checked]:bg-[var(--main-green)]",
    borderClass: "border-[var(--main-green)] data-[state=checked]:border-[var(--main-green)]",
  },
];

export default function Courses() {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  const [start, setStart] = useState<Time | null>(null);
  const [end, setEnd] = useState<Time | null>(null);
  const [color, setColor] = useState("blue");
  const [embedUrl, setEmbedUrl] = useState("");
  const [gridRef, containerWidth] = useContainerWidth();
  const [courses, setCourses] = useState<any>([]);

  const originalWidth = 1000; // assumed original full width

  const getGridCols = () => {
    if (containerWidth <= originalWidth * 0.33) return "grid-cols-1";
    if (containerWidth <= originalWidth * 0.66) return "grid-cols-2";
    return "grid-cols-3";
  };

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`http://localhost:5007/course`, {
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
        setCourses(dataAdd.courses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchPosts();
  }, []);

  const formatDate = (date: CalendarDate | null): string => {
    if (!date) return "";
    const day = String(date.day).padStart(2, "0");
    const month = String(date.month).padStart(2, "0");
    const year = date.year;
    return `${year}-${month}-${day}`;
  };

  const formatTime = (time: Time | null): string => {
    if (!time) return "";
    return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;
  };

  async function handleCreate(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5007/course", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: subject,
          title: title,
          description: description,
          startDate: formatDate(selectedDate),
          endDate: formatDate(selectedDate),
          startTime: formatTime(start),
          endTime: formatTime(end),
          content: content,
          color: color,
          classe: name,
          videoUrl: embedUrl,
        }),
      });

      console.log("course: ", {
        subject: subject,
        title: title,
        description: description,
        startDate: formatDate(selectedDate),
        endDate: formatDate(selectedDate),
        startTime: formatTime(start),
        endTime: formatTime(end),
        content: content,
        color: color,
        classe: name,
        videoUrl: embedUrl,
      });

      if (!res.ok) {
        throw new Error("Failed to create course");
      }

      console.log("Course created successfully!");
    } catch (error) {
      console.error("Error sending course creation:", error);
    }
  }

  const [isOpen, setIsOpen] = useState(false);

  const colorClasses = {
    red: "bg-red-300 border-red-600 text-red-600",
    green: "bg-green-300 border-green-600 text-green-600",
    blue: "bg-blue-300 border-blue-600 text-blue-600",
    orange: "bg-orange-300 border-orange-600 text-orange-600",
  };

  return (
    <>
      <div className="flex flex-col md:flex-row nav-gap">
        <div className="w-full md:w-[30%]">
          <div className="h-[74vh] border my-8 rounded-lg">
            <h2 className="p-4">Courses List</h2>
            <div className="h-[66vh] overflow-y-auto scroll-container cursor-pointer">
              {courses.map((courseItem: any, index: number) => (
                <div
                  key={index}
                  className="p-4 border border-x-0 shadow-sm flex items-center nav-gap justify-start"
                >
                  <p
                    className={clsx(
                      "border-2 rounded-full p-3 text-[12px]",
                      colorClasses[courseItem.color as keyof typeof colorClasses]
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
  
        <div className="w-full md:w-[70%] h-[74vh] my-8">
          {!isOpen && (
            <AddClass
              isCourse
              onClick={() => {
                setIsOpen(true);
              }}
            />
          )}
  
          {isOpen && (
            <form className="space-y-6 p-6 h-[74vh] border rounded-xl bg-white overflow-y-auto scroll-container">
              <div>
                <Label htmlFor="title">Course Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Mathematics"
                />
              </div>
  
              <div>
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Algebra Basics"
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
                <Label htmlFor="content">Course content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the content of the course..."
                  className="resize-none h-[20vh]"
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
                <Label>Select the start time and end time</Label>
                <div className="flex flex-col md:flex-row nav-gap items-center">
                  <TimeField
                    className="*:not-first:mt-2"
                    value={start}
                    onChange={(time) => {
                      setStart(time);
                      console.log("Selected start time:", time);
                    }}
                  >
                    <DateInput />
                  </TimeField>
                  <TimeField
                    className="*:not-first:mt-2"
                    value={end}
                    onChange={(time) => {
                      setEnd(time);
                      console.log("Selected end time:", time);
                    }}
                  >
                    <DateInput />
                  </TimeField>
                </div>
              </div>
  
              <div>
                <Label htmlFor="embedUrl">YouTube Embed URL</Label>
                <Input
                  id="embedUrl"
                  value={embedUrl}
                  onChange={(e) => setEmbedUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>
  
              <div>
                <Label htmlFor="name">Class Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Class A"
                />
              </div>
  
              <div className="flex flex-wrap gap-3 items-center">
                <Label htmlFor="color">Select Color</Label>
                <RadioGroup
                  value={color}
                  onValueChange={setColor}
                  aria-label="Select Color"
                  className="flex gap-1.5 items-center"
                >
                  {colorOptions.map((colorOption) => (
                    <RadioGroupItem
                      key={colorOption.value}
                      value={colorOption.value}
                      id={colorOption.value}
                      className={clsx(
                        "size-6 shadow-none",
                        colorOption.bgClass,
                        colorOption.borderClass
                      )}
                    />
                  ))}
                </RadioGroup>
              </div>
  
              {embedUrl && (
                <div className="w-full aspect-video mt-4 border rounded-lg overflow-hidden">
                  <iframe
                    src={embedUrl}
                    title="YouTube Video"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}
  
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleCreate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Create
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );  
}
