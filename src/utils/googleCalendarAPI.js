// src/utils/googleCalendarAPI.js
export const enableCalendarAPI = async () => {
  // Direct enable link
  const enableLink =
    "https://console.developers.google.com/apis/api/calendar-json.googleapis.com/overview?project=731493911262";

  // Open in new tab
  window.open(enableLink, "_blank");

  return {
    success: true,
    message: "Please enable Google Calendar API in the new tab that opened.",
    steps: [
      "1. Click 'ENABLE' button",
      "2. Wait 2-5 minutes",
      "3. Refresh this page and try again",
    ],
  };
};
