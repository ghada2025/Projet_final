export type CalendarView = "month" | "week" | "day" | "agenda"

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  startTime?: string
  endTime?:string
  allDay?: boolean
  color?: EventColor
  location?: string
}

export type EventColor =
  | "blue"
  | "red"
  | "purple"
  | "green"
  | "orange"
