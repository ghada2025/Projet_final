"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

// Types
type TimelineContextValue = {
  activeStep: number
  setActiveStep: (step: number) => void
}

// Context
const TimelineContext = React.createContext<TimelineContextValue | undefined>(undefined)

const useTimeline = () => {
  const context = React.useContext(TimelineContext)
  if (!context) {
    throw new Error("useTimeline must be used within a Timeline")
  }
  return context
}

// Components
interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  onValueChange?: (value: number) => void
  orientation?: "horizontal" | "vertical"
}

function Timeline({
  value,
  onValueChange,
  orientation = "vertical",
  className,
  ...props
}: TimelineProps) {
  const setActiveStep = React.useCallback(
    (step: number) => {
      onValueChange?.(step)
    },
    [onValueChange]
  )

  return (
    <TimelineContext.Provider value={{ activeStep: value, setActiveStep }}>
      <div
        role="list"
        data-slot="timeline"
        className={cn(
          "group/timeline flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
          className
        )}
        data-orientation={orientation}
        {...props}
      />
    </TimelineContext.Provider>
  )
}

function TimelineContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="timeline-content" className={cn("text-muted-foreground p-font", className)} {...props} />
}

interface TimelineDateProps extends React.HTMLAttributes<HTMLTimeElement> {
  asChild?: boolean
}

function TimelineDate({ asChild = false, className, ...props }: TimelineDateProps) {
  const Comp = asChild ? Slot : "time"
  return (
    <Comp
      data-slot="timeline-date"
      className={cn(
        "text-muted-foreground mb-1 block text-xs font-medium group-data-[orientation=vertical]/timeline:max-sm:h-4",
        className
      )}
      {...props}
    />
  )
}

function TimelineHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="timeline-header" className={cn(className)} {...props} />
}

interface TimelineIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

function TimelineIndicator({ asChild = false, className, children, ...props }: TimelineIndicatorProps) {
  return (
    <div
      data-slot="timeline-indicator"
      className={cn(
        "border-primary/20 group-data-completed/timeline-item:border-primary absolute size-4 rounded-full border-2 transition-all duration-300 ease-in-out",
        "group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=horizontal]/timeline:left-0 group-data-[orientation=horizontal]/timeline:-translate-y-1/2",
        "group-data-[orientation=vertical]/timeline:top-0 group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:-translate-x-1/2",
        className
      )}
      aria-hidden="true"
      {...props}
    >
      {children}
    </div>
  )
}

interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number
}

function TimelineItem({ step, className, ...props }: TimelineItemProps) {
  const { activeStep } = useTimeline()
  const isCompleted = step <= activeStep

  return (
    <div
      role="listitem"
      data-slot="timeline-item"
      className={cn(
        "group/timeline-item has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-primary relative flex flex-1 flex-col gap-0.5",
        "group-data-[orientation=horizontal]/timeline:mt-8 group-data-[orientation=horizontal]/timeline:not-last:pe-8",
        "group-data-[orientation=vertical]/timeline:ms-8 group-data-[orientation=vertical]/timeline:not-last:pb-12",
        className
      )}
      data-completed={isCompleted || undefined}
      {...props}
    />
  )
}

type TimelineSeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  isCompleted?: boolean
}

function TimelineSeparator({ className, isCompleted = false, ...props }: TimelineSeparatorProps) {
  return (
    <div
      data-slot="timeline-separator"
      className={cn(
        "absolute self-start group-last/timeline-item:hidden transition-all duration-300 ease-in-out",
        "group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=horizontal]/timeline:h-0.5 group-data-[orientation=horizontal]/timeline:w-[calc(100%-1rem-0.25rem)] group-data-[orientation=horizontal]/timeline:translate-x-4.5 group-data-[orientation=horizontal]/timeline:-translate-y-1/2",
        "group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:h-[calc(100%-1rem-0.25rem)] group-data-[orientation=vertical]/timeline:w-0.5 group-data-[orientation=vertical]/timeline:-translate-x-1/2 group-data-[orientation=vertical]/timeline:translate-y-4.5",
        className
      )}
      style={{ backgroundColor: isCompleted ? "var(--main-orange)" : "rgba(0,0,0,0.1)" }}
      aria-hidden="true"
      {...props}
    />
  )
}

function TimelineTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 data-slot="timeline-title" className={cn("p-font font-bold", className)} {...props} />
}

export {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
  useTimeline
}
