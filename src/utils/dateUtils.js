import {
  differenceInMinutes,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  formatDistanceToNow,
  getHours,
  getMinutes,
  isSameDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export const formatForDateTimeLocal = (date) => {
  const pad = (num) => num.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const fixDateTimeFormat = (dateTimeString, isEndTime = false) => {
  try {
    if (!dateTimeString) return new Date().toISOString();

    if (dateTimeString.includes("Z")) {
      return dateTimeString;
    }

    if (dateTimeString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
      return dateTimeString + ":00.000Z";
    }

    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    if (isEndTime) {
      return new Date(date.getTime() + 30 * 60000).toISOString();
    }

    return date.toISOString();
  } catch (error) {
    console.error("Date format error:", error);
    const now = new Date();
    if (isEndTime) {
      return new Date(now.getTime() + 60 * 60000).toISOString();
    }
    return now.toISOString();
  }
};

export const getEventsForDay = (events, day) => {
  return events.filter((item) => {
    if (!item.start?.dateTime && !item.dueDate && !item.reminderTime)
      return false;
    const itemDate = new Date(
      item.start?.dateTime || item.dueDate || item.reminderTime
    );
    return isSameDay(itemDate, day);
  });
};

export const getWeekDays = (currentDate) => {
  return eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  });
};

export const getMonthDays = (currentDate) => {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  return eachDayOfInterval({ start, end });
};

export const getTimePosition = (startTime, endTime) => {
  const startMinutes = getHours(startTime) * 60 + getMinutes(startTime);
  const durationMinutes = differenceInMinutes(endTime, startTime);
  const top = startMinutes * 1;
  const height = Math.max(durationMinutes, 30);

  return { top, height };
};

export const formatEventTime = (date, includeDate = false) => {
  if (!date) return "No time";

  const formatString = includeDate ? "MMM d, h:mm a" : "h:mm a";
  return format(new Date(date), formatString);
};

export const getTimeUntilEvent = (eventDate) => {
  return formatDistanceToNow(new Date(eventDate), { addSuffix: true });
};
