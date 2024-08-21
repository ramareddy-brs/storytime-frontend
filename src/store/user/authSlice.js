import { createSlice } from "@reduxjs/toolkit";

const userData = JSON.parse(localStorage.getItem("userdata")) || null;
const token = JSON.parse(localStorage.getItem("token")) || null;
const spotifyToken = JSON.parse(localStorage.getItem("spotifytoken")) || null;

const initialState = {
  token,
  spotifyToken,
  isLoggedIn: !!token,
  userData,
  isSidebarOpen: false,
  storyInfo: { name: null, id: null },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      state.spotifyToken = action.payload.spotifyToken.access_token;
      localStorage.setItem(
        "spotifytoken",
        JSON.stringify(action.payload.spotifyToken.access_token)
      );
      state.isLoggedIn = true;
    },
    logout: (state, action) => {
      state.token = null;
      state.spotifyToken = null;
      state.userData = null;
      localStorage.removeItem("token");
      localStorage.removeItem("spotifytoken");
      localStorage.removeItem("userdata");
      state.isLoggedIn = false;
    },
    setUserProfile: (state, action) => {
      state.userData = action.payload.profileData;
      localStorage.setItem(
        "userdata",
        JSON.stringify(action.payload.profileData)
      );
    },
    updateUserProfile: (state, action) => {
      state.userData = { ...userData, ...action.payload };
      localStorage.setItem("userdata", JSON.stringify(state.userData));
    },
    toggleLanguageSelection: (state, action) => {
      const langugageId = action.payload;
      const index = state.userData.languages.indexOf(langugageId);
      if (index === -1) {
        state.userData.languages.push(langugageId);
      } else {
        state.userData.languages.splice(index, 1);
      }
      const updatedData = { ...userData, languages: state.userData.languages };
      localStorage.setItem("userdata", JSON.stringify(updatedData));
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setStoryInfo: (state, action) => {
      (state.storyInfo.id = action.payload.s_id),
        (state.storyInfo.name = action.payload.s_name);
    },
    updateSpotifyToken: (state, action) => {
      state.spotifyToken = action.payload.spotifyToken.access_token;
      localStorage.setItem(
        "spotifytoken",
        JSON.stringify(action.payload.spotifyToken.access_token)
      );
    },
  },
});

export const {
  login,
  logout,
  setUserProfile,
  updateUserProfile,
  toggleLanguageSelection,
  toggleSidebar,
  setStoryInfo,
  updateSpotifyToken
} = authSlice.actions;

export default authSlice.reducer;
