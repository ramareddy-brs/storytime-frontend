import { apiSlice } from "../apiSlice";
const USER_ENDPOINT = "/api/users";

export const userAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginAPI: builder.mutation({
      query: (data) => ({
        url: `${USER_ENDPOINT}/login`,
        method: "POST",
        body: data,
      }),
    }),
    registerAPI: builder.mutation({
      query: (data) => ({
        url: `${USER_ENDPOINT}/register`,
        method: "POST",
        body: data,
      }),
    }),
    getUserProfileAPI: builder.query({
      query: () => ({
        url: `${USER_ENDPOINT}/profile`,
        method: "GET",
      }),
    }),
    updateUserProfileAPI: builder.mutation({
      query: (data) => ({
        url: `${USER_ENDPOINT}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    updateLanguageAPI: builder.mutation({
      query: (data) => ({
        url: `${USER_ENDPOINT}/preferredlanguage`,
        method: "PUT",
        body: data,
      }),
    }),
    updatePasswordAPI: builder.mutation({
      query: (data) => ({
        url: `${USER_ENDPOINT}/updatepassword`,
        method: "PUT",
        body: data,
      }),
    }),
    forgotPasswordAPI: builder.mutation({
      query: (data) => ({
        url: `${USER_ENDPOINT}/forgotpassword`,
        method: "POST",
        body: data,
      }),
    }),
    resetPasswordAPI: builder.mutation({
      query: ({ token, password }) => ({
        url: `${USER_ENDPOINT}/resetpassword/${token}`,
        method: "POST",
        body: { password },
      }),
    }),

    saveStoryAPI: builder.mutation({
      query: (data) => ({
        url: `${USER_ENDPOINT}/savestory`,
        method: "POST",
        body: data,
      }),
    }),

    removeStoryAPI: builder.mutation({
      query: (data) => ({
        url: `${USER_ENDPOINT}/removestory`,
        method: "DELETE",
        body: data,
      }),
    }),

    getLibrary: builder.query({
      query: (data) => ({
        url: `${USER_ENDPOINT}/library`,
        method: "GET",
      }),
    }),

    getRefreshTokenAPI: builder.query({
      query: (data) => ({
        url: `${USER_ENDPOINT}/refreshtoken`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginAPIMutation,
  useRegisterAPIMutation,
  useGetUserProfileAPIQuery,
  useUpdateUserProfileAPIMutation,
  useUpdateLanguageAPIMutation,
  useUpdatePasswordAPIMutation,
  useForgotPasswordAPIMutation,
  useResetPasswordAPIMutation,
  useSaveStoryAPIMutation,
  useRemoveStoryAPIMutation,
  useGetLibraryQuery,
  useGetRefreshTokenAPIQuery,
} = userAPISlice;
