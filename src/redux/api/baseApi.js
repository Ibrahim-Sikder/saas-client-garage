import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setUser } from "../feature/authSlice";
import { tagTypesList } from "./tagList";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {

    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "POST", credentials: "include" },
      api,
      extraOptions
    );

    if (refreshResult?.data?.success && refreshResult.data.data?.accessToken) {
      const newToken = refreshResult.data.data.accessToken;
      api.dispatch(setUser({ token: newToken }));

      // retry original request again
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.error("Refresh token failed, logging out");
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: tagTypesList,
  endpoints: () => ({}),
});
