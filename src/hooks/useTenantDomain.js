
import { useState, useEffect } from "react";

export function getTenantDomain(hostname) {
  if (!hostname) return "";

  if (hostname.includes("localhost")) {
    const hostWithoutPort = hostname.split(":")[0];
    const parts = hostWithoutPort.split(".");
    // Remove 'localhost' part (last part)
    return parts.slice(0, parts.length - 1).join(".");
  }

  return hostname;
}

export function useTenantDomain() {
  const [tenantDomain, setTenantDomain] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const tenant = getTenantDomain(hostname);
      setTenantDomain(tenant);
    }
  }, []);

  return { tenantDomain };
}
