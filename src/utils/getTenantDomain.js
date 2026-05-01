export function getTenantDomain(hostname) {
  if (!hostname) return "";

  const parts = hostname.split(".");
  if (parts.length > 2) {
    return parts[0];
  }
  return hostname;
}
