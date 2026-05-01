import { format } from "date-fns";

// ========== EMAIL TEMPLATES ==========
export const EmailTemplates = {
  eventCreated: (event, user) => ({
    subject: `New Event: ${event.summary}`,
    body: `
      <h2>New Event Created</h2>
      <p><strong>Event:</strong> ${event.summary}</p>
      <p><strong>Date:</strong> ${format(
        new Date(event.start.dateTime),
        "PPPP",
      )}</p>
      <p><strong>Time:</strong> ${format(
        new Date(event.start.dateTime),
        "p",
      )} - ${format(new Date(event.end.dateTime), "p")}</p>
      <p><strong>Location:</strong> ${event.location || "Not specified"}</p>
      <p><strong>Description:</strong> ${
        event.description || "No description"
      }</p>
      <br>
      <p>This event was created by ${user?.name || "System"}.</p>
    `,
  }),

  eventUpdated: (event, user) => ({
    subject: `Event Updated: ${event.summary}`,
    body: `
      <h2>Event Updated</h2>
      <p><strong>Event:</strong> ${event.summary}</p>
      <p><strong>Date:</strong> ${format(
        new Date(event.start.dateTime),
        "PPPP",
      )}</p>
      <p><strong>Time:</strong> ${format(
        new Date(event.start.dateTime),
        "p",
      )} - ${format(new Date(event.end.dateTime), "p")}</p>
      <p><strong>Location:</strong> ${event.location || "Not specified"}</p>
      <p><strong>Status:</strong> ${event.status}</p>
      <br>
      <p>This event was updated by ${user?.name || "System"}.</p>
    `,
  }),

  eventReminder: (event, minutes) => ({
    subject: `Reminder: ${event.summary} starts ${
      minutes === 0 ? "now" : `in ${minutes} minutes`
    }`,
    body: `
      <h2>Event Reminder</h2>
      <p><strong>Event:</strong> ${event.summary}</p>
      <p><strong>Starts:</strong> ${format(
        new Date(event.start.dateTime),
        "PPPPp",
      )}</p>
      <p><strong>Location:</strong> ${event.location || "Not specified"}</p>
      <p><strong>Description:</strong> ${
        event.description || "No description"
      }</p>
    `,
  }),

  taskAssigned: (task) => ({
    subject: `New Task Assigned: ${task.summary}`,
    body: `
      <h2>Task Assigned</h2>
      <p><strong>Task:</strong> ${task.summary}</p>
      <p><strong>Due:</strong> ${format(new Date(task.dueDate), "PPPP")}</p>
      <p><strong>Priority:</strong> ${task.priority}</p>
      <p><strong>Description:</strong> ${
        task.description || "No description"
      }</p>
      <br>
      <p>This task has been assigned to you.</p>
    `,
  }),

  appointmentConfirmed: (appointment, customer) => ({
    subject: `Appointment Confirmed: ${appointment.summary}`,
    body: `
      <h2>Appointment Confirmation</h2>
      <p><strong>Service:</strong> ${appointment.summary}</p>
      <p><strong>Date & Time:</strong> ${format(
        new Date(appointment.start.dateTime),
        "PPPPp",
      )}</p>
      <p><strong>Location:</strong> ${
        appointment.location || "Not specified"
      }</p>
      <p><strong>Service Provider:</strong> ${
        appointment.organizer?.displayName || "Trust Auto Solution"
      }</p>
      <br>
      <p>Dear ${customer?.name || "Customer"},</p>
      <p>Your appointment has been confirmed. We look forward to seeing you!</p>
    `,
  }),
};
