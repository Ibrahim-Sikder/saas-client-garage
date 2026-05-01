/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
/* eslint-disable no-case-declarations */
/* eslint-disable no-useless-catch */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-unused-vars */
import {
  Add as AddIcon,
  Badge,
  Call,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Close,
  Cloud,
  CloudOff,
  DarkMode,
  Delete as DeleteIcon,
  DragIndicator,
  Edit as EditIcon,
  Email,
  Event as EventIcon,
  LightMode,
  MoreVert as MoreVertIcon,
  Notifications,
  Refresh as RefreshIcon,
  Save,
  Send,
  Settings,
  Today as TodayIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  Alert,
  alpha,
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Select,
  Snackbar,
  Switch,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  differenceInHours,
  differenceInMinutes,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  formatDistanceToNow,
  getHours,
  getMinutes,
  isAfter,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";
import { CONFIG } from "../../config/calendar";
import {
  CALENDAR_COLORS,
  CALENDAR_VIEWS,
  EVENT_STATUSES,
  EVENT_TYPES,
  NOTIFICATION_TYPES,
  PRIORITY_LEVELS,
  RECURRENCE_PATTERNS,
  REMINDER_TIMINGS,
  SERVICE_TYPES,
  TASK_STATUSES,
  TIME_SLOTS,
} from "../../constant/calendar";
import {
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
  verifyTokenValidity,
} from "../../utils/auth";
import {
  fixDateTimeFormat,
  formatForDateTimeLocal,
  TaskChecklistItem,
} from "../../utils/date";
import { EmailTemplates } from "../../utils/email";
import { DroppableCalendarSlot } from "./DroppableCalendarSlot";

// ========== MAIN CALENDAR COMPONENT ==========
const EnhancedGoogleCalendar = () => {
  // ========== STATE MANAGEMENT ==========
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Auth states - initialized from saved session
  const savedSession = useMemo(() => loadAuthSession(), []);
  const [accessToken, setAccessToken] = useState(savedSession?.token || null);
  const [userProfile, setUserProfile] = useState(savedSession?.profile || null);
  const [isTokenValidated, setIsTokenValidated] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const [viewMode, setViewMode] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState(0);
  const [configHelpOpen, setConfigHelpOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState("synced");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSettings, setFilterSettings] = useState({
    showTasks: true,
    showEvents: true,
    showMeetings: true,
    showAppointments: true,
    showReminders: true,
    showCompleted: false,
    showCancelled: false,
    showPast: false,
    showFuture: true,
    minPriority: "low",
    category: "all",
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [dragDropEnabled, setDragDropEnabled] = useState(true);
  const [selectedCalendar, setSelectedCalendar] = useState("primary");
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("calendar_theme") || "light",
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    popup: true,
    sound: true,
    vibrate: false,
    desktop: false,
    mobile: true,
    web: true,
    browser: true,
  });
  const [emailSettings, setEmailSettings] = useState({
    sendEmails: true,
    sendUpdates: true,
    sendReminders: true,
    sendInvitations: true,
    sendCancellations: true,
    includeDetails: true,
    signature: "Sent from Enhanced Calendar",
  });
  const [stats, setStats] = useState({
    totalEvents: 0,
    todayEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    overdueTasks: 0,
    pendingReminders: 0,
    meetingsToday: 0,
    appointmentsToday: 0,
  });
  const [eventMenuAnchor, setEventMenuAnchor] = useState(null);
  const [selectedEventForMenu, setSelectedEventForMenu] = useState(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailContent, setEmailContent] = useState({
    to: "",
    subject: "",
    body: "",
  });

  // ========== FORM STATE ==========
  const [formData, setFormData] = useState({
    // Basic Info
    type: "event",
    summary: "",
    description: "",
    startTime: formatForDateTimeLocal(addHours(new Date(), 1)),
    endTime: formatForDateTimeLocal(addHours(new Date(), 2)),
    location: "",

    // Event Type Specific
    ...(() => {
      const baseData = {
        // For tasks
        taskStatus: "not_started",
        checklist: [],
        dueDate: formatForDateTimeLocal(addDays(new Date(), 1)),
        completionDate: "",
        subtasks: [],

        // For reminders
        reminderTime: formatForDateTimeLocal(addHours(new Date(), 1)),
        repeatReminder: "none",
        important: false,

        // For appointments
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerAddress: "",
        serviceType: "",
        serviceNotes: "",
        vehicleInfo: {
          type: "car",
          model: "",
          year: "",
          license: "",
        },

        // For meetings
        agenda: "",
        attendees: [],
        meetingType: "in_person",
        conferenceLink: "",

        // Common
        priority: "medium",
        status: "scheduled",
        category: "personal",
        tags: [],
        attachments: [],
        color: CALENDAR_COLORS[0].id,
        calendarId: "primary",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        allDay: false,
        private: false,
        busy: true,

        // Notifications
        notifications: [
          { type: "popup", minutes: 30, sent: false },
          { type: "email", minutes: 60, sent: false },
        ],

        // Recurrence
        recurrence: "none",
        recurrenceEndDate: "",
        recurrenceCount: 1,

        // Access
        guestsCanModify: false,
        guestsCanInviteOthers: false,
        guestsCanSeeOtherGuests: true,
        visibility: "default",

        // Additional
        estimatedDuration: 60,
        actualDuration: 0,
        progress: 0,
        notes: "",
        locationDetails: {
          lat: null,
          lng: null,
          address: "",
          link: "",
        },
        conferenceData: {
          type: "hangoutsMeet",
          link: "",
          phoneNumber: "",
          pin: "",
        },
      };

      // Initialize based on type
      const now = new Date();
      const tomorrow = addDays(now, 1);

      baseData.startTime = formatForDateTimeLocal(addHours(now, 1));
      baseData.endTime = formatForDateTimeLocal(addHours(now, 2));
      baseData.dueDate = formatForDateTimeLocal(tomorrow);
      baseData.reminderTime = formatForDateTimeLocal(addHours(now, 1));

      return baseData;
    })(),
  });
  const searchRef = useRef(null);
  const notificationSoundRef = useRef(null);

  // ========== MODIFIED LOGIN FUNCTION ==========
  const login = useGoogleLogin({
    scope: CONFIG.scopes,
    onSuccess: async (response) => {
      console.log("Login successful, processing...");
      setLoading(true);
      setErrorDetails(null);
      const token = response.access_token;

      try {
        // Fetch user profile
        const profile = await fetchUserProfile(token);

        // Test calendar API access to verify scopes
        await testCalendarAccess(token);

        // Save session
        saveAuthSession(token, profile);

        // Update state
        setAccessToken(token);
        setUserProfile(profile);
        setIsTokenValidated(true);

        // Fetch calendar events
        await fetchCalendarEvents(token);

        showNotification("✅ Connected to Google Calendar!", "success");
      } catch (error) {
        console.error("Login error:", error);

        // Handle scope/permission errors
        if (
          error.response?.status === 403 &&
          error.response?.data?.error?.message?.includes(
            "insufficient authentication scopes",
          )
        ) {
          setErrorDetails({
            type: "scope_error",
            message: "Insufficient Permissions",
            details: [
              "The app requires additional permissions to access Google Calendar.",
              "Please ensure you grant all requested permissions during login.",
              "Try logging out and logging in again.",
            ],
          });

          showNotification("Please grant all requested permissions", "error");
        } else {
          handleGoogleError(error);
        }

        // Clear any partial session on error
        clearAuthSession();
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      handleGoogleError(error);
    },
    flow: "implicit",
  });

  // ========== ADD TEST CALENDAR ACCESS FUNCTION ==========
  const testCalendarAccess = async (token) => {
    try {
      // Test with a simple calendar API call to verify permissions
      const response = await axios.get(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { maxResults: 1 },
        },
      );
      console.log("Calendar access verified:", response.data.items?.length > 0);
      return true;
    } catch (error) {
      console.error("Calendar access test failed:", error);
      throw error;
    }
  };

  // ========== MODIFIED INITIALIZATION ==========
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("Initializing app...");

        // Set default calendars
        const defaultCalendars = [
          {
            id: "primary",
            name: "Primary Calendar",
            color: CALENDAR_COLORS[0].id,
            selected: true,
            visible: true,
            type: "personal",
          },
          {
            id: "work",
            name: "Work Calendar",
            color: CALENDAR_COLORS[1].id,
            selected: false,
            visible: true,
            type: "work",
          },
          {
            id: "personal",
            name: "Personal Calendar",
            color: CALENDAR_COLORS[2].id,
            selected: false,
            visible: true,
            type: "personal",
          },
          {
            id: "tasks",
            name: "Tasks",
            color: CALENDAR_COLORS[3].id,
            selected: false,
            visible: true,
            type: "task",
          },
          {
            id: "reminders",
            name: "Reminders",
            color: CALENDAR_COLORS[4].id,
            selected: false,
            visible: true,
            type: "reminder",
          },
        ];
        setCalendars(defaultCalendars);

        // Load offline events
        const savedEvents = localStorage.getItem("calendar_events");
        if (savedEvents) {
          try {
            const parsedEvents = JSON.parse(savedEvents);
            setEvents(
              parsedEvents.filter((e) => e.type === "event" || !e.type),
            );
            setTasks(parsedEvents.filter((e) => e.type === "task"));
            setReminders(parsedEvents.filter((e) => e.type === "reminder"));
            setAppointments(
              parsedEvents.filter((e) => e.type === "appointment"),
            );
            console.log(
              "Loaded events from localStorage:",
              parsedEvents.length,
            );
          } catch (e) {
            console.error("Error parsing saved events:", e);
          }
        }

        // If we have a saved token, validate it
        if (accessToken && userProfile) {
          console.log("Found saved session, validating token...");
          setLoading(true);

          try {
            // Test if token has calendar access
            await testCalendarAccess(accessToken);

            console.log("Token has calendar access, fetching events...");
            // Fetch fresh calendar data
            await fetchCalendarEvents(accessToken);
            setIsTokenValidated(true);
            showNotification("Welcome back!", "success");
          } catch (error) {
            console.error("Token validation failed:", error);

            // Check if it's a scope/permission error
            if (
              error.response?.status === 403 &&
              error.response?.data?.error?.message?.includes(
                "insufficient authentication scopes",
              )
            ) {
              setErrorDetails({
                type: "scope_error",
                message: "Session Expired - Permissions Changed",
                details: [
                  "Your previous session doesn't have the required permissions.",
                  "Please login again to grant all necessary permissions.",
                ],
              });

              // Clear invalid session
              handleLogout();
              showNotification(
                "Please login again with all permissions",
                "warning",
              );
            } else if (error.response?.status === 401) {
              console.log("Token expired, clearing session...");
              handleLogout();
              showNotification("Session expired. Please login again.", "info");
            } else {
              // For other errors, keep the session but show warning
              setIsTokenValidated(true);
              showNotification(
                "Restored session with limited access",
                "warning",
              );
            }
          } finally {
            setLoading(false);
          }
        } else {
          setIsTokenValidated(true);
        }

        // Check for notifications
        checkForScheduledNotifications();

        console.log("App initialization complete");
      } catch (error) {
        console.error("Error during app initialization:", error);
        showNotification("Error initializing app", "error");
      }
    };

    initializeApp();
  }, []);

  // ========== INITIALIZATION ==========
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log("Initializing app...");

      // Set default calendars
      const defaultCalendars = [
        {
          id: "primary",
          name: "Primary Calendar",
          color: CALENDAR_COLORS[0].id,
          selected: true,
          visible: true,
          type: "personal",
        },
        {
          id: "work",
          name: "Work Calendar",
          color: CALENDAR_COLORS[1].id,
          selected: false,
          visible: true,
          type: "work",
        },
        {
          id: "personal",
          name: "Personal Calendar",
          color: CALENDAR_COLORS[2].id,
          selected: false,
          visible: true,
          type: "personal",
        },
        {
          id: "tasks",
          name: "Tasks",
          color: CALENDAR_COLORS[3].id,
          selected: false,
          visible: true,
          type: "task",
        },
        {
          id: "reminders",
          name: "Reminders",
          color: CALENDAR_COLORS[4].id,
          selected: false,
          visible: true,
          type: "reminder",
        },
      ];
      setCalendars(defaultCalendars);

      // Load offline events
      const savedEvents = localStorage.getItem("calendar_events");
      if (savedEvents) {
        try {
          const parsedEvents = JSON.parse(savedEvents);
          setEvents(parsedEvents.filter((e) => e.type === "event" || !e.type));
          setTasks(parsedEvents.filter((e) => e.type === "task"));
          setReminders(parsedEvents.filter((e) => e.type === "reminder"));
          setAppointments(parsedEvents.filter((e) => e.type === "appointment"));
          console.log("Loaded events from localStorage:", parsedEvents.length);
        } catch (e) {
          console.error("Error parsing saved events:", e);
        }
      }

      // If we have a saved token, validate it
      if (accessToken && userProfile) {
        console.log("Found saved session, validating token...");
        setLoading(true);

        try {
          const isValid = await verifyTokenValidity(accessToken);

          if (isValid) {
            console.log("Token is valid, fetching calendar events...");
            // Fetch fresh calendar data
            await fetchCalendarEvents(accessToken);
            setIsTokenValidated(true);
            showNotification("Welcome back!", "success");
          } else {
            console.log("Token is invalid, clearing session...");
            // Token is invalid, clear session
            handleLogout();
            showNotification("Session expired. Please login again.", "info");
          }
        } catch (error) {
          console.error("Error validating token:", error);
          // If validation fails, still keep the session but show warning
          setIsTokenValidated(true);
          showNotification("Restored previous session", "info");
        } finally {
          setLoading(false);
        }
      } else {
        setIsTokenValidated(true);
      }

      // Check for notifications
      checkForScheduledNotifications();

      console.log("App initialization complete");
    } catch (error) {
      console.error("Error during app initialization:", error);
      showNotification("Error initializing app", "error");
    }
  };

  // ========== ONLINE/OFFLINE HANDLING ==========
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (accessToken && isTokenValidated) {
        syncCalendar();
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [accessToken, isTokenValidated]);

  // ========== NOTIFICATION SCHEDULING ==========
  useEffect(() => {
    const notificationInterval = setInterval(() => {
      checkForScheduledNotifications();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(notificationInterval);
  }, [events, tasks, reminders, appointments]);

  const checkForScheduledNotifications = () => {
    const now = new Date();
    const allItems = [...events, ...tasks, ...reminders, ...appointments];

    allItems.forEach((item) => {
      if (!item.start?.dateTime && !item.dueDate && !item.reminderTime) return;

      const eventTime = new Date(
        item.start?.dateTime || item.dueDate || item.reminderTime,
      );
      const timeDiff = differenceInMinutes(eventTime, now);

      // Check for upcoming notifications
      if (item.notifications) {
        item.notifications.forEach((notification) => {
          if (
            !notification.sent &&
            timeDiff > 0 &&
            timeDiff <= notification.minutes
          ) {
            triggerNotification(item, notification);
            notification.sent = true;
          }
        });
      }

      // Check for overdue items
      if (timeDiff < 0 && !item.notifiedOverdue) {
        if (item.type === "task" && item.status !== "completed") {
          triggerOverdueNotification(item);
          item.notifiedOverdue = true;
        }
      }
    });
  };

  const triggerNotification = (item, notification) => {
    const notificationObj = {
      id: uuidv4(),
      type: "reminder",
      title: `${
        item.type.charAt(0).toUpperCase() + item.type.slice(1)
      } Reminder`,
      message: `${item.summary} - ${format(
        new Date(item.start?.dateTime || item.dueDate || item.reminderTime),
        "h:mm a",
      )}`,
      data: item,
      timestamp: new Date(),
      read: false,
    };

    // Add to notifications list
    setNotifications((prev) => [notificationObj, ...prev.slice(0, 99)]);

    // Show browser notification if enabled
    if (notificationSettings.browser && Notification.permission === "granted") {
      new Notification(notificationObj.title, {
        body: notificationObj.message,
        icon: "/calendar-icon.png",
        tag: item.id,
      });
    }

    // Play sound if enabled
    if (notificationSettings.sound && notificationSoundRef.current) {
      notificationSoundRef.current.currentTime = 0;
      notificationSoundRef.current.play().catch(console.error);
    }

    // Send email if enabled
    if (notification.type === "email" && emailSettings.sendReminders) {
      sendEmailNotification(item, notification);
    }

    showNotification(
      `Reminder: ${item.summary} at ${format(
        new Date(item.start?.dateTime || item.dueDate || item.reminderTime),
        "h:mm a",
      )}`,
      "info",
    );
  };

  const triggerOverdueNotification = (item) => {
    const notificationObj = {
      id: uuidv4(),
      type: "overdue",
      title: `Overdue ${item.type}`,
      message: `${item.summary} is overdue`,
      data: item,
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [notificationObj, ...prev.slice(0, 99)]);
  };

  // ========== EMAIL NOTIFICATION SYSTEM ==========
  const sendEmailNotification = async (item, notification) => {
    if (!emailSettings.sendEmails || !item.customerEmail) return;

    setIsSendingEmail(true);
    try {
      let emailData;
      switch (item.type) {
        case "event":
          emailData = EmailTemplates.eventReminder(item, notification.minutes);
          break;
        case "appointment":
          emailData = EmailTemplates.appointmentConfirmed(item, {
            name: item.customerName,
          });
          break;
        case "task":
          emailData = EmailTemplates.taskAssigned(item, item.assignedTo);
          break;
        default:
          emailData = {
            subject: `Reminder: ${item.summary}`,
            body: `<p>Reminder: ${item.summary}</p>`,
          };
      }

      showNotification("Email notification sent", "success");
    } catch (error) {
      console.error("Failed to send email:", error);
      showNotification("Failed to send email", "error");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const sendCustomEmail = async (to, subject, body) => {
    setIsSendingEmail(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showNotification("Email sent successfully", "success");
      setEmailDialogOpen(false);
    } catch (error) {
      showNotification("Failed to send email", "error");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Try to revoke token on Google's end
      if (accessToken) {
        await axios
          .post("https://oauth2.googleapis.com/revoke", null, {
            params: { token: accessToken },
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          })
          .catch((error) => {
            console.warn(
              "Error revoking token (may already be expired):",
              error,
            );
          });
      }
    } catch (error) {
      console.warn("Error during logout:", error);
    } finally {
      // Clear local session
      clearAuthSession();
      googleLogout();

      // Clear all state
      setAccessToken(null);
      setUserProfile(null);
      setIsTokenValidated(false);
      setEvents([]);
      setTasks([]);
      setReminders([]);
      setAppointments([]);
      setErrorDetails(null);

      showNotification("Logged out successfully", "info");
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      const { data } = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { alt: "json" },
        },
      );
      console.log("Fetched user profile:", data.email);
      return data;
    } catch (error) {
      console.error("Profile fetch error:", error);
      throw error;
    }
  };

  // ========== CALENDAR EVENTS MANAGEMENT ==========
  const fetchCalendarEvents = async (token, calendarId = "primary") => {
    try {
      setLoading(true);
      const now = new Date();
      const timeMin = subDays(now, 30).toISOString();
      const timeMax = addDays(now, 90).toISOString();

      const { data } = await axios.get(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: "startTime",
            maxResults: 250,
            showDeleted: false,
          },
        },
      );

      const formattedEvents = (data.items || []).map((event) => ({
        ...event,
        id: event.id,
        summary: event.summary || "No Title",
        description: event.description || "",
        start: event.start,
        end: event.end,
        location: event.location || "",
        colorId: event.colorId || "1",
        status: event.status || "confirmed",
        creator: event.creator,
        organizer: event.organizer,
        attendees: event.attendees || [],
        reminders: event.reminders,
        recurrence: event.recurrence || [],
        type: determineEventType(event),
        isGarageEvent: event.description?.includes("Trust Auto Solution"),
        serviceType: extractServiceType(event.description),
        customerInfo: extractCustomerInfo(event.description),
        calendarId: calendarId,
        created: event.created,
        updated: event.updated,
        notifications: event.notifications || [],
      }));

      // Categorize events by type
      const eventsList = formattedEvents.filter((e) => e.type === "event");
      const tasksList = formattedEvents.filter((e) => e.type === "task");
      const remindersList = formattedEvents.filter(
        (e) => e.type === "reminder",
      );
      const appointmentsList = formattedEvents.filter(
        (e) => e.type === "appointment",
      );

      setEvents(eventsList);
      setTasks(tasksList);
      setReminders(remindersList);
      setAppointments(appointmentsList);

      // Save to localStorage for offline access
      const allEvents = [
        ...eventsList,
        ...tasksList,
        ...remindersList,
        ...appointmentsList,
      ];
      localStorage.setItem("calendar_events", JSON.stringify(allEvents));

      updateStats(eventsList, tasksList, remindersList, appointmentsList);
      console.log("Fetched calendar events:", allEvents.length);
      return formattedEvents;
    } catch (error) {
      console.error("Events fetch error:", error);

      // If unauthorized, clear session
      if (error.response?.status === 401) {
        console.log("Unauthorized, clearing session...");
        handleLogout();
        showNotification("Session expired. Please login again.", "warning");
      }

      handleGoogleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const determineEventType = (event) => {
    const summary = (event.summary || "").toLowerCase();
    const description = (event.description || "").toLowerCase();

    if (summary.includes("reminder") || description.includes("reminder")) {
      return "reminder";
    }
    if (summary.includes("meeting") || description.includes("meeting")) {
      return "meeting";
    }
    if (
      summary.includes("appointment") ||
      description.includes("appointment")
    ) {
      return "appointment";
    }
    if (summary.includes("task") || description.includes("task")) {
      return "task";
    }
    return "event";
  };

  const extractServiceType = (description) => {
    if (!description) return "General";
    const service = SERVICE_TYPES.find((service) =>
      description.toLowerCase().includes(service.name.toLowerCase()),
    );
    return service?.name || "General";
  };

  const extractCustomerInfo = (description) => {
    if (!description) return {};
    const lines = description.split("\n");
    const info = {};
    lines.forEach((line) => {
      if (line.includes("Name:")) info.name = line.split("Name:")[1]?.trim();
      if (line.includes("Phone:")) info.phone = line.split("Phone:")[1]?.trim();
      if (line.includes("Email:")) info.email = line.split("Email:")[1]?.trim();
      if (line.includes("Vehicle:"))
        info.vehicle = line.split("Vehicle:")[1]?.trim();
    });
    return info;
  };

  // ========== EVENT CRUD OPERATIONS ==========
  const createEvent = async () => {
    if (!accessToken && !formData.customerEmail) {
      showNotification("Please login or provide customer email", "warning");
      return;
    }

    try {
      setLoading(true);

      // Validate form
      if (!formData.summary || !formData.startTime) {
        showNotification("Please fill required fields", "warning");
        return;
      }

      // Fix date formats
      const startDateTime = fixDateTimeFormat(formData.startTime);
      const endDateTime = formData.endTime
        ? fixDateTimeFormat(formData.endTime, true)
        : new Date(
            new Date(startDateTime).getTime() + 60 * 60000,
          ).toISOString();

      // Validate time range
      const startTime = new Date(startDateTime);
      const endTime = new Date(endDateTime);
      if (endTime <= startTime) {
        showNotification("End time must be after start time", "error");
        return;
      }

      // Build event description
      let description = formData.description || "";

      // Add type-specific details
      switch (formData.type) {
        case "task":
          description += `\n\n--- Task Details ---\n`;
          description += `Status: ${formData.taskStatus}\n`;
          description += `Priority: ${formData.priority}\n`;
          description += `Due: ${formData.dueDate}\n`;
          if (formData.checklist.length > 0) {
            description += `Checklist:\n`;
            formData.checklist.forEach((item, idx) => {
              description += `  ${idx + 1}. ${item.text} ${
                item.completed ? "[✓]" : "[ ]"
              }\n`;
            });
          }
          break;
        case "appointment":
          description += `\n\n--- Appointment Details ---\n`;
          if (formData.customerName)
            description += `Customer: ${formData.customerName}\n`;
          if (formData.customerPhone)
            description += `Phone: ${formData.customerPhone}\n`;
          if (formData.customerEmail)
            description += `Email: ${formData.customerEmail}\n`;
          if (formData.serviceType)
            description += `Service: ${formData.serviceType}\n`;
          if (formData.serviceNotes)
            description += `Notes: ${formData.serviceNotes}\n`;
          break;
        case "reminder":
          description += `\n\n--- Reminder Details ---\n`;
          description += `Important: ${formData.important ? "Yes" : "No"}\n`;
          description += `Repeat: ${formData.repeatReminder}\n`;
          break;
        case "meeting":
          description += `\n\n--- Meeting Details ---\n`;
          if (formData.agenda) description += `Agenda: ${formData.agenda}\n`;
          if (formData.conferenceLink)
            description += `Join: ${formData.conferenceLink}\n`;
          break;
      }

      description += `\nCreated via: Enhanced Calendar App`;

      // Prepare event payload
      const eventPayload = {
        summary: formData.summary,
        description: description.trim(),
        start: {
          dateTime: startDateTime,
          timeZone: formData.timeZone,
        },
        end: {
          dateTime: endDateTime,
          timeZone: formData.timeZone,
        },
        location: formData.location || "",
        colorId: formData.color,
        reminders: {
          useDefault: false,
          overrides: formData.notifications.map((notif) => ({
            method: notif.type === "email" ? "email" : "popup",
            minutes: notif.minutes,
          })),
        },
        attendees: formData.customerEmail
          ? [{ email: formData.customerEmail }]
          : [],
        guestsCanModify: formData.guestsCanModify,
        guestsCanInviteOthers: formData.guestsCanInviteOthers,
        guestsCanSeeOtherGuests: formData.guestsCanSeeOtherGuests,
        visibility: formData.private ? "private" : "default",
        transparency: formData.busy ? "opaque" : "transparent",
      };

      let response;
      if (accessToken) {
        // Create in Google Calendar
        response = await axios.post(
          `https://www.googleapis.com/calendar/v3/calendars/${formData.calendarId}/events`,
          eventPayload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          },
        );
      } else {
        // Create local event
        response = {
          data: {
            ...eventPayload,
            id: uuidv4(),
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            status: "confirmed",
            creator: { email: "local@user.com" },
            organizer: { email: "local@user.com" },
          },
        };
      }

      // Create local event object
      const newEvent = {
        ...response.data,
        type: formData.type,
        isGarageEvent: formData.type === "appointment",
        serviceType: formData.serviceType,
        customerInfo: {
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail,
        },
        taskStatus: formData.taskStatus,
        checklist: formData.checklist,
        dueDate: formData.dueDate,
        priority: formData.priority,
        notifications: formData.notifications,
        important: formData.important,
        repeatReminder: formData.repeatReminder,
      };

      // Update appropriate state
      switch (formData.type) {
        case "task":
          setTasks((prev) => [newEvent, ...prev]);
          break;
        case "reminder":
          setReminders((prev) => [newEvent, ...prev]);
          break;
        case "appointment":
          setAppointments((prev) => [newEvent, ...prev]);
          break;
        default:
          setEvents((prev) => [newEvent, ...prev]);
      }

      // Save to localStorage
      const allEvents = [...events, ...tasks, ...reminders, ...appointments];
      localStorage.setItem(
        "calendar_events",
        JSON.stringify([newEvent, ...allEvents]),
      );

      // Send notifications
      if (formData.customerEmail && emailSettings.sendEmails) {
        sendEmailNotification(newEvent, { type: "email", minutes: 0 });
      }

      // Show success
      setOpenDialog(false);
      resetForm();
      showNotification(`${formData.type} created successfully!`, "success");

      // Update stats
      updateStats([...events, newEvent], tasks, reminders, appointments);
    } catch (error) {
      console.error("Event creation error:", error);
      handleGoogleError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async () => {
    if (!selectedEvent) return;

    try {
      setLoading(true);

      // Fix date formats
      const startDateTime = fixDateTimeFormat(formData.startTime);
      const endDateTime = formData.endTime
        ? fixDateTimeFormat(formData.endTime, true)
        : new Date(
            new Date(startDateTime).getTime() + 60 * 60000,
          ).toISOString();

      const eventUpdate = {
        ...selectedEvent,
        summary: formData.summary,
        description: formData.description,
        start: {
          dateTime: startDateTime,
          timeZone: formData.timeZone,
        },
        end: {
          dateTime: endDateTime,
          timeZone: formData.timeZone,
        },
        location: formData.location,
        colorId: formData.color,
      };

      if (accessToken) {
        await axios.put(
          `https://www.googleapis.com/calendar/v3/calendars/${
            selectedEvent.calendarId || "primary"
          }/events/${selectedEvent.id}`,
          eventUpdate,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          },
        );
        await fetchCalendarEvents(
          accessToken,
          selectedEvent.calendarId || "primary",
        );
      } else {
        // Update locally
        const updateState = (state, setState) => {
          const updated = state.map((item) =>
            item.id === selectedEvent.id ? { ...item, ...eventUpdate } : item,
          );
          setState(updated);
          return updated;
        };

        switch (selectedEvent.type) {
          case "task":
            updateState(tasks, setTasks);
            break;
          case "reminder":
            updateState(reminders, setReminders);
            break;
          case "appointment":
            updateState(appointments, setAppointments);
            break;
          default:
            updateState(events, setEvents);
        }
      }

      // Send update email if enabled
      if (emailSettings.sendUpdates && selectedEvent.customerEmail) {
        sendEmailNotification(selectedEvent, { type: "email", minutes: 0 });
      }

      setOpenDialog(false);
      resetForm();
      showNotification("Event updated successfully!", "success");
    } catch (error) {
      console.error("Update error:", error);
      handleGoogleError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId, calendarId = "primary") => {
    try {
      if (accessToken) {
        await axios.delete(
          `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
      }

      // Remove from all states
      const removeFromState = (state) =>
        state.filter((event) => event.id !== eventId);

      setEvents(removeFromState);
      setTasks(removeFromState);
      setReminders(removeFromState);
      setAppointments(removeFromState);

      // Update localStorage
      const allEvents = [...events, ...tasks, ...reminders, ...appointments];
      localStorage.setItem(
        "calendar_events",
        JSON.stringify(allEvents.filter((e) => e.id !== eventId)),
      );

      // Send cancellation email if enabled
      const event = allEvents.find((e) => e.id === eventId);
      if (event && emailSettings.sendCancellations && event.customerEmail) {
        // Send cancellation email
      }

      showNotification("Event deleted successfully!", "success");
    } catch (error) {
      console.error("Delete error:", error);
      handleGoogleError(error);
    }
  };

  // ========== SYNC AND DRAG-DROP ==========
  const syncCalendar = async () => {
    if (!accessToken || !isTokenValidated) return;

    try {
      setSyncStatus("syncing");
      setLoading(true);

      await fetchCalendarEvents(accessToken, "primary");

      setSyncStatus("synced");
      showNotification("Calendar synced successfully!", "success");
    } catch (error) {
      setSyncStatus("error");
      handleGoogleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (item, dropLocation) => {
    try {
      setLoading(true);

      const { date, time } = dropLocation;
      const [hours, minutes] = time.split(":").map(Number);
      const newStartTime = new Date(date);
      newStartTime.setHours(hours, minutes, 0, 0);
      const newEndTime = new Date(newStartTime.getTime() + 60 * 60000);

      const eventToUpdate = [
        ...events,
        ...tasks,
        ...reminders,
        ...appointments,
      ].find((e) => e.id === item.id);

      if (!eventToUpdate) return;

      const updatedEvent = {
        ...eventToUpdate,
        start: {
          dateTime: newStartTime.toISOString(),
          timeZone: eventToUpdate.start.timeZone || formData.timeZone,
        },
        end: {
          dateTime: newEndTime.toISOString(),
          timeZone: eventToUpdate.end.timeZone || formData.timeZone,
        },
      };

      if (accessToken) {
        await axios.put(
          `https://www.googleapis.com/calendar/v3/calendars/${
            eventToUpdate.calendarId || "primary"
          }/events/${eventToUpdate.id}`,
          updatedEvent,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          },
        );
        await fetchCalendarEvents(
          accessToken,
          eventToUpdate.calendarId || "primary",
        );
      } else {
        // Update locally
        const updateState = (state, setState) => {
          const updated = state.map((item) =>
            item.id === eventToUpdate.id ? { ...item, ...updatedEvent } : item,
          );
          setState(updated);
        };

        switch (eventToUpdate.type) {
          case "task":
            updateState(tasks, setTasks);
            break;
          case "reminder":
            updateState(reminders, setReminders);
            break;
          case "appointment":
            updateState(appointments, setAppointments);
            break;
          default:
            updateState(events, setEvents);
        }
      }

      showNotification("Event moved successfully!", "success");
    } catch (error) {
      console.error("Drag and drop error:", error);
      handleGoogleError(error);
    } finally {
      setLoading(false);
    }
  };

  // ========== STATISTICS ==========
  const updateStats = (
    eventsList,
    tasksList,
    remindersList,
    appointmentsList,
  ) => {
    const now = new Date();
    const today = format(now, "yyyy-MM-dd");

    const allItems = [
      ...eventsList,
      ...tasksList,
      ...remindersList,
      ...appointmentsList,
    ];
    const todayItems = allItems.filter((item) => {
      const itemDate =
        item.start?.dateTime || item.dueDate || item.reminderTime;
      return itemDate && format(new Date(itemDate), "yyyy-MM-dd") === today;
    });

    const upcomingItems = allItems.filter((item) => {
      const itemDate =
        item.start?.dateTime || item.dueDate || item.reminderTime;
      return itemDate && new Date(itemDate) > now;
    });

    const completedTasks = tasksList.filter(
      (task) => task.taskStatus === "completed",
    );
    const overdueTasks = tasksList.filter((task) => {
      if (task.taskStatus === "completed") return false;
      const dueDate = task.dueDate ? new Date(task.dueDate) : null;
      return dueDate && dueDate < now;
    });

    setStats({
      totalEvents: allItems.length,
      todayEvents: todayItems.length,
      upcomingEvents: upcomingItems.length,
      completedEvents: eventsList.filter((e) => e.status === "completed")
        .length,
      overdueTasks: overdueTasks.length,
      pendingReminders: remindersList.filter((r) => !r.notified).length,
      meetingsToday: eventsList.filter(
        (e) =>
          e.type === "meeting" &&
          e.start?.dateTime &&
          format(new Date(e.start.dateTime), "yyyy-MM-dd") === today,
      ).length,
      appointmentsToday: appointmentsList.filter(
        (a) =>
          a.start?.dateTime &&
          format(new Date(a.start.dateTime), "yyyy-MM-dd") === today,
      ).length,
    });
  };

  // ========== QUICK ACTIONS ==========
  const quickCreate = (type) => {
    const now = new Date();
    const startTime = addHours(now, 1);
    const endTime = addHours(startTime, 1);

    let template = {
      type: type,
      summary: "",
      description: "",
      startTime: formatForDateTimeLocal(startTime),
      endTime: formatForDateTimeLocal(endTime),
      dueDate: formatForDateTimeLocal(addDays(now, 1)),
      reminderTime: formatForDateTimeLocal(addHours(now, 1)),
      color:
        CALENDAR_COLORS[Math.floor(Math.random() * CALENDAR_COLORS.length)].id,
    };

    switch (type) {
      case "meeting":
        template.summary = "Team Meeting";
        template.description = "Weekly team sync";
        template.agenda =
          "1. Project updates\n2. Roadmap discussion\n3. Action items";
        break;
      case "task":
        template.summary = "Complete project report";
        template.description = "Finish the quarterly project report";
        template.taskStatus = "not_started";
        template.checklist = [
          { id: uuidv4(), text: "Gather data", completed: false },
          { id: uuidv4(), text: "Write draft", completed: false },
          { id: uuidv4(), text: "Review with team", completed: false },
        ];
        break;
      case "event":
        template.summary = "Company Event";
        template.description = "Annual company gathering";
        break;
      case "appointment":
        template.summary = "Client Meeting";
        template.description = "Project kickoff meeting";
        template.customerName = "John Doe";
        template.customerEmail = "john@example.com";
        template.customerPhone = "+1234567890";
        template.serviceType = "Consultation";
        break;
      case "reminder":
        template.summary = "Submit timesheet";
        template.description = "Weekly timesheet submission";
        template.important = true;
        template.repeatReminder = "weekly";
        break;
    }

    setFormData((prev) => ({ ...prev, ...template }));
    setOpenDialog(true);
  };

  // ========== FORM MANAGEMENT ==========
  const resetForm = () => {
    const now = new Date();
    const startTime = addHours(now, 1);
    const endTime = addHours(startTime, 1);

    setFormData({
      type: "event",
      summary: "",
      description: "",
      startTime: formatForDateTimeLocal(startTime),
      endTime: formatForDateTimeLocal(endTime),
      location: "",

      // Task specific
      taskStatus: "not_started",
      checklist: [],
      dueDate: formatForDateTimeLocal(addDays(now, 1)),
      completionDate: "",
      subtasks: [],

      // Reminder specific
      reminderTime: formatForDateTimeLocal(addHours(now, 1)),
      repeatReminder: "none",
      important: false,

      // Appointment specific
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
      serviceType: "",
      serviceNotes: "",
      vehicleInfo: {
        type: "car",
        model: "",
        year: "",
        license: "",
      },

      // Meeting specific
      agenda: "",
      attendees: [],
      meetingType: "in_person",
      conferenceLink: "",

      // Common
      priority: "medium",
      status: "scheduled",
      category: "personal",
      tags: [],
      attachments: [],
      color: CALENDAR_COLORS[0].id,
      calendarId: "primary",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      allDay: false,
      private: false,
      busy: true,

      // Notifications
      notifications: [
        { type: "popup", minutes: 30, sent: false },
        { type: "email", minutes: 60, sent: false },
      ],

      // Recurrence
      recurrence: "none",
      recurrenceEndDate: "",
      recurrenceCount: 1,

      // Access
      guestsCanModify: false,
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: true,
      visibility: "default",

      // Additional
      estimatedDuration: 60,
      actualDuration: 0,
      progress: 0,
      notes: "",
      locationDetails: {
        lat: null,
        lng: null,
        address: "",
        link: "",
      },
      conferenceData: {
        type: "hangoutsMeet",
        link: "",
        phoneNumber: "",
        pin: "",
      },
    });
    setSelectedEvent(null);
  };

  const showNotification = (message, severity = "info") => {
    setNotification({ open: true, message, severity });
  };

  const handleOpenDialog = (event = null, type = "event") => {
    if (event) {
      setSelectedEvent(event);
      const customerInfo = extractCustomerInfo(event.description);

      const formatISOToInput = (isoDate) => {
        try {
          const date = new Date(isoDate);
          return formatForDateTimeLocal(date);
        } catch {
          return "";
        }
      };

      setFormData((prev) => ({
        ...prev,
        type: event.type || "event",
        summary: event.summary || "",
        description: event.description || "",
        startTime: event.start?.dateTime
          ? formatISOToInput(event.start.dateTime)
          : "",
        endTime: event.end?.dateTime
          ? formatISOToInput(event.end.dateTime)
          : "",
        location: event.location || "",
        customerEmail: customerInfo.email || "",
        customerPhone: customerInfo.phone || "",
        customerName: customerInfo.name || "",
        serviceType: extractServiceType(event.description),
        color: event.colorId || CALENDAR_COLORS[0].id,
        calendarId: event.calendarId || "primary",
        status: event.status || "scheduled",
        priority: event.priority || "medium",
        taskStatus: event.taskStatus || "not_started",
        checklist: event.checklist || [],
        dueDate: event.dueDate ? formatISOToInput(event.dueDate) : "",
        important: event.important || false,
        repeatReminder: event.repeatReminder || "none",
        notifications: event.notifications || [
          { type: "popup", minutes: 30, sent: false },
          { type: "email", minutes: 60, sent: false },
        ],
      }));
    } else {
      const now = new Date();
      const startTime = addHours(now, 1);
      const endTime = addHours(startTime, 1);

      resetForm();
      setFormData((prev) => ({
        ...prev,
        type: type,
        color:
          CALENDAR_COLORS[Math.floor(Math.random() * CALENDAR_COLORS.length)]
            .id,
      }));
    }
    setOpenDialog(true);
  };

  // ========== EVENT HANDLERS ==========
  const handleGoogleError = (error) => {
    console.error("Google API Error:", error);
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          setErrorDetails({
            type: "bad_request",
            message: "Invalid request data format",
            details: [
              "Check date/time format",
              "Ensure end time is after start time",
              data.error?.message || "Bad Request",
            ],
          });
          break;
        case 401:
          setErrorDetails({
            type: "unauthorized",
            message: "Session expired",
            details: "Please login again",
          });
          handleLogout();
          break;
        case 403:
          const errorMsg = data.error?.message || "";
          if (errorMsg.includes("has not been used in project")) {
            setErrorDetails({
              type: "config_required",
              message: "Configuration Required",
              details: [
                "Please enable Calendar API in Google Cloud Console",
                "Add your email as a test user",
              ],
            });
            setConfigHelpOpen(true);
          }
          break;
        default:
          setErrorDetails({
            type: "server_error",
            message: "Server Error",
            details: `Status: ${status}`,
          });
      }
    }
    showNotification("Operation failed. Check error details.", "error");
  };

  const clearError = () => {
    setErrorDetails(null);
  };

  const goToToday = () => setCurrentDate(new Date());
  const goToPrevious = () => {
    if (viewMode === "week") setCurrentDate((prev) => subWeeks(prev, 1));
    else if (viewMode === "month") setCurrentDate((prev) => subMonths(prev, 1));
    else setCurrentDate((prev) => subDays(prev, 1));
  };
  const goToNext = () => {
    if (viewMode === "week") setCurrentDate((prev) => addWeeks(prev, 1));
    else if (viewMode === "month") setCurrentDate((prev) => addMonths(prev, 1));
    else setCurrentDate((prev) => addDays(prev, 1));
  };

  const getEventsForDay = (day) => {
    const allItems = [...events, ...tasks, ...reminders, ...appointments];
    return allItems.filter((item) => {
      if (!item.start?.dateTime && !item.dueDate && !item.reminderTime)
        return false;
      const itemDate = new Date(
        item.start?.dateTime || item.dueDate || item.reminderTime,
      );
      return isSameDay(itemDate, day);
    });
  };

  const getColorById = (colorId) => {
    const color =
      CALENDAR_COLORS.find((c) => c.id === colorId) || CALENDAR_COLORS[0];
    return color.hex;
  };

  // ========== FILTERING ==========
  const filteredEvents = useMemo(() => {
    const allItems = [...events, ...tasks, ...reminders, ...appointments];
    let filtered = [...allItems];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.summary || "").toLowerCase().includes(query) ||
          (item.description || "").toLowerCase().includes(query) ||
          (item.location || "").toLowerCase().includes(query) ||
          (item.customerInfo?.name || "").toLowerCase().includes(query) ||
          (item.serviceType || "").toLowerCase().includes(query),
      );
    }

    // Apply type filters
    filtered = filtered.filter((item) => {
      const type = item.type || "event";
      switch (type) {
        case "task":
          return filterSettings.showTasks;
        case "event":
          return filterSettings.showEvents;
        case "meeting":
          return filterSettings.showMeetings;
        case "appointment":
          return filterSettings.showAppointments;
        case "reminder":
          return filterSettings.showReminders;
        default:
          return true;
      }
    });

    // Apply status filters
    if (!filterSettings.showCompleted) {
      filtered = filtered.filter(
        (item) =>
          item.status !== "completed" && item.taskStatus !== "completed",
      );
    }

    if (!filterSettings.showCancelled) {
      filtered = filtered.filter((item) => item.status !== "cancelled");
    }

    if (!filterSettings.showPast) {
      const now = new Date();
      filtered = filtered.filter((item) => {
        const itemDate = new Date(
          item.start?.dateTime || item.dueDate || item.reminderTime,
        );
        return isAfter(itemDate, now) || isSameDay(itemDate, now);
      });
    }

    return filtered;
  }, [events, tasks, reminders, appointments, searchQuery, filterSettings]);

  // ========== THEME AND UI ==========
  const toggleTheme = () => {
    const newTheme = themeMode === "light" ? "dark" : "light";
    setThemeMode(newTheme);
    localStorage.setItem("calendar_theme", newTheme);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getUnreadNotificationCount = () => {
    return notifications.filter((n) => !n.read).length;
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    const allItems = [...events, ...tasks, ...reminders, ...appointments];
    return allItems
      .filter((item) => {
        if (!item.start?.dateTime && !item.dueDate && !item.reminderTime)
          return false;
        const itemTime = new Date(
          item.start?.dateTime || item.dueDate || item.reminderTime,
        );
        return itemTime > now && differenceInHours(itemTime, now) <= 24;
      })
      .sort((a, b) => {
        const aTime = new Date(
          a.start?.dateTime || a.dueDate || a.reminderTime,
        );
        const bTime = new Date(
          b.start?.dateTime || b.dueDate || b.reminderTime,
        );
        return aTime - bTime;
      })
      .slice(0, 5);
  };

  // ========== RENDER CALENDAR VIEWS ==========
  const renderCalendarView = () => {
    switch (viewMode) {
      case "day":
        return renderDayView();
      case "week":
        return renderWeekView();
      case "month":
        return renderMonthView();
      case "agenda":
        return renderAgendaView();
      case "schedule":
        return renderScheduleView();
      default:
        return renderWeekView();
    }
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDay(currentDate);

    return (
      <Box sx={{ height: "calc(100vh - 300px)", overflow: "auto" }}>
        <Grid container>
          <Grid item xs={2}>
            <Box sx={{ borderRight: 1, borderColor: "divider" }}>
              {TIME_SLOTS.map((time) => (
                <Box
                  key={time}
                  sx={{
                    height: 60,
                    borderBottom: 1,
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Typography variant="caption">{time}</Typography>
                  {dragDropEnabled && (
                    <DroppableCalendarSlot
                      date={format(currentDate, "yyyy-MM-dd")}
                      time={time}
                      onDrop={handleDrop}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={10}>
            <Box sx={{ position: "relative", height: "100%" }}>
              {TIME_SLOTS.map((time) => (
                <Box
                  key={time}
                  sx={{
                    height: 60,
                    borderBottom: 1,
                    borderColor: "divider",
                    position: "relative",
                  }}
                >
                  {dragDropEnabled && (
                    <DroppableCalendarSlot
                      date={format(currentDate, "yyyy-MM-dd")}
                      time={time}
                      onDrop={handleDrop}
                    />
                  )}
                </Box>
              ))}

              {dayEvents.map((event) => {
                const startTime = event.start?.dateTime
                  ? new Date(event.start.dateTime)
                  : new Date(event.dueDate || event.reminderTime || new Date());
                const endTime = event.end?.dateTime
                  ? new Date(event.end.dateTime)
                  : new Date(startTime.getTime() + 60 * 60000);

                const startMinutes =
                  getHours(startTime) * 60 + getMinutes(startTime);
                const durationMinutes = differenceInMinutes(endTime, startTime);
                const top = startMinutes * 1;
                const height = Math.max(durationMinutes, 30);

                return (
                  <Box
                    key={event.id}
                    sx={{
                      position: "absolute",
                      top: `${top}px`,
                      left: "10px",
                      right: "10px",
                      height: `${height}px`,
                      bgcolor:
                        getColorById(event.colorId) ||
                        event.colorHex ||
                        "#4285F4",
                      color: "white",
                      borderRadius: 1,
                      p: 1,
                      overflow: "hidden",
                      cursor: "pointer",
                      border: "1px solid rgba(255,255,255,0.3)",
                      "&:hover": {
                        opacity: 0.9,
                        boxShadow: 2,
                      },
                    }}
                    onClick={() => handleOpenDialog(event)}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      {EVENT_TYPES.find((t) => t.id === event.type)?.icon || (
                        <EventIcon sx={{ fontSize: 14 }} />
                      )}
                      <Typography
                        variant="caption"
                        noWrap
                        sx={{ fontWeight: "bold", flex: 1 }}
                      >
                        {format(startTime, "h:mm a")} - {event.summary}
                      </Typography>
                      {event.priority === "high" && (
                        <span style={{ fontSize: "10px" }}>⚠️</span>
                      )}
                    </Box>
                    {event.location && (
                      <Typography
                        variant="caption"
                        sx={{ display: "block", opacity: 0.8 }}
                      >
                        {event.location}
                      </Typography>
                    )}
                    {dragDropEnabled && (
                      <DragIndicator
                        sx={{
                          position: "absolute",
                          right: 4,
                          top: 4,
                          fontSize: 16,
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderWeekView = () => {
    const weekDays = eachDayOfInterval({
      start: startOfWeek(currentDate),
      end: endOfWeek(currentDate),
    });

    return (
      <Grid container spacing={1}>
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          return (
            <Grid item xs key={index}>
              <Card
                sx={{
                  height: "600px",
                  overflow: "auto",
                  bgcolor: isSameDay(day, new Date()) ? "primary.50" : "white",
                }}
              >
                <CardContent sx={{ p: 1 }}>
                  <Typography
                    variant="subtitle2"
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      color: isSameDay(day, new Date())
                        ? "primary.main"
                        : "inherit",
                    }}
                  >
                    {format(day, "EEE")}
                  </Typography>
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{
                      color: isSameDay(day, new Date())
                        ? "primary.main"
                        : "text.secondary",
                    }}
                  >
                    {format(day, "d")}
                  </Typography>
                  <Divider sx={{ my: 1 }} />

                  {dayEvents.length > 0 ? (
                    <Box>
                      {dayEvents.map((event) => (
                        <Card
                          key={event.id}
                          sx={{
                            p: 1,
                            mb: 1,
                            bgcolor:
                              getColorById(event.colorId) ||
                              event.colorHex ||
                              "#4285F4",
                            color: "white",
                            cursor: "pointer",
                            border: "1px solid rgba(255,255,255,0.3)",
                            "&:hover": {
                              opacity: 0.9,
                              boxShadow: 2,
                            },
                          }}
                          onClick={() => handleOpenDialog(event)}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              {EVENT_TYPES.find((t) => t.id === event.type)
                                ?.icon || <EventIcon sx={{ fontSize: 14 }} />}
                              <Typography
                                variant="caption"
                                sx={{ fontWeight: "bold" }}
                              >
                                {format(
                                  new Date(
                                    event.start?.dateTime ||
                                      event.dueDate ||
                                      event.reminderTime,
                                  ),
                                  "h:mm a",
                                )}
                              </Typography>
                            </Box>
                            {dragDropEnabled && (
                              <DragIndicator sx={{ fontSize: 16 }} />
                            )}
                          </Box>
                          <Typography variant="body2" fontWeight="bold" noWrap>
                            {event.summary}
                          </Typography>
                          <Chip
                            size="small"
                            label={event.type || "event"}
                            sx={{
                              mt: 0.5,
                              color: "white",
                              bgcolor: "rgba(255,255,255,0.2)",
                            }}
                          />
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                      sx={{ mt: 2 }}
                    >
                      No events
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const renderMonthView = () => {
    const monthDays = useMemo(() => {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return eachDayOfInterval({ start, end });
    }, [currentDate]);

    const weeks = [];
    for (let i = 0; i < monthDays.length; i += 7) {
      weeks.push(monthDays.slice(i, i + 7));
    }

    return (
      <Box>
        <Grid container spacing={1}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Grid item xs key={day}>
              <Typography align="center" fontWeight="bold">
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {weeks.map((week, weekIndex) => (
          <Grid container spacing={1} key={weekIndex} sx={{ mb: 1 }}>
            {week.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(day);
              return (
                <Grid item xs key={dayIndex}>
                  <Card
                    sx={{
                      height: 120,
                      overflow: "auto",
                      bgcolor: isSameDay(day, new Date())
                        ? "primary.50"
                        : !isSameMonth(day, currentDate)
                          ? "grey.50"
                          : "white",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                    onClick={() => {
                      setCurrentDate(day);
                      setViewMode("day");
                    }}
                  >
                    <CardContent sx={{ p: 1 }}>
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          color: isSameDay(day, new Date())
                            ? "primary.main"
                            : !isSameMonth(day, currentDate)
                              ? "grey.400"
                              : "inherit",
                        }}
                      >
                        {format(day, "d")}
                      </Typography>

                      {dayEvents.slice(0, 3).map((event) => (
                        <Box
                          key={event.id}
                          sx={{
                            bgcolor:
                              getColorById(event.colorId) ||
                              event.colorHex ||
                              "#4285F4",
                            color: "white",
                            borderRadius: 1,
                            p: 0.5,
                            mb: 0.5,
                            fontSize: "10px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            border: "1px solid rgba(255,255,255,0.3)",
                          }}
                        >
                          {format(
                            new Date(
                              event.start?.dateTime ||
                                event.dueDate ||
                                event.reminderTime,
                            ),
                            "h:mm",
                          )}{" "}
                          - {event.summary.substring(0, 15)}
                          {event.summary.length > 15 ? "..." : ""}
                        </Box>
                      ))}

                      {dayEvents.length > 3 && (
                        <Typography variant="caption" color="textSecondary">
                          +{dayEvents.length - 3} more
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ))}
      </Box>
    );
  };

  const renderAgendaView = () => {
    const groupedEvents = {};
    filteredEvents.forEach((event) => {
      const date = event.start?.dateTime
        ? format(new Date(event.start.dateTime), "yyyy-MM-dd")
        : event.dueDate
          ? format(new Date(event.dueDate), "yyyy-MM-dd")
          : event.reminderTime
            ? format(new Date(event.reminderTime), "yyyy-MM-dd")
            : "unscheduled";
      if (!groupedEvents[date]) groupedEvents[date] = [];
      groupedEvents[date].push(event);
    });

    return (
      <Box>
        {Object.entries(groupedEvents)
          .sort()
          .map(([date, dateEvents]) => (
            <Box key={date} sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {date === "unscheduled"
                  ? "Unscheduled"
                  : format(new Date(date), "EEEE, MMMM d, yyyy")}
              </Typography>
              <Grid container spacing={2}>
                {dateEvents.map((event) => (
                  <Grid item xs={12} key={event.id}>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              {EVENT_TYPES.find((t) => t.id === event.type)
                                ?.icon || <EventIcon />}
                              <Typography variant="h6">
                                {event.summary}
                              </Typography>
                              <Chip
                                size="small"
                                label={event.type || "event"}
                                color="primary"
                                sx={{ ml: 1 }}
                              />
                              {event.priority === "high" && (
                                <Chip
                                  size="small"
                                  label="High Priority"
                                  color="error"
                                />
                              )}
                            </Box>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              gutterBottom
                            >
                              {event.start?.dateTime
                                ? format(
                                    new Date(event.start.dateTime),
                                    "h:mm a",
                                  )
                                : event.dueDate
                                  ? `Due: ${format(
                                      new Date(event.dueDate),
                                      "h:mm a",
                                    )}`
                                  : event.reminderTime
                                    ? `Reminder: ${format(
                                        new Date(event.reminderTime),
                                        "h:mm a",
                                      )}`
                                    : "No time specified"}{" "}
                              • {event.location || "No location"}
                            </Typography>
                            {event.description && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {event.description.substring(0, 200)}
                                {event.description.length > 200 ? "..." : ""}
                              </Typography>
                            )}
                          </Box>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              setEventMenuAnchor(e.currentTarget);
                              setSelectedEventForMenu(event);
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
      </Box>
    );
  };

  const renderScheduleView = () => {
    const now = new Date();
    const upcomingEvents = filteredEvents
      .filter((item) => {
        const itemDate = new Date(
          item.start?.dateTime || item.dueDate || item.reminderTime,
        );
        return itemDate && itemDate >= now;
      })
      .sort((a, b) => {
        const aTime = new Date(
          a.start?.dateTime || a.dueDate || a.reminderTime,
        );
        const bTime = new Date(
          b.start?.dateTime || b.dueDate || b.reminderTime,
        );
        return aTime - bTime;
      });

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Upcoming Schedule ({upcomingEvents.length})
        </Typography>
        <List>
          {upcomingEvents.slice(0, 20).map((event) => {
            const eventDate = new Date(
              event.start?.dateTime || event.dueDate || event.reminderTime,
            );
            const timeUntil = formatDistanceToNow(eventDate, {
              addSuffix: true,
            });

            return (
              <ListItem
                key={event.id}
                sx={{
                  mb: 1,
                  borderLeft: `4px solid ${
                    getColorById(event.colorId) || event.colorHex || "#4285F4"
                  }`,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleOpenDialog(event)}
                  >
                    <EditIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor:
                        getColorById(event.colorId) ||
                        event.colorHex ||
                        "#4285F4",
                    }}
                  >
                    {EVENT_TYPES.find((t) => t.id === event.type)?.icon || (
                      <EventIcon />
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body1" fontWeight="bold">
                        {event.summary}
                      </Typography>
                      {event.priority === "high" && (
                        <Chip size="small" label="High" color="error" />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary">
                        {format(eventDate, "PPPPp")}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {timeUntil} • {event.location || "No location"} •{" "}
                        {event.type}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    );
  };

  // ========== DIALOG COMPONENTS ==========
  const ConfigHelpDialog = () => (
    <Dialog
      open={configHelpOpen}
      onClose={() => setConfigHelpOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Settings /> Google Calendar API Configuration
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="h6">Required Configuration Steps</Typography>
          </Alert>
          {/* ... rest of config help content ... */}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfigHelpOpen(false)}>Close</Button>
        <Button onClick={login} variant="contained">
          Try Login Again
        </Button>
      </DialogActions>
    </Dialog>
  );

  const SettingsDialog = () => (
    <Dialog
      open={settingsOpen}
      onClose={() => setSettingsOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Settings /> Calendar Settings
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab label="General" />
          <Tab label="Notifications" />
          <Tab label="Email" />
          <Tab label="Calendars" />
        </Tabs>

        {activeTab === 0 && (
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Appearance
            </Typography>
            <FormControlLabel
              control={
                <Switch checked={themeMode === "dark"} onChange={toggleTheme} />
              }
              label="Dark Mode"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={sidebarOpen}
                  onChange={() => setSidebarOpen(!sidebarOpen)}
                />
              }
              label="Show Sidebar"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={dragDropEnabled}
                  onChange={() => setDragDropEnabled(!dragDropEnabled)}
                />
              }
              label="Enable Drag & Drop"
            />
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(notificationSettings).map(([key, value]) => (
                <Grid item xs={6} key={key}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [key]: e.target.checked,
                          })
                        }
                      />
                    }
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                  />
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Default Reminders
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Default Reminder Time</InputLabel>
              <Select
                value={emailSettings.defaultReminder || 30}
                onChange={(e) =>
                  setEmailSettings({
                    ...emailSettings,
                    defaultReminder: e.target.value,
                  })
                }
                label="Default Reminder Time"
              >
                {REMINDER_TIMINGS.map((timing) => (
                  <MenuItem key={timing.value} value={timing.value}>
                    {timing.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Email Settings
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(emailSettings).map(([key, value]) => {
                if (typeof value === "boolean") {
                  return (
                    <Grid item xs={12} key={key}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={value}
                            onChange={(e) =>
                              setEmailSettings({
                                ...emailSettings,
                                [key]: e.target.checked,
                              })
                            }
                          />
                        }
                        label={key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^\w/, (c) => c.toUpperCase())}
                      />
                    </Grid>
                  );
                }
                return null;
              })}
            </Grid>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Email Signature"
              value={emailSettings.signature}
              onChange={(e) =>
                setEmailSettings({
                  ...emailSettings,
                  signature: e.target.value,
                })
              }
              sx={{ mt: 3 }}
            />
          </Box>
        )}

        {activeTab === 3 && (
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Manage Calendars
            </Typography>
            <List>
              {calendars.map((calendar) => (
                <ListItem key={calendar.id} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: getColorById(calendar.color),
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={calendar.name} />
                    <Switch
                      checked={calendar.visible}
                      onChange={() => {
                        setCalendars(
                          calendars.map((c) =>
                            c.id === calendar.id
                              ? { ...c, visible: !c.visible }
                              : c,
                          ),
                        );
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        <Button onClick={() => setSettingsOpen(false)} variant="contained">
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );

  const EmailDialog = () => (
    <Dialog
      open={emailDialogOpen}
      onClose={() => setEmailDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Send Email</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="To"
            value={emailContent.to}
            onChange={(e) =>
              setEmailContent({ ...emailContent, to: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Subject"
            value={emailContent.subject}
            onChange={(e) =>
              setEmailContent({ ...emailContent, subject: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Message"
            value={emailContent.body}
            onChange={(e) =>
              setEmailContent({ ...emailContent, body: e.target.value })
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
        <Button
          onClick={() =>
            sendCustomEmail(
              emailContent.to,
              emailContent.subject,
              emailContent.body,
            )
          }
          variant="contained"
          disabled={isSendingEmail}
          startIcon={isSendingEmail ? <CircularProgress size={20} /> : <Send />}
        >
          {isSendingEmail ? "Sending..." : "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const QuickAddDialog = () => (
    <Dialog
      open={quickAddOpen}
      onClose={() => setQuickAddOpen(false)}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Quick Add</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            What would you like to add?
          </Typography>
          <Grid container spacing={2}>
            {EVENT_TYPES.map((type) => (
              <Grid item xs={6} key={type.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    textAlign: "center",
                    p: 2,
                    "&:hover": {
                      backgroundColor: alpha(type.color, 0.1),
                      transform: "translateY(-2px)",
                      transition: "transform 0.2s",
                    },
                  }}
                  onClick={() => {
                    quickCreate(type.id);
                    setQuickAddOpen(false);
                  }}
                >
                  <Box sx={{ color: type.color, mb: 1, fontSize: 32 }}>
                    {type.icon}
                  </Box>
                  <Typography variant="body2" fontWeight="medium">
                    {type.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {type.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setQuickAddOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );

  // ========== NOTIFICATIONS PANEL ==========
  const NotificationsPanel = () => (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Box sx={{ width: 360, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Notifications</Typography>
          <Box>
            <IconButton
              size="small"
              onClick={markAllNotificationsAsRead}
              title="Mark all as read"
            >
              <CheckCircle />
            </IconButton>
            <IconButton
              size="small"
              onClick={clearAllNotifications}
              title="Clear all"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        {notifications.length === 0 ? (
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ py: 4 }}
          >
            No notifications
          </Typography>
        ) : (
          <List sx={{ maxHeight: 400, overflow: "auto" }}>
            {notifications.slice(0, 10).map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  bgcolor: notification.read ? "transparent" : "action.hover",
                  mb: 1,
                  borderRadius: 1,
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <CheckCircle />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <Notifications />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(notification.timestamp), {
                          addSuffix: true,
                        })}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        {notifications.length > 10 && (
          <Button fullWidth sx={{ mt: 1 }}>
            View All Notifications
          </Button>
        )}
      </Box>
    </Popover>
  );

  // ========== EVENT MENU ==========
  const EventMenu = () => (
    <Menu
      anchorEl={eventMenuAnchor}
      open={Boolean(eventMenuAnchor)}
      onClose={() => setEventMenuAnchor(null)}
    >
      <MenuItem
        onClick={() => {
          if (selectedEventForMenu) {
            handleOpenDialog(selectedEventForMenu);
            setEventMenuAnchor(null);
          }
        }}
      >
        <EditIcon sx={{ mr: 1 }} /> Edit
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (selectedEventForMenu) {
            setEmailContent({
              to: selectedEventForMenu.customerInfo?.email || "",
              subject: `Regarding: ${selectedEventForMenu.summary}`,
              body: `Hello,\n\nRegarding your ${selectedEventForMenu.type}: ${
                selectedEventForMenu.summary
              }\n\nBest regards,\n${userProfile?.name || "Calendar System"}`,
            });
            setEmailDialogOpen(true);
            setEventMenuAnchor(null);
          }
        }}
      >
        <Email sx={{ mr: 1 }} /> Send Email
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (selectedEventForMenu?.customerInfo?.phone) {
            window.open(
              `tel:${selectedEventForMenu.customerInfo.phone}`,
              "_blank",
            );
          }
          setEventMenuAnchor(null);
        }}
      >
        <Call sx={{ mr: 1 }} /> Call
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (selectedEventForMenu) {
            deleteEvent(
              selectedEventForMenu.id,
              selectedEventForMenu.calendarId,
            );
            setEventMenuAnchor(null);
          }
        }}
        sx={{ color: "error.main" }}
      >
        <DeleteIcon sx={{ mr: 1 }} /> Delete
      </MenuItem>
    </Menu>
  );

  // ========== RENDER AUTHENTICATION BUTTON ==========
  const renderAuthButton = () => {
    if (accessToken && userProfile) {
      return (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            avatar={<Avatar src={userProfile?.picture} />}
            label={userProfile?.name || userProfile?.email || "User"}
            variant="outlined"
            color="primary"
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setQuickAddOpen(true)}
          >
            Quick Add
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={syncCalendar}
            disabled={loading || !isTokenValidated}
          >
            {syncStatus === "syncing" ? "Syncing..." : "Sync"}
          </Button>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      );
    } else {
      return (
        <Button
          variant="contained"
          startIcon={<EventIcon />}
          onClick={() => login()}
          disabled={loading}
          size="large"
          color="primary"
        >
          {loading ? <CircularProgress size={24} /> : "Connect Google Calendar"}
        </Button>
      );
    }
  };

  // ========== MAIN RENDER ==========
  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          p: 3,
          bgcolor: "background.default",
          color: "text.primary",
          minHeight: "100vh",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {sidebarOpen && (
              <IconButton onClick={toggleSidebar}>
                <ChevronLeft />
              </IconButton>
            )}
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <EventIcon /> Google Calendar
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Complete calendar solution with events, tasks, meetings,
                appointments, reminders, and notifications
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Search Bar */}
            <TextField
              size="small"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: 200 }}
              inputRef={searchRef}
            />

            {/* Notification Bell */}
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ position: "relative" }}
            >
              <Badge badgeContent={getUnreadNotificationCount()} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            {/* Settings */}
            <IconButton onClick={() => setSettingsOpen(true)}>
              <Settings />
            </IconButton>

            {/* Theme Toggle */}
            <IconButton onClick={toggleTheme}>
              {themeMode === "light" ? <DarkMode /> : <LightMode />}
            </IconButton>

            {renderAuthButton()}
          </Box>
        </Box>

        {/* User Info Card */}
        {userProfile && (
          <Card sx={{ mb: 3, bgcolor: "primary.light", color: "white" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Avatar
                    src={userProfile.picture}
                    sx={{ width: 60, height: 60 }}
                  />
                  <Box>
                    <Typography variant="h6">
                      Welcome, {userProfile.name}!
                    </Typography>
                    <Typography variant="body2">
                      {userProfile.email} | Connected to Google Calendar
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    icon={isOnline ? <Cloud /> : <CloudOff />}
                    label={isOnline ? "Online" : "Offline"}
                    color={isOnline ? "success" : "default"}
                    sx={{ color: "white" }}
                  />
                  <Chip
                    label={`${stats.totalEvents} Events`}
                    color="info"
                    sx={{ color: "white" }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {errorDetails && (
          <Alert
            severity={
              errorDetails.type === "config_required" ? "warning" : "error"
            }
            sx={{ mb: 3 }}
            icon={<WarningIcon />}
            onClose={clearError}
            action={
              errorDetails.type === "config_required" && (
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => setConfigHelpOpen(true)}
                >
                  Fix Configuration
                </Button>
              )
            }
          >
            <Typography variant="h6" gutterBottom>
              {errorDetails.message}
            </Typography>
            {Array.isArray(errorDetails.details) ? (
              <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                {errorDetails.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {errorDetails.details}
              </Typography>
            )}
          </Alert>
        )}

        {/* Main Content */}
        {sidebarOpen ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              {/* Sidebar Content */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Calendars
                  </Typography>
                  <List>
                    {calendars.map((calendar) => (
                      <ListItem key={calendar.id} disablePadding>
                        <ListItemButton
                          selected={selectedCalendar === calendar.id}
                          onClick={() => setSelectedCalendar(calendar.id)}
                        >
                          <ListItemIcon>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                bgcolor: getColorById(calendar.color),
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText primary={calendar.name} />
                          <Switch
                            size="small"
                            checked={calendar.visible}
                            onChange={(e) => {
                              e.stopPropagation();
                              setCalendars(
                                calendars.map((c) =>
                                  c.id === calendar.id
                                    ? { ...c, visible: !c.visible }
                                    : c,
                                ),
                              );
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {Object.entries(stats).map(([key, value]) => (
                  <Grid item xs={6} key={key}>
                    <Card>
                      <CardContent sx={{ textAlign: "center", p: 1 }}>
                        <Typography variant="h4" color="primary">
                          {value}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .toLowerCase()
                            .replace(/^\w/, (c) => c.toUpperCase())}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Upcoming Events */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Upcoming
                  </Typography>
                  <List dense>
                    {getUpcomingEvents().map((event) => (
                      <ListItem key={event.id}>
                        <ListItemText
                          primary={event.summary}
                          secondary={format(
                            new Date(
                              event.start?.dateTime ||
                                event.dueDate ||
                                event.reminderTime,
                            ),
                            "MMM d, h:mm a",
                          )}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={9}>
              {/* Calendar Navigation */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton onClick={goToPrevious}>
                      <ChevronLeft />
                    </IconButton>
                    <Button
                      variant="outlined"
                      startIcon={<TodayIcon />}
                      onClick={goToToday}
                    >
                      Today
                    </Button>
                    <IconButton onClick={goToNext}>
                      <ChevronRight />
                    </IconButton>
                    <Typography variant="h6" sx={{ ml: 2 }}>
                      {format(currentDate, "MMMM yyyy")}
                    </Typography>
                  </Box>

                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(e, newMode) => newMode && setViewMode(newMode)}
                    size="small"
                  >
                    {CALENDAR_VIEWS.map((view) => (
                      <ToggleButton key={view.id} value={view.id}>
                        {view.icon}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>

                {/* Calendar View */}
                {renderCalendarView()}
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Box>
            {/* Statistics Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {Object.entries(stats)
                .slice(0, 4)
                .map(([key, value]) => (
                  <Grid item xs={6} sm={3} key={key}>
                    <Card>
                      <CardContent sx={{ textAlign: "center", p: 2 }}>
                        <Typography variant="h3" color="primary">
                          {value}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .toLowerCase()
                            .replace(/^\w/, (c) => c.toUpperCase())}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>

            {/* Calendar Navigation */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton onClick={goToPrevious}>
                    <ChevronLeft />
                  </IconButton>
                  <Button
                    variant="outlined"
                    startIcon={<TodayIcon />}
                    onClick={goToToday}
                  >
                    Today
                  </Button>
                  <IconButton onClick={goToNext}>
                    <ChevronRight />
                  </IconButton>
                  <Typography variant="h6" sx={{ ml: 2 }}>
                    {format(currentDate, "MMMM yyyy")}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(e, newMode) => newMode && setViewMode(newMode)}
                    size="small"
                  >
                    {CALENDAR_VIEWS.map((view) => (
                      <ToggleButton key={view.id} value={view.id}>
                        {view.icon}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                  <IconButton onClick={toggleSidebar}>
                    <ChevronRight />
                  </IconButton>
                </Box>
              </Box>

              {/* Calendar View */}
              {renderCalendarView()}
            </Paper>
          </Box>
        )}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
          scroll="paper"
        >
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {selectedEvent ? <EditIcon /> : <AddIcon />}
              {selectedEvent ? "Edit Event" : `Create New ${formData.type}`}
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ pt: 2 }}>
              <Tabs
                value={formData.type}
                onChange={(e, newType) =>
                  setFormData({ ...formData, type: newType })
                }
                sx={{ mb: 3 }}
              >
                {EVENT_TYPES.map((type) => (
                  <Tab
                    key={type.id}
                    value={type.id}
                    icon={type.icon}
                    label={type.name}
                  />
                ))}
              </Tabs>

              <Grid container spacing={2}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title *"
                    value={formData.summary}
                    onChange={(e) =>
                      setFormData({ ...formData, summary: e.target.value })
                    }
                    required
                    error={!formData.summary}
                    helperText={!formData.summary ? "Title is required" : ""}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </Grid>

                {/* Date & Time */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Start Time *"
                    value={formData.startTime}
                    onChange={(e) => {
                      const newStartTime = e.target.value;
                      setFormData({
                        ...formData,
                        startTime: newStartTime,
                        endTime:
                          !formData.endTime ||
                          new Date(newStartTime) >= new Date(formData.endTime)
                            ? formatForDateTimeLocal(
                                addHours(new Date(newStartTime), 1),
                              )
                            : formData.endTime,
                      });
                    }}
                    InputLabelProps={{ shrink: true }}
                    required
                    error={!formData.startTime}
                    helperText={
                      !formData.startTime ? "Start time is required" : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="End Time *"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                    required
                    error={
                      !formData.endTime ||
                      new Date(formData.endTime) <= new Date(formData.startTime)
                    }
                    helperText={
                      !formData.endTime
                        ? "End time is required"
                        : new Date(formData.endTime) <=
                            new Date(formData.startTime)
                          ? "End time must be after start time"
                          : ""
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.allDay}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            allDay: e.target.checked,
                          })
                        }
                      />
                    }
                    label="All Day Event"
                  />
                </Grid>

                {/* Location & Calendar */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Calendar</InputLabel>
                    <Select
                      value={formData.calendarId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          calendarId: e.target.value,
                        })
                      }
                      label="Calendar"
                    >
                      {calendars.map((calendar) => (
                        <MenuItem key={calendar.id} value={calendar.id}>
                          {calendar.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Color */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Color
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {CALENDAR_COLORS.map((color) => (
                      <Tooltip key={color.id} title={color.name}>
                        <IconButton
                          sx={{
                            bgcolor: color.hex,
                            width: 32,
                            height: 32,
                            "&:hover": { bgcolor: color.hex, opacity: 0.8 },
                            border:
                              formData.color === color.id
                                ? "2px solid white"
                                : "none",
                            boxShadow:
                              formData.color === color.id
                                ? `0 0 0 2px ${color.hex}`
                                : "none",
                          }}
                          onClick={() =>
                            setFormData({ ...formData, color: color.id })
                          }
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </Grid>

                {/* Type-Specific Fields */}
                {formData.type === "task" && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }}>
                        <Typography variant="h6">Task Details</Typography>
                      </Divider>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={formData.taskStatus}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              taskStatus: e.target.value,
                            })
                          }
                          label="Status"
                        >
                          {TASK_STATUSES.map((status) => (
                            <MenuItem key={status.id} value={status.id}>
                              {status.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="datetime-local"
                        label="Due Date"
                        value={formData.dueDate}
                        onChange={(e) =>
                          setFormData({ ...formData, dueDate: e.target.value })
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Checklist
                      </Typography>
                      <Box sx={{ maxHeight: 200, overflow: "auto" }}>
                        {formData.checklist.map((item, index) => (
                          <TaskChecklistItem
                            key={item.id || index}
                            item={item}
                            index={index}
                            onToggle={(idx) => {
                              const newChecklist = [...formData.checklist];
                              newChecklist[idx].completed =
                                !newChecklist[idx].completed;
                              setFormData({
                                ...formData,
                                checklist: newChecklist,
                              });
                            }}
                            onEdit={(idx, updatedItem) => {
                              const newChecklist = [...formData.checklist];
                              newChecklist[idx] = updatedItem;
                              setFormData({
                                ...formData,
                                checklist: newChecklist,
                              });
                            }}
                            onDelete={(idx) => {
                              const newChecklist = formData.checklist.filter(
                                (_, i) => i !== idx,
                              );
                              setFormData({
                                ...formData,
                                checklist: newChecklist,
                              });
                            }}
                          />
                        ))}
                      </Box>
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            checklist: [
                              ...formData.checklist,
                              {
                                id: uuidv4(),
                                text: "New item",
                                completed: false,
                              },
                            ],
                          });
                        }}
                        sx={{ mt: 1 }}
                      >
                        Add Item
                      </Button>
                    </Grid>
                  </>
                )}

                {formData.type === "appointment" && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }}>
                        <Typography variant="h6">Customer Details</Typography>
                      </Divider>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Customer Name"
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerName: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Customer Phone"
                        value={formData.customerPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerPhone: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Customer Email"
                        value={formData.customerEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerEmail: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Service Type</InputLabel>
                        <Select
                          value={formData.serviceType}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              serviceType: e.target.value,
                            })
                          }
                          label="Service Type"
                        >
                          <MenuItem value="">Select a service</MenuItem>
                          {SERVICE_TYPES.map((service) => (
                            <MenuItem key={service.id} value={service.name}>
                              {service.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Vehicle Model"
                        value={formData.vehicleInfo.model}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vehicleInfo: {
                              ...formData.vehicleInfo,
                              model: e.target.value,
                            },
                          })
                        }
                      />
                    </Grid>
                  </>
                )}

                {formData.type === "reminder" && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }}>
                        <Typography variant="h6">Reminder Settings</Typography>
                      </Divider>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="datetime-local"
                        label="Reminder Time"
                        value={formData.reminderTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reminderTime: e.target.value,
                          })
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Repeat</InputLabel>
                        <Select
                          value={formData.repeatReminder}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              repeatReminder: e.target.value,
                            })
                          }
                          label="Repeat"
                        >
                          {RECURRENCE_PATTERNS.map((pattern) => (
                            <MenuItem key={pattern.id} value={pattern.id}>
                              {pattern.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.important}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                important: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Important Reminder"
                      />
                    </Grid>
                  </>
                )}

                {formData.type === "meeting" && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }}>
                        <Typography variant="h6">Meeting Details</Typography>
                      </Divider>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Agenda"
                        value={formData.agenda}
                        onChange={(e) =>
                          setFormData({ ...formData, agenda: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Meeting Link"
                        value={formData.conferenceLink}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            conferenceLink: e.target.value,
                          })
                        }
                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      />
                    </Grid>
                  </>
                )}

                {/* Priority */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="h6">Priority & Status</Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      label="Priority"
                    >
                      {PRIORITY_LEVELS.map((level) => (
                        <MenuItem key={level.id} value={level.id}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <span>{level.icon}</span>
                            {level.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      label="Status"
                    >
                      {EVENT_STATUSES.map((status) => (
                        <MenuItem key={status.id} value={status.id}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Notifications */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="h6">Notifications</Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Notification Methods
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {NOTIFICATION_TYPES.map((type) => (
                      <Chip
                        key={type.id}
                        icon={type.icon}
                        label={type.name}
                        onClick={() => {
                          const current = formData.notifications;
                          const exists = current.some(
                            (n) => n.type === type.id,
                          );
                          const newTypes = exists
                            ? current.filter((n) => n.type !== type.id)
                            : [
                                ...current,
                                { type: type.id, minutes: 30, sent: false },
                              ];
                          setFormData({
                            ...formData,
                            notifications: newTypes,
                          });
                        }}
                        color={
                          formData.notifications.some((n) => n.type === type.id)
                            ? "primary"
                            : "default"
                        }
                        variant={
                          formData.notifications.some((n) => n.type === type.id)
                            ? "filled"
                            : "outlined"
                        }
                      />
                    ))}
                  </Box>
                </Grid>

                {formData.notifications.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Notification Timing
                    </Typography>
                    <Grid container spacing={1}>
                      {formData.notifications.map((notif, index) => (
                        <Grid item xs={12} key={index}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Typography variant="body2" sx={{ minWidth: 80 }}>
                              {
                                NOTIFICATION_TYPES.find(
                                  (t) => t.id === notif.type,
                                )?.name
                              }
                            </Typography>
                            <FormControl size="small" sx={{ flex: 1 }}>
                              <Select
                                value={notif.minutes}
                                onChange={(e) => {
                                  const newNotifications = [
                                    ...formData.notifications,
                                  ];
                                  newNotifications[index].minutes =
                                    e.target.value;
                                  setFormData({
                                    ...formData,
                                    notifications: newNotifications,
                                  });
                                }}
                              >
                                {REMINDER_TIMINGS.map((timing) => (
                                  <MenuItem
                                    key={timing.value}
                                    value={timing.value}
                                  >
                                    {timing.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.sendEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sendEmail: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Send email notification"
                  />
                </Grid>

                {/* Error Alert for Time Range */}
                {formData.endTime &&
                  new Date(formData.endTime) <=
                    new Date(formData.startTime) && (
                    <Grid item xs={12}>
                      <Alert severity="error">
                        End time must be after start time. Please adjust the end
                        time.
                      </Alert>
                    </Grid>
                  )}
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              startIcon={<Close />}
              color="inherit"
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                if (selectedEvent) {
                  updateEvent();
                } else {
                  createEvent();
                }
              }}
              startIcon={selectedEvent ? <Save /> : <AddIcon />}
              disabled={
                !formData.summary ||
                !formData.startTime ||
                !formData.endTime ||
                new Date(formData.endTime) <= new Date(formData.startTime) ||
                loading
              }
              color="primary"
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : selectedEvent ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Event Menu */}
        <EventMenu />

        {/* Configuration Help Dialog */}
        <ConfigHelpDialog />

        {/* Settings Dialog */}
        <SettingsDialog />

        {/* Email Dialog */}
        <EmailDialog />

        {/* Quick Add Dialog */}
        <QuickAddDialog />

        {/* Notifications Panel */}
        <NotificationsPanel />

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            severity={notification.severity}
            onClose={() => setNotification({ ...notification, open: false })}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <audio ref={notificationSoundRef} preload="auto">
          <source src="/notification.mp3" type="audio/mpeg" />
        </audio>
      </Box>
    </DndProvider>
  );
};

export default EnhancedGoogleCalendar;
