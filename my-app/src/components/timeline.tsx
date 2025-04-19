import { CheckIcon } from "lucide-react"

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline"

// const items = [
//   {
//     id: 1,
//     date: "Sep 5, 2024",
//     title: "Understanding Place Value",
//     description:
//       "Students learn how numbers are built using ones, tens, hundreds, and thousands. Activities include base-ten blocks and number expansion.",
//   },
//   {
//     id: 2,
//     date: "Sep 19, 2024",
//     title: "Addition & Subtraction",
//     description:
//       "Exploring multi-digit addition and subtraction with and without regrouping. Real-life word problems introduced for practice.",
//   },
//   {
//     id: 3,
//     date: "Oct 3, 2024",
//     title: "Multiplication Basics",
//     description:
//       "Introduction to multiplication using arrays, skip counting, and repeated addition. Students begin memorizing times tables.",
//   },
//   {
//     id: 4,
//     date: "Oct 17, 2024",
//     title: "Understanding Fractions",
//     description:
//       "Students explore fractions as parts of a whole and parts of a set. Visual aids like pie charts and fraction strips are used.",
//   },
// ]


export default function TimelineCourse({ course, last }: { course: any, last: number }) {
  return (
    <Timeline defaultValue={last}>
      {course.map((item:any) => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className="group-data-[orientation=vertical]/timeline:ms-10"
        >
          <TimelineHeader>
            <TimelineSeparator isCompleted={item.id<2? true:false} className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
            <TimelineDate>{item.date}</TimelineDate>
            <TimelineTitle>{item.title}</TimelineTitle>
            <TimelineIndicator className="group-data-completed/timeline-item:bg-[var(--main-orange)] group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
              <CheckIcon
                className="group-not-data-completed/timeline-item:hidden"
                size={16}
              />
            </TimelineIndicator>
          </TimelineHeader>
          <TimelineContent>{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
