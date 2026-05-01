import { SERVICE_TYPES } from "../constants";

export const determineEventType = (event) => {
  const summary = (event.summary || "").toLowerCase();
  const description = (event.description || "").toLowerCase();

  if (summary.includes("reminder") || description.includes("reminder")) {
    return "reminder";
  }
  if (summary.includes("meeting") || description.includes("meeting")) {
    return "meeting";
  }
  if (summary.includes("appointment") || description.includes("appointment")) {
    return "appointment";
  }
  if (summary.includes("task") || description.includes("task")) {
    return "task";
  }
  return "event";
};

export const extractServiceType = (description) => {
  if (!description) return "General";
  const service = SERVICE_TYPES.find((service) =>
    description.toLowerCase().includes(service.name.toLowerCase()),
  );
  return service?.name || "General";
};

export const extractCustomerInfo = (description) => {
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
