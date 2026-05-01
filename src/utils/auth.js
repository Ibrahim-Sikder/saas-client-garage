import axios from "axios";

// ========== TOKEN MANAGEMENT FUNCTIONS ==========
export const saveAuthSession = (accessToken, userProfile) => {
  try {
    localStorage.setItem("google_access_token", accessToken);
    localStorage.setItem("google_user_profile", JSON.stringify(userProfile));
    localStorage.setItem("auth_timestamp", Date.now().toString());

    // Also save to sessionStorage for additional persistence
    sessionStorage.setItem("google_access_token", accessToken);
    sessionStorage.setItem("google_user_profile", JSON.stringify(userProfile));

    console.log("Auth session saved successfully");
  } catch (error) {
    console.error("Error saving auth session:", error);
  }
};

export const clearAuthSession = () => {
  try {
    localStorage.removeItem("google_access_token");
    localStorage.removeItem("google_user_profile");
    localStorage.removeItem("auth_timestamp");
    localStorage.removeItem("calendar_events");

    sessionStorage.removeItem("google_access_token");
    sessionStorage.removeItem("google_user_profile");

    console.log("Auth session cleared");
  } catch (error) {
    console.error("Error clearing auth session:", error);
  }
};

export const loadAuthSession = () => {
  try {
    // Try to load from localStorage first
    let token = localStorage.getItem("google_access_token");
    let profile = localStorage.getItem("google_user_profile");

    // If not found in localStorage, try sessionStorage
    if (!token || !profile) {
      token = sessionStorage.getItem("google_access_token");
      profile = sessionStorage.getItem("google_user_profile");
    }

    if (token && profile) {
      const parsedProfile = JSON.parse(profile);

      // Check if token is recent (within 1 hour)
      const authTimestamp = localStorage.getItem("auth_timestamp");
      const currentTime = Date.now();
      const oneHour = 60 * 60 * 1000;

      if (authTimestamp && currentTime - parseInt(authTimestamp) < oneHour) {
        return { token, profile: parsedProfile };
      } else {
        // Token is too old, clear it
        clearAuthSession();
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error("Error loading auth session:", error);
    clearAuthSession();
    return null;
  }
};

export const verifyTokenValidity = async (token) => {
  try {
    // Simple token validation by making a lightweight API call
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v1/tokeninfo",
      {
        params: { access_token: token },
        timeout: 5000,
      },
    );

    // Check if token is valid and has calendar scope
    if (response.data.expires_in > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
};
