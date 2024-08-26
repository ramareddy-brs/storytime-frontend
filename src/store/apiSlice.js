import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://backend-storytime.onrender.com",
  prepareHeaders: (headers, { getState }) => {
    const state = getState();
 
    const token = state.auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "storytime",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});
