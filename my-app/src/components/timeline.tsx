"use client"

import { CheckIcon } from "lucide-react"
import { Timeline, TimelineContent, TimelineDate, TimelineHeader, TimelineIndicator, TimelineItem, TimelineSeparator, TimelineTitle } from "@/components/ui/timeline"

export default function TimelineCourse({ course, last }: { course: any, last: number }) {

  return (
    <Timeline value={last}>
      {course.map((item: any, key:number) => (
        <TimelineItem
          key={key}
          step={key+1}
          className="group-data-[orientation=vertical]/timeline:ms-10"
        >
          <TimelineHeader>
            <TimelineSeparator
              isCompleted={key < last}
              className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5"
            />
            <TimelineDate>{item.date}</TimelineDate>
            <TimelineTitle>{item.title}</TimelineTitle>
            <TimelineIndicator className="group-data-completed/timeline-item:bg-[var(--main-orange)] group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
              <CheckIcon className="group-not-data-completed/timeline-item:hidden" size={16} />
            </TimelineIndicator>
          </TimelineHeader>
          <TimelineContent>{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

