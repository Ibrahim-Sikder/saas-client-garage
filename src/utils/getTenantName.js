export const getTenantName = () => {
  if (typeof window === "undefined") return ""; 
  const host = window.location.hostname;

  return host.includes("localhost")
    ? host.split(".")[0]
    : host.split(".")[0];
};
