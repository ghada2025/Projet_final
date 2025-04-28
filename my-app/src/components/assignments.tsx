"use client";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronRightIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";

// const items = [
//   {
//     id: "1",
//     submission.status: "Done",
//     title: "Shapes Hunt!",
//     sub: "Mathematics",
//     content:
//       "Go on a shapes hunt around your house! Find and draw 5 objects that look like circles, squares, or triangles. Label each shape.",
//   },
//   {
//     id: "2",
//     title: "The Magic Water Trick",
//     sub: "Physics",
//     content:
//       "Fill a glass with water and place a piece of paper on top. Flip it quickly and carefully! What happens? Write or draw your result.",
//   },
//   {
//     id: "3",
//     title: "Grow a Bean Plant",
//     submission.status: "Done",
//     sub: "Biology",
//     content:
//       "Plant a dry bean in cotton and keep it by a window. Watch it grow for a week. Draw what you see each day.",
//   },
//   {
//     id: "4",
//     title: "My Day in French",
//     sub: "French Language",
//     content:
//       "Write 5 simple things you do in a day in French. For example: Je mange. Je joue. Add pictures if you like!",
//   },
//   {
//     id: "5",
//     title: "Famous Explorer",
//     sub: "History",
//     content:
//       "Choose a famous explorer like Christopher Columbus or Ibn Battuta. Draw their ship or path and write 3 things they discovered.",
//   },
//   {
//     id: "6",
//     title: "Weather Report",
//     sub: "Geography",
//     submission.status: "Done",

//     content:
//       "Check the weather for 3 days. Was it sunny, rainy, or cloudy? Make a weather chart and draw pictures to match each day.",
//   },
//   {
//     id: "7",
//     title: "My Favorite Book",
//     sub: "Literature",
//     content:
//       "Pick your favorite storybook. Draw your favorite part and write a few sentences about why you liked it.",
//   },
// ];

export default function Assignments({ items }: { items: any[] }) {
  function handleClick(key: number) {
    const answer = inputValue[key];
    const assignmentId = items[key].id;
    
    if (isSubmitted[key] === 0) {
      fetch("http://localhost:5007/assignment/submit", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer: answer, assignmentId: assignmentId }),
      });
    } else {
      fetch("http://localhost:5007/assignment/submit", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer: answer, assignmentId: assignmentId }),
      });
    }
  }
  
  const [submission, setSubmission] = useState<number[]>([]);

  useEffect(() => {
    const submittedIndexes = items
      .map((item, index) => (item?.submission?.answer ? index : -1))
      .filter((index) => index !== -1);
    setSubmission(submittedIndexes);
  }, [items]);

  
  const [inputValue, setInputValue] = useState<string[]>(
    items.map((item) => item?.submission?.answer)
  );
  
  const [isSubmitted, setIsSubmitted] = useState<number[]>([]);
  useEffect(() => {
    if (items.length > 0) {
      setIsSubmitted(Array(items.length).fill(0));
    }
  }, [items]);
  
  useEffect(() => {
    const fixedLength = items.length;
    const filledArray = Array.from(
      { length: fixedLength },
      (_, i) => items[i]?.submission?.answer ?? ""
    );
    setInputValue(filledArray);
  }, [items]);
  
  const handleSubmition = ({ index }: { index: number }) => {
    if (submission.includes(index)) {
      setSubmission((prev) => prev.filter((i) => i !== index));
      items[index].submission.status = "upcoming";
    }
    if (!submission.includes(index)) {
      setSubmission((prev) => [...prev, index]);
      items[index].submission.status = "Done";
    }
  };

  return (
    <div className="overflow-y-auto scroll-container h-[78.5vh]">
      <div className="px-10">
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, key) => (
            <AccordionItem value={item.id} key={key} className="py-2">
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] [&[data-state=open]>svg]:rotate-90">
                  <span className="flex flex-col">
                    <span className="header-p-font font-bold line-clamp-1">
                      {item.title}
                    </span>
                    {item.sub && (
                      <span className="p-font font-semibold">
                        {item.description}
                      </span>
                    )}
                  </span>
                  <div className="flex items-center justify-center nav-gap">
                    <div
                      className={`py-[0.6vw] w-[8.5vw] p-font-2 text-center ${
                        item.submission.status == "Done"
                          ? "bg-[var(--sub-green)]"
                          : "bg-[var(--sub-orange)]"
                      } rounded-3xl text-[var(--main-${
                        item.submission.status == "Done" ? "green" : "orange"
                      })] font-semibold`}
                    >
                      {item.submission.status === "Done" ? "Done" : "Upcoming"}
                    </div>
                    <ChevronRightIcon
                      size={16}
                      className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200 text-black"
                      aria-hidden="true"
                    />
                  </div>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionContent className="text-muted-foreground pb-2">
                <div className="header-p-padding">{item.description}</div>
                <div className="*:not-first:mt-2">
                  <div className="flex rounded-md shadow-xs">
                    <Input
                      className="-me-px flex-1 rounded-e-none shadow-none focus-visible:z-10"
                      placeholder="submit your link here"
                      type="text"
                      disabled={submission.includes(key) ? true : false}
                      value={
                        inputValue[key] !== undefined ? inputValue[key] : ""
                      }
                      onChange={(e) =>
                        setInputValue((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                    />
                    {submission.includes(key) && (
                      <button
                        onClick={() => {
                          handleSubmition({ index: key });
                        }}
                        className="bg-[var(--main-orange)] font-semibold border-3 border-black border-l-0 cursor-pointer border-b-5 border-r-5 text-foreground hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center rounded-e-md px-3 text-sm  transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {"Update"}
                      </button>
                    )}
                    {!submission.includes(key) && (
                      <button
                        onClick={() => {
                          handleSubmition({ index: key });
                          setIsSubmitted((prev) => {
                            const newArr = [...prev];
                            newArr[key] = newArr[key] + 1;
                            return newArr;
                          });
                          handleClick(key);
                        }}
                        className="bg-[var(--main-orange)] font-semibold border-3 border-black border-l-0 cursor-pointer border-b-5 border-r-5 text-foreground hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center rounded-e-md px-3 text-sm  transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {"Submit"}
                      </button>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
