import {
  Alarm,
  Build,
  CalendarToday,
  CarRepair,
  Computer,
  DirectionsCar,
  Email,
  Event,
  LocalGasStation,
  Notifications,
  Person,
  Phone,
  Smartphone,
  TaskAlt,
  Timelapse,
  VideoCall,
  ViewAgenda,
  ViewDay,
  ViewWeek,
} from "@mui/icons-material";

export const SERVICE_TYPES = [
  {
    id: 1,
    name: "Oil Change",
    icon: <LocalGasStation />,
    duration: 60,
    color: "#4CAF50",
    category: "maintenance",
    price: "$50-$80",
  },
  {
    id: 2,
    name: "Brake Service",
    icon: <DirectionsCar />,
    duration: 120,
    color: "#FF9800",
    category: "safety",
    price: "$100-$300",
  },
  {
    id: 3,
    name: "Engine Repair",
    icon: <Build />,
    duration: 240,
    color: "#F44336",
    category: "repair",
    price: "$500-$2000",
  },
  {
    id: 4,
    name: "Tire Replacement",
    icon: <DirectionsCar />,
    duration: 120,
    color: "#2196F3",
    category: "maintenance",
    price: "$80-$200",
  },
  {
    id: 5,
    name: "AC Service",
    icon: <Build />,
    duration: 180,
    color: "#9C27B0",
    category: "comfort",
    price: "$150-$400",
  },
  {
    id: 6,
    name: "Battery Check",
    icon: <Build />,
    duration: 60,
    color: "#FFEB3B",
    category: "electrical",
    price: "$20-$50",
  },
  {
    id: 7,
    name: "Wheel Alignment",
    icon: <DirectionsCar />,
    duration: 120,
    color: "#795548",
    category: "maintenance",
    price: "$80-$120",
  },
  {
    id: 8,
    name: "Full Service",
    icon: <CarRepair />,
    duration: 360,
    color: "#607D8B",
    category: "comprehensive",
    price: "$300-$600",
  },
];

// ========== EVENT TYPES ==========
export const EVENT_TYPES = [
  {
    id: "event",
    name: "Event",
    icon: <Event />,
    color: "#4285F4",
    defaultDuration: 60,
    description: "General event",
  },
  {
    id: "task",
    name: "Task",
    icon: <TaskAlt />,
    color: "#0F9D58",
    defaultDuration: 0,
    description: "Task with checklist",
  },
  {
    id: "meeting",
    name: "Meeting",
    icon: <VideoCall />,
    color: "#DB4437",
    defaultDuration: 30,
    description: "Meeting with agenda",
  },
  {
    id: "appointment",
    name: "Appointment",
    icon: <Person />,
    color: "#F4B400",
    defaultDuration: 45,
    description: "Appointment with clients",
  },
  {
    id: "reminder",
    name: "Reminder",
    icon: <Alarm />,
    color: "#AB47BC",
    defaultDuration: 0,
    description: "Time-based reminder",
  },
];

// ========== CALENDAR VIEWS ==========
export const CALENDAR_VIEWS = [
  { id: "day", name: "Day", icon: <ViewDay /> },
  { id: "week", name: "Week", icon: <ViewWeek /> },
  { id: "month", name: "Month", icon: <CalendarToday /> },
  { id: "agenda", name: "Agenda", icon: <ViewAgenda /> },
  { id: "schedule", name: "Schedule", icon: <Timelapse /> },
];

// ========== NOTIFICATION TYPES ==========
export const NOTIFICATION_TYPES = [
  { id: "email", name: "Email", icon: <Email /> },
  { id: "popup", name: "Browser", icon: <Notifications /> },
  { id: "push", name: "Push", icon: <Smartphone /> },
  { id: "sms", name: "SMS", icon: <Phone /> },
  { id: "desktop", name: "Desktop", icon: <Computer /> },
];

// ========== CALENDAR COLORS ==========
export const CALENDAR_COLORS = [
  { id: "1", name: "Lavender", hex: "#7986CB" },
  { id: "2", name: "Sage", hex: "#33B679" },
  { id: "3", name: "Grape", hex: "#8E24AA" },
  { id: "4", name: "Flamingo", hex: "#E67C73" },
  { id: "5", name: "Banana", hex: "#F6BF26" },
  { id: "6", name: "Tangerine", hex: "#F4511E" },
  { id: "7", name: "Peacock", hex: "#039BE5" },
  { id: "8", name: "Graphite", hex: "#616161" },
  { id: "9", name: "Blueberry", hex: "#3F51B5" },
  { id: "10", name: "Basil", hex: "#0B8043" },
  { id: "11", name: "Tomato", hex: "#D50000" },
];

// ========== TIME SLOTS ==========
export const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

// ========== DRAG AND DROP TYPES ==========
export const ItemTypes = {
  EVENT: "event",
  TASK: "task",
  APPOINTMENT: "appointment",
  REMINDER: "reminder",
};

// ========== NOTIFICATION TIMING OPTIONS ==========
export const REMINDER_TIMINGS = [
  { value: 0, label: "At time of event" },
  { value: 5, label: "5 minutes before" },
  { value: 10, label: "10 minutes before" },
  { value: 15, label: "15 minutes before" },
  { value: 30, label: "30 minutes before" },
  { value: 60, label: "1 hour before" },
  { value: 120, label: "2 hours before" },
  { value: 1440, label: "1 day before" },
  { value: 2880, label: "2 days before" },
  { value: 10080, label: "1 week before" },
];

// ========== RECURRENCE PATTERNS ==========
export const RECURRENCE_PATTERNS = [
  { id: "none", label: "Does not repeat" },
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
  { id: "weekdays", label: "Every weekday (Mon-Fri)" },
  { id: "custom", label: "Custom..." },
];

// ========== PRIORITY LEVELS ==========
export const PRIORITY_LEVELS = [
  { id: "low", label: "Low", color: "#4CAF50", icon: "⬇️" },
  { id: "medium", label: "Medium", color: "#FF9800", icon: "➡️" },
  { id: "high", label: "High", color: "#F44336", icon: "⬆️" },
  { id: "urgent", label: "Urgent", color: "#9C27B0", icon: "🚨" },
];

// ========== EVENT STATUSES ==========
export const EVENT_STATUSES = [
  { id: "scheduled", label: "Scheduled", color: "#4285F4" },
  { id: "confirmed", label: "Confirmed", color: "#0F9D58" },
  { id: "tentative", label: "Tentative", color: "#F4B400" },
  { id: "cancelled", label: "Cancelled", color: "#757575" },
  { id: "completed", label: "Completed", color: "#33B679" },
  { id: "in_progress", label: "In Progress", color: "#FF9800" },
  { id: "postponed", label: "Postponed", color: "#9C27B0" },
];

// ========== TASK STATUSES ==========
export const TASK_STATUSES = [
  { id: "not_started", label: "Not Started", color: "#757575" },
  { id: "in_progress", label: "In Progress", color: "#FF9800" },
  { id: "completed", label: "Completed", color: "#0F9D58" },
  { id: "blocked", label: "Blocked", color: "#F44336" },
  { id: "deferred", label: "Deferred", color: "#9C27B0" },
];

// ========== ATTENDEE STATUSES ==========
export const ATTENDEE_STATUSES = [
  { id: "needsAction", label: "No response", color: "#757575" },
  { id: "declined", label: "Declined", color: "#F44336" },
  { id: "tentative", label: "Maybe", color: "#FF9800" },
  { id: "accepted", label: "Accepted", color: "#0F9D58" },
];

export const getColorById = (colorId) => {
  const color =
    CALENDAR_COLORS.find((c) => c.id === colorId) || CALENDAR_COLORS[0];

  return color.hex;
};
